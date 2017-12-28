const Discord = require("discord.js");
const client = new Discord.Client();

const pre="^";

let gameCount=0;

const gameNames=['tic tac toe','connect 4'];

const openGames={};

const games={};

const users={};

//{game board functions
function TTTBoard(data){
	const chars=[':white_large_square:',':x:',':o:'];
	const numbers=[':one:',':two:',':three:',':four:',':five:',':six:',':seven:',':eight:',':nine:'];
	let ans="\n";
	for(let i=0;i<3;i++){
		for(let j=0;j<3;j++){
			if(data[i][j]){
				ans+=chars[data[i][j]];
			}
			else{
				ans+=numbers[i*3+j];
			}
			if(j<2){ans+=chars[0]};
		}
		if(i<2){
			ans+='\n'+Array(6).join(chars[0])+'\n';
		}
	}
	return(ans);
};

function TTTWin(data){
    //cats game
    let cg=true;
    for(let i=0;i<3;i++){
        for(let j=0;j<3;j++){
            if(data[i][j]===0){cg=false;}
        }
    }
    if(cg){return(1);}
    //horizontal and vertical
    for(let i=0;i<3;i++){
        //horizontal
        let good=true;
        let p=data[i][0];
        for(let j=1;j<3;j++){
            if(data[i][j]!==p){
                good=false;
            }
        }
        if(p&&good){
            return(2);
        }
        //vertical
        good=true;
        p=data[0][i];
        for(let j=1;j<3;j++){
            if(data[j][i]!==p){
                good=false;
            }
        }
        if(p&&good){
            return(2);
        }
    }
    //diagonal top left- bottom right
    let good=true;
    let p=data[0][0];
    for(let j=1;j<3;j++){
        if(data[j][j]!==p){
            good=false;
        }
    }
    if(p&&good){
        return(2);
    }
    //diagonal top right- bottom left
    good=true;
    p=data[0][2];
    for(let j=1;j<3;j++){
        if(data[j][2-j]!==p){
            good=false;
        }
    }
    if(p&&good){
        return(2);
    }
};

function C4Board(data){
	const chars=[':white_circle:',':large_blue_circle:',':red_circle:'];
	let ans="\n:one::two::three::four::five::six::seven:\n";
	for(let i=0;i<6;i++){
		for(let j=0;j<7;j++){
			ans+=chars[data[j][i]];
		}
		ans+="\n";
	}
	return(ans);
};

function C4Win(data){
	let max = 0;
	let on = 0;
	for (let i = 0; i < 7; i++) {
		max = 0;
		on = 0;
		for (let j = 0; j < 6; j++) {
			if (data[i][j]) {
				if (on === data[i][j]) {
					max++;
					if (max >= 4 && on !== 0) {
						return data[i][j];
					}
				} else {
					max = 1;
					on = data[i][j];
				}
			}
		}
	}
	for (let j = 0; j < 6; j++) {
		max = 0;
		on = 0;
		for (let i = 0; i < 7; i++) {
			if (data[i][j]) {
				if (on === data[i][j]) {
					max++;
					if (max >= 4 && on !== 0) {
						return data[i][j];
					}
				} else {
					max = 1;
					on = data[i][j];
				}
			} else {
				on = 0;
				max = 0;
			}
		}
	}
	for (let i = 0; i < 4; i++) {
		for (let j = 0; j < 3; j++) {
			if (
				data[i][j] !== 0 &&
				data[i][j] === data[i + 1][j + 1] &&
				data[i][j] === data[i + 2][j + 2] &&
				data[i][j] === data[i + 3][j + 3]
			) {
				return data[i][j];
			}
			if (
				data[i + 3][j] !== 0 &&
				data[i + 3][j] === data[i + 2][j + 1] &&
				data[i + 3][j] === data[i + 1][j + 2] &&
				data[i + 3][j] === data[i][j + 3]
			) {
				return data[i + 3][j];
			}
		}
	}
	let dead = 0;
	for (let i = 0; i < 7; i++) {
		if (data[i][0] !== 0) {
			dead++;
		}
	}
	if (dead === 7) {
		return 3;
	}
	return 0;
};
//}

