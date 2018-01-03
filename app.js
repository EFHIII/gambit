const Discord = require("discord.js");
const client = new Discord.Client();

const pre="^";

let gameCount=0;

const gameNames=['tic tac toe','connect 4','othello','texas holdem'];
const numbers=[':zero:',':one:',':two:',':three:',':four:',':five:',':six:',':seven:',':eight:',':nine:',':ten:'];
const letters=[':black_large_square:',':regional_indicator_a:​',':regional_indicator_b:','​:regional_indicator_c:','​:regional_indicator_d:','​:regional_indicator_e:','​:regional_indicator_f:','​:regional_indicator_g:','​:regional_indicator_h:'];

const openGames={};

const games={};

let userCount=0;
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

function OthelloPoints(Board,player){
    var P=0;
    for(V5=0;V5<8;V5++){
        for(V6=0;V6<8;V6++){
            if(Board[V5][V6]===player){P++;}
        }
    }
    return(P);
};
function OthelloSubmove(a,d,turn,board){
    if(a[0]<0){return;}
    if(a[0]>7){return;}
    if(a[1]<0){return;}
    if(a[1]>7){return;}
    if(board[a[0]][a[1]]===0){return;}//a
    if(board[a[0]][a[1]]===turn){return(true);}
    else{
        if(OthelloSubmove([a[0]+d[0],a[1]+d[1]],d,turn,board)){board[a[0]][a[1]]=turn;return(true);}
    }
};
function OthelloSubcheck(a,d,Board,player){
    if(a[0]<0){return;}
    if(a[0]>7){return;}
    if(a[1]<0){return;}
    if(a[1]>7){return;}
    if(Board[a[0]][a[1]]===0){return;}//b
    if(Board[a[0]][a[1]]===player){return(true);}
    else{
        if(OthelloSubcheck([a[0]+d[0],a[1]+d[1]],d,Board,player)){return(true);}
    }
};
function OthelloCheck(a,Board,player){
		if(Board[a[0]][a[1]]!==0){return(false);}
        for(let i=-1;i<2;i++){
            for(let j=-1;j<2;j++){
                if(!!i||!!j){
                    if(OthelloSubcheck([a[0]+i,a[1]+j],[i,j],Board,player)&&Board[a[0]+i][a[1]+j]!==player){return(true);}
                }
            }
        }
};
function OthelloMove(a,turn,board){
    if(!a){return;}
    if(a[0]===Math.floor(a[0])&&a[1]===Math.floor(a[1])&&board[a[0]][a[1]]===0&&OthelloCheck(a,board,turn)){
        board[a[0]][a[1]]=turn;
        for(let i=-1;i<2;i++){OthelloSubmove([a[0]+i,a[1]-1],[i,-1],turn,board);}
        for(let i=-1;i<2;i++){OthelloSubmove([a[0]+i,a[1]+1],[i,1],turn,board);}
        OthelloSubmove([a[0]-1,a[1]],[-1,0],turn,board);
        OthelloSubmove([a[0]+1,a[1]],[1,0],turn,board);
    }
};
function OthelloBoard(board,turn){
	const chars=['\u274e',':black_circle:',':white_circle:',':eight_spoked_asterisk:'];
	let txt='\n';
	let OK=false;
    let OVER=true;
    for(let i=0;i<8;i++){
		txt+=numbers[8-i];
        for(let j=0;j<8;j++){
            if(board[i][j]===1){txt+=chars[1];}
            else if(board[i][j]===2){txt+=chars[2];}
            else if(OthelloCheck([i,j],board,turn)){OK=true;txt+=chars[3];}
			else{
				txt+=chars[0];
			}
            if(board[i][j]===0&&OthelloCheck([i,j],board,-(turn-3))){OVER=false;}
        }
		txt+='\n';
    }
	txt+=':black_large_square::regional_indicator_a:​:regional_indicator_b:​:regional_indicator_c:​:regional_indicator_d:​:regional_indicator_e:​:regional_indicator_f:​:regional_indicator_g:​:regional_indicator_h:';
    if(!OK){
        if(OVER){
            let pts=[OthelloPoints(board,1),OthelloPoints(board,2)];
            if(pts[0]>pts[1]){
				return([1,txt]);
            }
            if(pts[0]<pts[1]){
				return([2,txt]);
            }
             if(pts[0]===pts[1]){
				return([3,txt]);
            }
        }
        else{
			return([4,txt]);
        }
    }
	return([0,txt]);
};

