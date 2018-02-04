const Discord = require("discord.js");

const client=new Discord.Client();
const openGames={};
const games={};
const users={};

const pre="^";

let gameCount=0;
let userCount=0;

const gameNames=['tic tac toe','connect 4','othello','texas holdem'];

//{functions
function DM(id,msg){
	client.fetchUser(id).then(x=>x.send(msg));
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
	
	game:'syntax: game list\nlists the currently supported games',
	open:'syntax: open games\nlists all open games',
	new:'syntax: new game <game>\ncreates a new open game of the game specified (chosen from the game list)',
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
			"Game Commands\n=============\n"+
				"game list - lists the currently supported games\n\n"+
				"open games - lists all open games\n\n"+
				"new game <game> - creates a new open game of the game specified (chosen from the game list)\n\n"+
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
	game:function(){
		return(
		"```markdown\nshort games\n===========\n"+
			"tic tac toe - A simple 3-in-a-row game.\n"+
		"\nlong games\n==========\n"+
			"Connect 4 - A simple 4-in-a-row game.\n"+
			"Othello - A game of collecting territory.\n"+
			"Texas Holdem - The most popular poker variant\n"+
		"```");
	},
	open:function(msg){
		let ans="```markdown\nOpen games\n==========";
		let gms=openGames[msg.guild.id];
		for(let i in gms){
			ans+="\n"+games[msg.guild.id][i].players.length+"/"+games[msg.guild.id][i].max+" "+gameNames[games[msg.guild.id][i].game]+" - host: "+users[i].nick;
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
				return("That user isn't in my database");
				return;
			}
			let p=users[m];
			try{
			return({embed:{
				title:p.nick+"'s stats",
				fields:[
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
		let m=args.join(' ');
		let good=false;
		for(let i=gameNames.length-1;i>=0;i--){
			if(m===gameNames[i]){
				games[msg.guild.id][msg.author.id]=newGame(i,msg.author.id,msg.guild.id);
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
	users:function(){
		let ans="```md\nUsers\n=====";
		for(let i in users){
			ans+='\n'+users[i].nick+': '+i+'\n'+Array((users[i].nick+': '+i).length+1).join('=')+
				'\nWon:'+users[i].won+'/'+users[i].played+
				' Winnings:'+((users[i].netwin<0?"-":"")+"$"+Math.abs(users[i].netwin));
		}
		ans+="```";
		return(ans);
	},
	games:function(msg,args){
		let ans="```md\nGames\n=====";
		for(let j in games){
			ans+='\n\n'+j+'\n'+Array((''+j).length+1).join('=');
			for(let i in games[j]){
				ans+="\n"+games[j][i].players.length+"/"+games[j][i].max+" "+gameNames[games[j][i].game]+" - host: "+users[i].nick;
			}
		}
		ans+="```";
		return(ans);
	},
	opengames:function(msg,args){
		let ans="```md\nOpen games\n==========";
		for(let j in openGames){
			ans+='\n\n'+j+'\n'+Array((''+openGames[j]).length+1).join('=');
			for(let i in openGames[j]){	
				ans+="\n"+openGames[j][i].players.length+"/"+openGames[j][i].max+" "+gameNames[openGames[j][i].game]+" - host: "+users[i].nick;
			}
		}
		ans+="```";
		return(ans);
	},
	rng:function(msg,args){
		if(args.length===0){
			return('You rolled a '+Math.floor(Math.random()*6+1)+'!');
		}
		else{
			return('You rolled a '+Math.floor(Math.random()*parseInt(args[0])+1)+'!');
		}
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
		return;
	}
	
	if(msg.author.id!=134800705230733312){
		return;
	}
	if(devCommands.hasOwnProperty(cmd)){
		msg.channel.send(devCommands[cmd](msg,m));
		return;
	}
});

client.login('[REDACTED]');
//}

