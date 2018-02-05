const Discord = require("discord.js");
const fs = require("fs");

const client=new Discord.Client();
const openGames={};
const games={};
const userLoad=require('./users.json');
const users={};
const guilds={};

const pre="^";

let gameCount=0;
let userCount=0;

const gameNames=['tic tac toe','connect 4','othello','texas holdem','no limit holdem'];

//{functions
function DM(id,msg){
	client.fetchUser(id).then(x=>x.send(msg));
};

function load(){
	for(let i in userLoad){
		users[i]=userLoad[i];
		users[i].current={};
	}
};
load();
function save(){
	let data = JSON.stringify(users,null,2);
	
	fs.writeFile('./users.json', data, (err) => {  
		if (err) throw err;
		//console.log('User data saved.');
	});
};
//}

//{game functions
let gameF=[];
for(var i=0;i<gameNames.length;i++){
	gameF.push(require('./'+gameNames[i].replace(/ /g,'-')+'.js'));
};

function newGame(game,host,server){
	return(new gameF[game].game(host,server));
};
function gameJoin(game,player){
	return(game.join(player,users));
};
function startGame(game){
	return(game.start(users));
};
function gameAction(game,m,player){
	return(game.action(m,player,users,games,openGames,DM));
};
function quitGame(game,player){
	return(game.quit(player,users,games,openGames,DM));
};
//}