function newDeck(){
	var deck=[];
	for(var i=0;i<4;i++){
		for(var j=0;j<13;j++){
			deck.push([j,i]);
		}
	}
	return(deck.sort(function(){return(Math.random());}));
};
function order(a,b){
    return(b[0]-a[0]);
};
function Order(a,b){
    return(b-a);
};
function PokerCombinations(cards,groups){
        var result=[];
        if (groups>cards.length){
            return result;
        }
        if (groups===cards.length){
            return [cards];
        }
        if (groups===1){
            return cards.map(function(card){return[card];});
        }
        for (var i=0;i<cards.length-groups;i++){
            var head =cards.slice(i,(i+1));
            var tails =PokerCombinations(cards.slice(i+1),(groups-1));
            for (var _i=0,tails_1=tails;_i<tails_1.length;_i++) {
                var tail=tails_1[_i];
                result.push(head.concat(tail));
            }
        }
        return result;
};
function PokerRanked(cards){
    var result = [];
    for (var i=0;i<cards.length;i++) {
        result.push(cards[i][0]);
    }
    // high to low
    result.reverse();
    // pairs and sets first
    result.sort(function (a, b) {
        return a.length > b.length ? -1 : a.length < b.length ? 1 : 0;
    });
    return result;
};
function PokerIsFlush(cards){
    var type=cards[0][1];
    for(var i=1;i<cards.length;i++){
        if(cards[i][1]!==type){return(false);}
    }
    return(true);
};
function PokerIsStraight(cards){
    var order=function(a,b){
        return(a[0]-b[0]);
    };
    var hand=cards.sort(order);
    var ans=true;
    var at=hand[0][0];
    for(var i=1;i<5;i++){
        if(at+1===hand[i][0]){
            at++;
        }
        else{
            ans=false;
            i=5;
        }
    }
    if(ans){
        return(true);
    }
    if(hand[4]===12&&hand[0]===0&&hand[1]===1&&hand[2]===2&&hand[3]===3){return(true);}
};
function PokerValue(cards,primary){
    var str = '';
    for (var i=4;i>=0;i--){
        var r=cards[i][0];
        var v=(r<10?'0':'')+r;
        str += v;
    }
    return((primary*10000000000)+parseInt(str,0));
};
function PokerSame(cards){
    var all=[0,0,0,0,0,0,0,0,0,0,0,0,0];
    for(var i=0;i<5;i++){
        all[cards[i][0]]++;
    }
    return(all.sort(Order));
};
function PokerCalculate(cards){
    var isFlush=PokerIsFlush(cards);
    var isStraight=PokerIsStraight(cards);
    var same=PokerSame(cards);
    if (isStraight&&isFlush&&cards[4]===12){return(PokerValue(cards,9));}//royal fulsh
    else if(isStraight&&isFlush){return(PokerValue(cards,8));}//straight flush
    else if(same[0]===4){return(PokerValue(cards,7));}//4 of a kind
    else if(same[0]===3&&same[1]===2){return(PokerValue(cards,6));}//full house
    else if(isFlush){return(PokerValue(cards,5));}//flush
    else if(isStraight){return(PokerValue(cards,4));}//straight
    else if(same[0]===3){return(PokerValue(cards,3));}//3 of a kind
    else if(same[0]===2&&same[1]===2){return(PokerValue(cards,2));}//2 pair
    else if(same[0]===2){return(PokerValue(cards,1));}//pair
    else{return(PokerValue(cards,0));}//high card
};
function PokerScore(hand){
    var best=0;
    for(var i=0,c=PokerCombinations(hand,5);i<c.length;i++){
        var score=PokerCalculate(c[i].sort(order));
        if(score>best){
            best=score;
        }
    }
    return(best);
};