//{game functions
function newGame(game,host,server){
	switch(game){
	//{tic tac toe
		case(0):
			return({
				server:server,
				game:0,
				players:[host],
				min:2,
				max:2,
				status:'open',
				turn:Math.floor(Math.random()*2),
				playfield:[[0,0,0],[0,0,0],[0,0,0]]
			});
		break;
	//}
	//{connect 4
		case(1):
			return({
				server:server,
				game:1,
				players:[host],
				min:2,
				max:2,
				status:'open',
				turn:Math.floor(Math.random()*2),
				playfield:[[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]]
			});
		break;
	//}
	}
};

function startGame(game){
	switch(game.game){
		//{tic tac toe
			case(0):
				game.status='playing';
				return("On your turn, post a number 1-9 in \\`s indicating where to go.\nexample: \\`5\\`\n\n<@"+game.players[game.turn]+">, it's your turn:"+TTTBoard(game.playfield));
			break;
		//}
		//{connect 4
			case(1):
				game.status='playing';
				return("On your turn, post a number 1-7 in \\`s indicating where to go.\nexample: \\`4\\`\n\n<@"+game.players[game.turn]+">, it's your turn:"+C4Board(game.playfield));
			break;
		//}
	};
};

function gameAction(game,m,player){
	var at,val,rep,win,pf;
	switch(game.game){
		//{tic tac toe
			case(0):
				if(game.players[game.turn]!==player){
					return("It's not your turn, it's <@"+game.players[game.turn]+">'s.");
				}
				val=parseInt(m);
				if(val&&val>=1&&val<=9){
					val=Math.round(val);
					val--;
				}
				else{
					return('Must be a number 1-9');
				}
				if(game.playfield[Math.floor(val/3)][val%3]===0){
					game.playfield[Math.floor(val/3)][val%3]=game.turn+1;
				}
				else{
					return('That space is taken.');
				}
				game.turn++;
				if(game.turn>1){game.turn=0;}
				rep="";
				win=TTTWin(game.playfield);
				if(win===2){
					rep="<@"+player+"> WON!";
					users[player].won++;
					users[game.players[game.turn]].lost++;
				}
				else if(win===1){
					rep="Cats game, nobody won. :cry:";
					users[player].tied++;
					users[game.players[game.turn]].tied++;
				}
				else{
					rep="<@"+game.players[game.turn]+">, your turn!";
				}
				pf=TTTBoard(game.playfield);
				if(win>0){
					users[player].played++;
					users[game.players[game.turn]].played++;
					delete users[player].current[game.server];
					delete users[game.players[game.turn]].current[game.server];
					delete games[game.server][game.players[0]];
				}
				return(rep+pf);
			break;
		//}
		//{connect 4
			case(1):
				if(game.players[game.turn]!==player){
					return("It's not your turn, it's <@"+game.players[game.turn]+">'s.");
				}
				val=parseInt(m);
				if(val&&val>=1&&val<=7){
					val=Math.round(val);
					val--;
				}
				else{
					return('Must be a number 1-7');
				}
				if(game.playfield[val][0]>0){
					return('That row is full');
				}
				at = 5;
				while (game.playfield[val][at] !== 0) {
					at--;
				}
				game.playfield[val][at] = game.turn+1;
				game.turn++;
				if(game.turn>1){game.turn=0;}
				win=C4Win(game.playfield);
				if(win===3){
					rep="Draw, nobody won. :cry:";
					users[player].tied++;
					users[game.players[game.turn]].tied++;
				}
				else if(win>0){
					rep="<@"+player+"> WON!";
					users[player].won++;
					users[game.players[game.turn]].lost++;
				}
				else{
					rep="<@"+game.players[game.turn]+">, your turn!";
				}
				pf=C4Board(game.playfield);
				if(win>0){
					users[player].played++;
					users[game.players[game.turn]].played++;
					delete users[player].current[game.server];
					delete users[game.players[game.turn]].current[game.server];
					delete games[game.server][game.players[0]];
				}
				return(rep+pf);
			break;
		//}
	}
	return("error");
};