//{commands
const help={
	echo:'syntax: echo <message>\nreplies with <message>',
	help:'syntax: help <command*>\nprovides help on either all commands or a specified command',
	ping:'syntax: ping\nreplies with "pong"',
	rng:'syntax: rng <sides*>\nrolls an n sided die, default is 6',
	stats:'syntax: stats <username*>\ngives statistics on either you or a specified user',
	
	bank:'syntax: bank\ntells you how much you have in your bank',
	game:'syntax: game list\nlists the currently supported games',
	give:'syntax: give <user> <amount>\ngives the specified user the specified amount of credit from your account',
	open:'syntax: open games\nlists all open games',
	new:'syntax: new game <game> <buy-in*>\ncreates a new open game of the game specified (chosen from the game list). If a buy-in is specified, it will go into the pot and anyone who joins must pay that buy-in',
	join:'syntax: join <@host>\nlets you join a game with a given game host. You must mention the host.',
	quit:'syntax: quit <reason*>\nlets you quit and forfeit a game you\'re in',
	leave:'syntax: leave <reason*>\nlets you leave and forfeit a game you\'re in',
};
const GeneralCommands={
	version:function(){
		return("https://github.com/EFHIII/gambit");
	},
	help:function(msg,args){
		if(args.length===0){
			msg.author.send("```markdown\nHelp\n====\n * The prefix ^ must be used at the beginning of any bot command *\n\n"+
			"General Commands\n================\n"+
				"echo  <message>- have the bot repeat a phrase\n\n"+
				"help <command*> - The help command, with an optional command specific help argument\n\n"+
				"ping - responds with 'pong'\n\n"+
				"rng <sides> - rolls an n sided die, default is 6'\n\n"+
				"stats <username*> - gives you stats on a given user. Default is yourself\n\n"+
				"version - links the bot's source code\n\n"+
			"Game Commands\n=============\n"+
				"bank - tells you how much you have in your bank\n\n"+
				"game list - lists the currently supported games\n\n"+
				"give <user> <amount> - gives the specified user the specified amount of credit from your account\n\n"+
				"new game <game> <buy-in*> - creates a new open game of the game specified (chosen from the game list)\n\n"+
				"open games - lists all open games\n\n"+
				"join <@host> - lets you join a game with a given game host\n\n"+
				"quit game - lets you quit and forfeit a game you're in"+
			"\n```");
			return('Check your DMs.');
		}
		else{
			if(help[args[0]]){
				return(help[args[0]]);
			}
			else{return(args[0]+' is not a supported function.');}
		}
	},
	ping:function(){
		return('Ping!');
	},
	echo:function(msg,args){
		if(args.join(' ')===''){
			return('*silence*');
		}
		return(args.join(' '));
	},
	rng:function(msg,args){
		if(args.length===0){
			return('You rolled a '+Math.floor(Math.random()*6+1)+'!');
		}
		else{
			return('You rolled a '+Math.floor(Math.random()*parseInt(args[0])+1)+'!');
		}
	},
	'yes!':function(){
		return('YES!');
	},
	yes:function(){
		return('YES!');
	}
};
const GameCommands={
	give:function(msg,args){
		if(args.length>1){
			let m=args[0].replace('<@','').replace('!','').replace('>','');
			if(!users.hasOwnProperty(m)){
				return("That user isn't in my database.");
			}
			if(msg.author.id===m){
				return("Consider it done. :wink:");
			}
			let v=parseInt(args[1]);
			if(v<0){
				return('Nice try, thief...');
			}
			if(users[msg.author.id].bank<v){
				return("You don't have that much, but the generosity is appreciated.");
			}
			users[msg.author.id].bank-=v;
			users[m].bank+=v;
			return("Transfered $"+v+" from <@"+msg.author.id+"> to <@"+m+">.");
		}
		return('No, you keep it :wink:');
	},
	bank:function(msg){
		return('$'+users[msg.author.id].bank);
	},
	game:function(){
		return(
		"```markdown\nGames\n=====\n"+
			"pay:$2   tic tac toe - A simple 3-in-a-row game.\n"+
			"pay:$5   Connect 4 - A simple 4-in-a-row game.\n"+
			"pay:$8   Othello - A game of collecting territory.\n"+
			"<Poker>  Texas Holdem - The most popular poker variant\n"+
			"<Poker>  No Limit Holdem - Texas Holdem, but without a limit\n"+
		"```");
	},
	open:function(msg){
		let ans="```md\nOpen games\n==========";
		let gms=openGames[msg.guild.id];
		for(let i in gms){
			ans+="\n"+games[msg.guild.id][i].players.length+"/"+games[msg.guild.id][i].max+" "+gameNames[games[msg.guild.id][i].game]+" - host: "+users[i].nick+(games[msg.guild.id][i].buyIn>0?" * Buy-In: $"+games[msg.guild.id][i].buyIn+' *':'');
		}
		ans+="```";
		return(ans);
	},
	stats:function(msg,args){
		if(args.length===0){
			let p=users[msg.author.id];
			try{
			return({embed:{
				title:p.nick+"'s stats",
				fields:[
					{name:'Bank',value:'$'+p.bank},
					{name:'Won',value:p.won+"/"+p.played},
					{name:'Tied',value:p.tied},
					{name:'Quit',value:p.quit},
					{name:'Net Gambling Winnings',value:(p.netwin<0?"-":"")+"$"+Math.abs(p.netwin)},
					{name:'Server status',value:p.current.hasOwnProperty(msg.guild.id)?"Currently playing "+gameNames[games[msg.guild.id][p.current[msg.guild.id]].game]:"Not currently in a game on this server."}
		],
				color: 3447003
			}});
			}catch(e){
				return('I need embed permissions in this channel.');
			}
		}
		else{
			let m=args[0].replace('<@','').replace('!','').replace('>','');
			if(!users.hasOwnProperty(m)){
				return("That user isn't in my database.");
			}
			let p=users[m];
			try{
			return({embed:{
				title:p.nick+"'s stats",
				fields:[
					{name:'Bank',value:'$'+p.bank},
					{name:'Won',value:p.won+"/"+p.played},
					{name:'Tied',value:p.tied},
					{name:'Quit',value:p.quit},
					{name:'Net Gambling Winnings',value:(p.netwin<0?"-":"")+"$"+Math.abs(p.netwin)},
					{name:'Server status',value:p.current.hasOwnProperty(msg.guild.id)?"Currently playing "+gameNames[games[msg.guild.id][p.current[msg.guild.id]].game]:"Not currently in a game on this server."}
		],
				color: 3447003
			}});
			}catch(e){
				return('I need embed permissions in this channel.');
			}
		}
	},
	quit:function(msg){
		if(users[msg.author.id].current.hasOwnProperty(msg.guild.id)){
			return(quitGame(games[msg.guild.id][users[msg.author.id].current[msg.guild.id]],msg.author.id));
		}
		else{
			return("You aren't in a game on this server so you can't quit! MUHAHAHA!");			
		}
	},
	leave:function(msg){
		if(users[msg.author.id].current.hasOwnProperty(msg.guild.id)){
			return(quitGame(games[msg.guild.id][users[msg.author.id].current[msg.guild.id]],msg.author.id));
		}
		else{
			return("Who do you think you are, trying to leave a game you're not even in?");			
		}
	},
	new:function(msg,args){
		if(users[msg.author.id].current.hasOwnProperty(msg.guild.id)){
			return("You can't start a new game in a server where you're already participating in another game.");
		}
		let mm=args.shift();
		let buyIn=0;
		if(Math.abs(parseInt(args[args.length-1]))>0){
			buyIn=Math.abs(parseInt(args[args.length-1]));
			args.pop();
			if(users[msg.author.id].bank<buyIn){
				return("You can't afford your own Buy-in!");
			}
			users[msg.author.id].bank-=buyIn;
		}
		let m=args.join(' ');
		let good=false;
		for(let i=gameNames.length-1;i>=0;i--){
			if(m===gameNames[i]){
				games[msg.guild.id][msg.author.id]=newGame(i,msg.author.id,msg.guild.id);
				games[msg.guild.id][msg.author.id].buyIn=buyIn;
				games[msg.guild.id][msg.author.id].pot=buyIn;
				openGames[msg.guild.id][msg.author.id]=i;
				users[msg.author.id].current[msg.guild.id]=msg.author.id;
				let txt="A new game of "+gameNames[i]+" has been successfully created!";
				i=0;
				good=true;
				return(txt);
			}
		}
		if(!good){
			return('sorry, '+m+' is not currently supported.');
		}
	},
	join:function(msg,args){
		if(users[msg.author.id].current.hasOwnProperty(msg.guild.id)){
			return("You can't join a game in a server where you're already participating in another game.");
		}
		if(args.length===0){
			return("There you go, you're all alone. Happy?");
		}
		let m=args[0].replace('<@','').replace('!','').replace('>','');
		if(openGames[msg.guild.id].hasOwnProperty(m)){
			const game=games[msg.guild.id][m];
			if(users[msg.author.id].bank<game.buyIn){
				return("This game has a buy-in of $"+game.buyIn+" and you only have $"+users[msg.author.id].bank+".");
			}
			users[msg.author.id].bank-=game.buyIn;
			game.pot+=game.buyIn;
			gameJoin(game,msg.author.id);
			users[msg.author.id].current[msg.guild.id]=m;
			if(game.max===game.players.length){
				delete openGames[msg.guild.id][m];
			}
			if(game.min===game.players.length){
				msg.channel.send("<@"+msg.author.id+"> joined <@"+m+">'s game of "+gameNames[game.game]);
				return(startGame(game));
			}
			else{
				return("<@"+msg.author.id+"> joined <@"+m+">'s game of "+gameNames[game.game]);
			}
		}
		else{
			return("<@"+m+"> isn't hosting a joinable game right now.");
		}
	},
};
const devCommands={
	ban:function(msg,args){
		if(args.length>0){
			let m=args[0].replace('<@','').replace('!','').replace('>','');
			if(!users.hasOwnProperty(m)){
				return("That user isn't in my database.");
			}
			if(msg.author.id===m){
				return("Are you sure about that?");
			}
			users[m].banned=true;
			return(":hammer:");
		}
		return('Please specify a user');
	},
	unban:function(msg,args){
		if(args.length>0){
			let m=args[0].replace('<@','').replace('!','').replace('>','');
			if(!users.hasOwnProperty(m)){
				return("That user isn't in my database.");
			}
			if(msg.author.id===m){
				return("Really?");
			}
			users[m].banned=false;
			return(":wave:");
		}
		return('Please specify a user');
	},
	fund:function(msg,args){
		if(args.length>0){
			let v=parseInt(args[0]);
			users[msg.author.id].bank+=v;
			return("Okay, I gave you $"+v+". Spend it wisely.");
		}
		return('Please specify a value.');
	},
	spring:function(){
		//DM('402122635552751616','This is a special ping only for the elite (Sponge, SpongeBot, and EFHIII)');
		DM('167711491078750208','This is a special ping only for the elite (Sponge, SpongeBot, and EFHIII)');
		DM('134800705230733312','This is a special ping only for the elite (Sponge, SpongeBot, and EFHIII)');
		return(':wink:');
	},
	users:function(){
		let ans="```md\nUsers\n=====";
		for(let i in users){
			ans+='\n'+users[i].nick+': '+i+'\n'+Array((users[i].nick+': '+i).length+1).join('=')+'\n'+
				(users[i].banned?' * BANNED * ':'')+
				' bank:$'+users[i].bank+
				' Won:'+users[i].won+'/'+users[i].played+
				' Winnings:'+((users[i].netwin<0?"-":"")+"$"+Math.abs(users[i].netwin));
		}
		ans+="```";
		return(ans);
	},
	games:function(msg,args){
		let ans="```md\nGames\n=====";
		for(let j in games){
			ans+='\n\n'+guilds[j].name+'\n'+Array((guilds[j].name).length+1).join('=');
			for(let i in games[j]){
				ans+="\n"+games[j][i].players.length+"/"+games[j][i].max+" "+gameNames[games[j][i].game]+" - host: "+users[i].nick+(games[j][i].buyIn>0?" * Buy-In: $"+games[j][i].buyIn+' *':'');
			}
		}
		ans+="```";
		return(ans);
	},
	opengames:function(msg,args){
		let ans="```md\nOpen games\n==========";
		for(let j in openGames){
			ans+='\n\n'+guilds[j].name+'\n'+Array((guilds[j].name).length+1).join('=');
			for(let i in openGames[j]){	
				ans+="\n"+games[j][i].players.length+"/"+games[j][i].max+" "+gameNames[games[j][i].game]+" - host: "+users[i].nick+(games[j][i].buyIn>0?" * Buy-In: $"+games[j][i].buyIn+' *':'');
			}
		}
		ans+="```";
		return(ans);
	}
};
//}