function PokerNewHand(game){
	game.deck=newDeck();
	game.fold=[];
	game.bets=[];
	game.hands=[];
	game.dealer++;
	if(game.dealer>=game.players.length){
		game.dealer=0;
	}
	let=i=0;
	while(i++<10&&!game.players[game.dealer]&&game.banks[game.dealer]<=0){
		game.dealer++;
		if(game.dealer>=game.players.length){
			game.dealer=0;
		}
	}
	game.turn=game.dealer+1;
	if(game.turn>=game.players.length){
		game.turn=0;
	}
	let=i=0;
	while(i++<10&&!game.players[game.turn]&&game.banks[game.turn]<=0){
		game.dturn++;
		if(game.turn>=game.players.length){
			game.turn=0;
		}
	}
	game.pot=0;
	game.phase=0;
	for(i=0;i<10;i++){
		game.fold[i]=false;
		game.bets[i]=0;
		game.hands[i]=[];
		if(game.players[i]&&game.banks[i]>=2){
			game.hands[i].push(game.deck[0]);
			game.deck=game.deck.shift();
			game.hands[i].push(game.deck[0]);
			game.deck=game.deck.shift();
			client.fetchUser(game.players[i]);
			game.banks[i]-=2;
			game.pot+=2;
		}
	}
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
	//{Othello
		case(2):
			return({
				server:server,
				game:2,
				players:[host],
				min:2,
				max:2,
				status:'open',
				turn:Math.floor(Math.random()*2),
				playfield:[[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,2,1,0,0,0],[0,0,0,1,2,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]]
			});
		break;
	//}
	//{Texas Hold'em
		case(3):
			return({
				server:server,
				game:3,
				players:[host],
				banks:[100,100,100,100,100,100,100,100,100,100],
				min:2,
				max:10,
				status:'open',
				phase:0,
				turn:0,
				dealer:-1,
				deck:newDeck(),
				hands:[],
				bets:[],
				fold:[],
				pot:0
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
		//{Othello
			case(2):
				game.status='playing';
				return("On your turn, post a coordinate a1-h8 in \\`s indicating where to go.\nexample: \\`c4\\`\n\n<@"+game.players[game.turn]+">, it's your turn:"+OthelloBoard(game.playfield,game.turn+1));
			break;
		//}
		//{Texas Hold'em
			case(3):
				return("On your turn, you can check, fold, call, or bet. Check, fold, or call by posting \\`check\\`, \\`fold\\`, or \\`call\\` respectively. You may not check if there is already a bet and you may not call if there isn't already a bet. To bet, post your bet in \\`s indicating where to go.\nexample: \\`15\\`\n\nThe game will start when the host says \\`start\\`");
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
		//{Othello
			case(2):
				if(game.players[game.turn]!==player){
					return("It's not your turn, it's <@"+game.players[game.turn]+">'s.");
				}
				val=[];
				val[0]=parseInt(m[1]);
				if(val[0]&&val[0]>=1&&val[0]<=8){
					val[0]=Math.round(val[0]);
					val[0]=8-val[0];
				}
				else{
					return('Invalid coordinate');
				}
				val[1]='abcdefgh'.indexOf(m[0]);
				if(!(val[1]>=0&&val[1]<=7)){
					return('Invalid coordinate');
				}
				if(!OthelloCheck(val,game.playfield,game.turn+1)){
					return('Invalid move');
				};
				OthelloMove(val,game.turn+1,game.playfield);
				game.turn++;
				if(game.turn>1){game.turn=0;}
				win=OthelloBoard(game.playfield,game.turn+1);
				pf=win[1];
				win=win[0];
				if(win===4){
					game.turn++;
					if(game.turn>1){game.turn=0;}			
				}
				else if(win===3){
					rep="Draw, nobody won. :cry:";
					users[player].tied++;
					users[game.players[game.turn]].tied++;
				}
				else if(win>0){
					rep="<@"+player+"> WON!";
					users[game.players[win]].won++;
					users[game.players[Math.abs(win-1)]].lost++;
				}
				else{
					rep="<@"+game.players[game.turn]+">, your turn!";
				}
				if(win>0&&win<4){
					users[player].played++;
					users[game.players[game.turn]].played++;
					delete users[player].current[game.server];
					delete users[game.players[game.turn]].current[game.server];
					delete games[game.server][game.players[0]];
				}
				return(rep+pf);
			break;
		//}
		//{Texas Hold'em
			case(3):
				if(game.status==='open'&&player===game.players[0]&&m==='start'){
					game.status='playing';
					return(PokerNewHand(game));
				}
				if(m==='bank'){
					return(game.banks[game.players.indexOf(player)]);
				}
				if(game.players[game.turn]!==player){
					return("It's not your turn, it's <@"+game.players[game.turn]+">'s.");
				}
				if(m==='fold'){
					
				}
			break;
		//}
	}
	return("error");
};

function quitGame(game,player){
	switch(game.game){
		//{tic tac toe, connect 4, Othello
			case(0):
			case(1):
			case(2):
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
		//{Texas Hold'em
			default:
			break;
		//}
	}
};
//}
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
					{name:'Server status',value:p.current.hasOwnProperty(msg.guild.id)?"Currently playing "+gameNames[games[msg.guild.id][p.current[msg.guild.id]].game]:"Not currently in a game on this server."}
		],
				color: 3447003
			}});//.setColor('lime green'));
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
			quitGame(games[msg.guild.id][users[msg.author.id].current[msg.guild.id]],msg.author.id);
			return('You have quit the game.');
		}
		else{
			return("You aren't in a game on this server so you can't quit! MUHAHAHA!");			
		}
	},
	leave:function(msg){
		if(users[msg.author.id].current.hasOwnProperty(msg.guild.id)){
			quitGame(games[msg.guild.id][users[msg.author.id].current[msg.guild.id]],msg.author.id);
			return('You have left the game.');
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
		let m=args[0].replace('<@','').replace('!','').replace('>','');
		if(openGames[msg.guild.id].hasOwnProperty(m)){
			const game=games[msg.guild.id][m];
			game.players.push(msg.author.id);
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
			if(users.hasOwnProperty(msg.author.id)&&users[msg.author.id].current.hasOwnProperty(msg.guild.id)){
				msg.channel.send(gameAction(games[msg.guild.id][users[msg.author.id].current[msg.guild.id]],m,msg.author.id));
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
		msg.channel.send('invalid command');
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
	
});

client.login('[REDACTED]');
//}