function quitGame(game,player){
	switch(game.game){
		//{tic tac toe connect 4
			case(0):
			case(1):
				if(game.status==='open'){
					delete users[player].current[game.server];
					delete games[game.server][game.players[0]];
					return;
				}
				for(let i=0;i<2;i++){
					if(game.players[i]===player){
						users[game.players[i]].quit++;
					}
					else{
						users[game.players[i]].won++;
					}
					users[game.players[i]].played++;
					delete users[game.players[i]].current[game.server];
				}
				delete games[game.server][game.players[0]];
			break;
		//}
	}
};
//}

//{client events
client.on('ready', () => {
  console.log(`${client.user.tag} online`);
  client.user.setGame(`^help | ${client.guilds.size} servers`,'https://www.twitch.tv/efhiii');
});

client.on("guildCreate", guild => {
  console.log(`joined ${guild.name} (id: ${guild.id})`);
  client.user.setGame(`^help | ${client.guilds.size} servers`,'https://www.twitch.tv/efhiii');
});

client.on("guildDelete", guild => {
  console.log(`left ${guild.name} (id: ${guild.id})`);
  client.user.setGame(`^help | ${client.guilds.size} servers`,'https://www.twitch.tv/efhiii');
});

client.on('message', msg => {
	console.log(msg.author.tag+": "+msg.content);
	if(msg.author.bot){return;}
	let m=msg.content.toLowerCase();
	if(m[0]!==pre){
		if(m[0]==='`'){
			m=m.substr(1,m.length-2);
			if(users.hasOwnProperty(msg.author.id)&&users[msg.author.id].current.hasOwnProperty(msg.guild.id)){
				msg.channel.send(gameAction(games[msg.guild.id][users[msg.author.id].current[msg.guild.id]],m,msg.author.id));
			}
		}
		return;
	};
	m=m.substr(1);
	//{help
		if(m==='help'){
			msg.channel.send("```markdown\nHelp\n====\n * The prefix ^ must be used at the beginning of any bot command *\n\nGeneral Commands\n================\necho  <message>- have the bot repeat a phrase\n\nhelp <command*> - The help command, with an optional command specific help argument\n\nping - responds with 'pong'\n\nstats <username*> - gives you stats on a given user. Default is yourself\n\nGame Commands\n=============\ngame list - lists the currently supported games\n\nopen games - lists all open games\n\nnew game <game> - creates a new open game of the game specified (chosen from the game list)\n\njoin <@host> - lets you join a game with a given game host\n\nquit game - lets you quit and forfeit a game you're in\n```");
			return;
		}
		if(m.startsWith('help ')){
			m=m.substr(5);
			switch(m){
				case('echo'):
					msg.channel.send('syntax: echo <message>\nreplies with <message>');
				break;
				case('help'):
					msg.channel.send('syntax: help <command*>\nprovides help on either all commands or a specified command');
				break;
				case('ping'):
					msg.channel.send('syntax: ping\nreplies with "pong"');
				break;
				case('stats'):
					msg.channel.send('syntax: stats <username*>\ngives statistics on either you or a specified user');
				break;
				default:
					msg.channel.send(m+' is not a supported function.');
			}
			return;
		}
	//}
	
	//{general commands
	if (m.startsWith('echo ')) {
		msg.channel.send(msg.content.substr(6));
		return;
	}
	if (m === 'ping') {
		msg.channel.send('Pong!');
		return;
	}
	//}
	
	//{game commands
	if(!msg.guild){
		msg.channel.send('invalid command');
		return;
	}
	
	if (m === 'game list') {
		msg.channel.send("```markdown\nshort games\n===========\n"+
			"tic tac toe - a simple 3-in-a-row game.\n"+
		"\nlong games\n==========\n"+
			"connect 4 - a simple 4-in-a-row game.\n"+
		"```");
		return;
	}
	
	if(!openGames.hasOwnProperty(msg.guild.id)){
		openGames[msg.guild.id]={};
	}
	
	if (m === 'open games') {
		let ans="```markdown\nOpen games\n==========";
		let gms=openGames[msg.guild.id];
		for(let i in gms){
			ans+="\n"+games[msg.guild.id][i].players.length+"/"+games[msg.guild.id][i].max+" "+gameNames[games[msg.guild.id][i].game]+" - host: "+users[i].nick;
		}
		ans+="```";
		msg.channel.send(ans);
		return;
	}
	
	if(!users.hasOwnProperty(msg.author.id)){
		users[msg.author.id]={
			nick:msg.author.username,
			played:0,
			won:0,
			lost:0,
			tied:0,
			quit:0,
			current:{}
		};
	}
	
	if(!games.hasOwnProperty(msg.guild.id)){
		games[msg.guild.id]={};
	}
	
	if(m === 'stats'){
		let p=users[msg.author.id];
		msg.channel.send({embed:{
			title:p.nick+"'s stats",
			fields:[
				{name:'Won',value:p.won+"/"+p.played},
				{name:'Tied',value:p.tied},
				{name:'Quit',value:p.quit},
				{name:'Server status',value:p.current.hasOwnProperty(msg.guild.id)?"Currently playing "+gameNames[games[msg.guild.id][p.current[msg.guild.id]].game]:"Not currently in a game on this server."}
	],
			color: 3447003
		}});//.setColor('lime green'));
		return;
	}
	
	if(m.startsWith('quit')){
		if(users[msg.author.id].current.hasOwnProperty(msg.guild.id)){
			quitGame(games[msg.guild.id][users[msg.author.id].current[msg.guild.id]],msg.author.id);
			msg.channel.send('You have left the game.');
		}
		else{
			msg.channel.send("You aren't in a game on this server so you can't quit! MUHAHAHA!");			
		}
		return;
	}
	
	if(m.startsWith('stats ')){
		m=m.substr(6).replace('<@','').replace('!','').replace('>','');;
		if(!users.hasOwnProperty(m)){
			msg.channel.send("That user isn't in my database");
			return;
		}
		let p=users[m];
		msg.channel.send({embed:{
			title:p.nick+"'s stats",
			fields:[
				{name:'Won',value:p.won+"/"+p.played},
				{name:'Tied',value:p.tied},
				{name:'Quit',value:p.quit},
				{name:'Server status',value:p.current.hasOwnProperty(msg.guild.id)?"Currently playing "+gameNames[games[msg.guild.id][p.current[msg.guild.id]].game]:"Not currently in a game on this server."}
	],
			color: 3447003
		}});//.setColor('lime green'));
		return;
	}
	
	if (m.startsWith('new game ')) {
		if(users[msg.author.id].current.hasOwnProperty(msg.guild.id)){
			msg.channel.send("You can't start a new game in a server where you're already participating in another game.");
			return;
		}
		m=m.substr(9);
		let good=false;
		for(let i=gameNames.length-1;i>=0;i--){
			if(m===gameNames[i]){
				games[msg.guild.id][msg.author.id]=newGame(i,msg.author.id,msg.guild.id);
				openGames[msg.guild.id][msg.author.id]=i;
				users[msg.author.id].current[msg.guild.id]=msg.author.id;
				msg.channel.send("A new game of "+gameNames[i]+" has been successfully created!");
				i=0;
				good=true;
			}
		}
		if(!good){
			msg.channel.send('sorry, '+m+' is not currently supported.');
		}
		return;
	}
	
	if (m.startsWith('join ')) {
		if(users[msg.author.id].current.hasOwnProperty(msg.guild.id)){
			msg.channel.send("You can't join a game in a server where you're already participating in another game.");
			return;
		}
		m=m.substr(5).replace('<@','').replace('!','').replace('>','');
		if(openGames[msg.guild.id].hasOwnProperty(m)){
			const game=games[msg.guild.id][m];
			msg.channel.send("<@"+msg.author.id+"> joined <@"+m+">'s game of "+gameNames[game.game]);
			game.players.push(msg.author.id);
			users[msg.author.id].current[msg.guild.id]=m;
			if(game.max===game.players.length){
				delete openGames[msg.guild.id][m];
			};
			if(game.min===game.players.length){
				msg.channel.send(startGame(game));
			};
		}
		else{
			msg.channel.send("<@"+m+"> isn't hosting a joinable game right now.");
		}
		return;
	}
	//}
});

client.login('[REDACTED]');
//}