//{client events
client.on('ready', () => {
	console.log(`${client.user.tag} online`);
	client.user.setGame(`^help | ${userCount} users`,'https://www.twitch.tv/efhiii');
});

client.on("guildCreate", guild => {
	console.log(`joined ${guild.name} (id: ${guild.id})`);
});

client.on("guildDelete", guild => {
	console.log(`left ${guild.name} (id: ${guild.id})`);
});

client.on('message', msg => {
	//console.log(msg.author.tag+": "+msg.content);
	if(msg.author.bot){return;}
	if(users.hasOwnProperty(msg.author.id)&&users[msg.author.id].banned){return;}
	let m=msg.content.toLowerCase();
	if(m[0]!==pre){
		if(m[0]==='`'){
			m=m.substr(1,m.length-2);
			if(msg.guild&&users.hasOwnProperty(msg.author.id)&&users[msg.author.id].current.hasOwnProperty(msg.guild.id)){
				let txt=gameAction(games[msg.guild.id][users[msg.author.id].current[msg.guild.id]],m,msg.author.id);
				if(Array.isArray(txt)){
					for(let i=0;i<txt.length;i++){
						msg.channel.send(txt[i]);
					}
				}
				else{
					msg.channel.send(txt);
				}
			}
		}
		save();
		return;
	};
	m=m.substr(1);
	m = m.split(" ");
	let cmd=m.shift();
	if(GeneralCommands.hasOwnProperty(cmd)){
		msg.channel.send(GeneralCommands[cmd](msg,m));
		return;
	}
	
	if(!msg.guild){
		msg.channel.send('That command doesn\'t work in DM');
		return;
	}
	if(!openGames.hasOwnProperty(msg.guild.id)){
		openGames[msg.guild.id]={};
		guilds[msg.guild.id]=msg.guild;
	}
	if(!users.hasOwnProperty(msg.author.id)){
		users[msg.author.id]={
			nick:msg.author.username,
			played:0,
			won:0,
			lost:0,
			tied:0,
			quit:0,
			netwin:0,
			bank:0,
			banned:false,
			current:{}
		};
		userCount++;
		client.user.setGame(`^help | ${userCount} users`,'https://www.twitch.tv/efhiii');
	}
	if(!games.hasOwnProperty(msg.guild.id)){
		games[msg.guild.id]={};
	}
	
	if(GameCommands.hasOwnProperty(cmd)){
		msg.channel.send(GameCommands[cmd](msg,m));
		save();
		return;
	}
	
	if(msg.author.id!=134800705230733312){
		return;
	}
	if(devCommands.hasOwnProperty(cmd)){
		msg.channel.send(devCommands[cmd](msg,m));
		save();
		return;
	}
});

client.login('[REDACTED]');
//}

