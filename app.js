const Discord = require("discord.js");
const client = new Discord.Client();

const pre="^";

let gameCount=0;

const gameNames=['tic tac toe','connect 4','othello','texas holdem'];
const numbers=[':zero:',':one:',':two:',':three:',':four:',':five:',':six:',':seven:',':eight:',':nine:',':keycap_ten:'];
const letters=[':black_large_square:',':regional_indicator_a:​',':regional_indicator_b:','​:regional_indicator_c:','​:regional_indicator_d:','​:regional_indicator_e:','​:regional_indicator_f:','​:regional_indicator_g:','​:regional_indicator_h:'];
const suits=[':clubs:',':diamonds:',':hearts:',':spades:'];
const cardValues=[':two:',':three:',':four:',':five:',':six:',':seven:',':eight:',':nine:',':keycap_ten:',':regional_indicator_j:',':regional_indicator_q:',':regional_indicator_k:',':regional_indicator_a:'];
const hands=['High Card','Pair','2 Pair','3 of a Kind','Straight','Flush','Full House','4 of a Kind','Straight Flush','Royal Flush'];
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

function DM(id,msg){
	client.fetchUser(id).then(x=>x.send(msg));
};
function printCards(cards){
	let txt='';
	for(let i=0;i<cards.length;i++){
		txt+=cardValues[cards[i][0]];
		if(i<cards.length-1){txt+=' :black_small_square: ';}
	}
	txt+='\n';
	for(let i=0;i<cards.length;i++){
		txt+=suits[cards[i][1]];
		if(i<cards.length-1){txt+=' :black_small_square: ';}
	}
	return(txt);
};
function newDeck(){
	var deck=[];
	for(var i=0;i<4;i++){
		for(var j=0;j<13;j++){
			deck.push([j,i]);
		}
	}
	return(deck.sort(function(){return(Math.random()-0.5);}));
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
    if (isStraight&&isFlush&&cards[4]===12){return(PokerValue(cards,9));}//royal flush
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
	game.maxBet=0;
	game.fold=[];
	game.bets=[];
	game.hands=[];
	for(var i=1;i>0&&i<game.players.length;i++){
		if(game.banks[i]<game.ante){
			users[game.players[i]].netwin+=game.banks[i]-100;
			delete users[game.players[i]].current[game.server];
			game.banks.splice(i,1);
			game.players.splice(i,1);
			i--;
		}
	}
	if(game.players.length<2){
		game.status='open';
		game.turn=0;
		return(true);
	}
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
	while(i++<10&&(!game.players[game.turn]||game.banks[game.turn]<=0)){
		game.turn++;
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
		if(game.players[i]&&game.banks[i]>=game.ante){
			game.hands[i].push(game.deck[0]);
			game.deck.shift();
			game.hands[i].push(game.deck[0]);
			game.deck.shift();
			DM(game.players[i],printCards(game.hands[i]));
			game.banks[i]-=game.ante;
			game.pot+=game.ante;
		}
		else{
			game.fold[i]=true;
		}
	}
};
function PokerNextPhase(game){
	game.phase++;
	game.good=false;
	if(game.phase===4){
		let top=[0,[]];
		let txt=[];
		let table=game.deck.slice(0,5);
		txt.push('The table:\n'+printCards(table));
		for(let i=0;i<game.players.length;i++){
			let fullHand=table.concat(game.hands[i]);
			let score=PokerScore(fullHand);
			txt.push('<@'+game.players[i]+'>: '+hands[Math.floor(score/10000000000)]+'\n'+printCards(game.hands[i]));
			if(score>top[0]){
				top[0]=score;
				top[1]=[i];
			}
			else if(score===top[0]){
				top[1].push(i);
			}
		}
		for(let i=0;i<top[1].length;i++){
			game.banks[top[1][i]]+=game.pot/top[1].length;
		}
		let oldPot=game.pot;
		if(PokerNewHand(game)){
			txt.push('Not enough players.');
		}
		else if(top[1].length>1){
			let tmp="";
			for(let i=0;i<top[1].length;i++){
				tmp+="<@"+game.players[top[1][i]]+">";
				if(i<top[1].length-1){
					tmp+=", ";
				}
				if(i===top[1].length-2){
					tmp+="and ";
				}
			}
			txt.push(tmp+" won $"+(oldPot/top[1].length)+"!\n",
				'Everyone antes $'+game.ante+'. First betting phase: <@'+game.players[game.turn]+'> bets first.');
		}
		else{
			txt.push("<@"+game.players[top[1][0]]+"> won $"+oldPot+"!\n",
				'Everyone antes $'+game.ante+'. First betting phase: <@'+game.players[game.turn]+'> bets first.');
		}
		return(txt);
	}
	game.maxBet=0;
	game.bets=[];
	game.turn=game.dealer+1;
	if(game.turn>=game.players.length){
		game.turn=0;
	}
	let=i=0;
	while(i++<10&&(!game.players[game.turn]||game.banks[game.turn]<=0||game.fold[game.turn])){
		game.turn++;
		if(game.turn>=game.players.length){
			game.turn=0;
		}
	}
	for(i=0;i<game.players.length;i++){
		game.bets[i]=0;
	}
	let count=[0,3,4,5];
	let title=[,'flop','turn','river'];
	let table=game.deck.slice(0,count[game.phase]);
	return(["Now the "+title[game.phase]+".\n"+printCards(table),"<@"+game.players[game.turn]+"> bets first."]);
}
function PokerNextTurn(game){
	game.turn++;
	if(game.turn>game.players.length){
		game.turn=0;
	}
	let=i=0;
	while(i++<10&&(game.fold[game.turn])){
		game.turn++;
		if(game.turn>=game.players.length){
			game.turn=0;
		}
	}
	if(game.players.length<2){
		return(['Not enough players.']);
	}
	let stillIn=0;
	let belowMax=false;
	for(let i=0;i<game.players.length;i++){
		if(!game.fold[i]){
			stillIn++;
			if(game.bets[i]<game.maxBet){
				belowMax=true;
			}
		}
	}
	if(stillIn<2){
		for(let i=0;i<game.players.length;i++){
			if(!game.fold[i]){
				game.banks[i]+=game.pot;
				game.good=false;
				let oldPot=game.pot;
				if(PokerNewHand(game)){
					return(["<@"+game.players[i]+"> won $"+oldPot+"!\n","Not enough players."]);
				}
				return(["<@"+game.players[i]+"> won $"+oldPot+"!\n",
				'Everyone antes $'+game.ante+'. First betting phase: <@'+game.players[game.turn]+'> bets first.']);
			}
		}
	}
	let newlyGood=false;
	if(!game.good&&game.turn===game.dealer){
		game.good=true;
		newlyGood=true;
	}
	if(game.fold[game.turn]){
		if(!game.good||newlyGood||belowMax){
			return(PokerNextTurn(game));
		}
		return(PokerNextPhase(game));
	}
	if(game.good&&!newlyGood&&!belowMax){
		return(PokerNextPhase(game));
	}
	return(['<@'+game.players[game.turn]+'>, your bet, the bet is at $'+game.maxBet+'.']);
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
				banks:[100],
				min:2,
				max:10,
				status:'open',
				phase:0,
				turn:0,
				good:false,
				dealer:-1,
				deck:newDeck(),
				ante:2,
				maxBet:0,
				hands:[],
				bets:[],
				fold:[],
				pot:0
			});
		break;
	//}
	}
};
function gameJoin(game,player){
	switch(game.game){
		//{Texas Hold'em
		case(3):
			game.banks.push(100);
			game.fold.push(true);
			game.players.push(player);
		break;
		//}
		//{everything else
		default:
			game.players.push(player);
		break;
		//}
	}
};

function startGame(game){
	switch(game.game){
		//{tic tac toe
			case(0):
				game.status='playing';
				return("```\nOn your turn, post a number 1-9 in `s indicating where to go.\nexample: `5`\n```\n\n<@"+game.players[game.turn]+">, it's your turn:"+TTTBoard(game.playfield));
			break;
		//}
		//{connect 4
			case(1):
				game.status='playing';
				return("```\nOn your turn, post a number 1-7 in `s indicating where to go.\nexample: `4`\n```\n\n<@"+game.players[game.turn]+">, it's your turn:"+C4Board(game.playfield));
			break;
		//}
		//{Othello
			case(2):
				game.status='playing';
				return("```\nOn your turn, post a coordinate a1-h8 in `s indicating where to go.\nexample: `c4`\n```\n\n<@"+game.players[game.turn]+">, it's your turn:"+OthelloBoard(game.playfield,game.turn+1));
			break;
		//}
		//{Texas Hold'em
			case(3):
				return("```javascript\nOn your turn, you can check, fold, call, or bet. Check, fold, or call by posting `check`, `fold`, or `call` respectively. You may not check when there is already a bet and you may not call when there is not already a bet. To bet, post your bet inside ``s indicating your bet.\nexample: `15`\n\nTo see how much you have, post `bank`\nTo see how much everyone has, post `banks`\nTo see the hands chart, post `hands`\n\nThe game will start when the host says `start`\n```");
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
				let playerN=game.players.indexOf(player);
				if(game.status==='open'&&player===game.players[0]&&m==='start'){
					game.status='playing';
					if(PokerNewHand(game)){
						return('Not enough players.');
					}
					return('Everyone antes $'+game.ante+'. First betting phase: <@'+game.players[game.turn]+'> bets first.');
				}
				if(m==='bank'){
					return('$'+game.banks[playerN]);
				}
				if(m==='banks'){
					let fs=[];
					let rps=[];
					for(let i=0;i<game.players.length;i++){
						rps.push(i);
					}
					rps.sort((a,b)=>{return(game.banks[b]-game.banks[a]);});
					for(let i=0;i<game.players.length;i++){
						fs.push({
							name:
								(game.banks[rps[i]]<game.ante?':skull_crossbones: ':
									(game.fold[rps[i]]?':file_folder: ':':white_flower: '))+
								users[game.players[rps[i]]].nick+(game.dealer==rps[i]?' :white_circle:':''),
							value:
								game.banks[rps[i]]<=0?'Bankrupt':'$'+game.banks[rps[i]]
						});
					}
					fs.push({name:"Pot",value:game.pot},{name:"Current Bet",value:game.maxBet});
					return({embed:{
						title:"Texas Hold'em standings",
						fields:fs,
						color: 5635942
						}});
				}
				if(m==='hands'){
					return('http://pokerkeeda.com/wp-content/uploads/2017/02/cc-hand-ranking-image-72-dpi.png-1.jpg');
				}
				if(game.players[game.turn]!==player){
					return("It's not your turn, it's <@"+game.players[game.turn]+">'s.");
				}
				if(m==='fold'){
					game.fold[playerN]=true;
					return(PokerNextTurn(game));
				}
				if(m==='check'){
					if(game.maxBet===0){
						return(PokerNextTurn(game));
					}
					return("You can't check, the current bet is $"+game.maxBet+".");
				}
				if(m==='call'){
					if(game.maxBet===0){
						return("You can't call when there isn't a bet.");
					}
					if(game.banks[playerN]+game.bets[playerN]<game.maxBet){
						game.pot+=game.banks[playerN];
						game.bets[playerN]+=game.banks[playerN];
						game.banks[playerN]=0;
						return(['You went all in!'].concat(PokerNextTurn(game)));
					}
					game.pot+=game.maxBet-game.bets[playerN];
					game.banks[playerN]-=game.maxBet-game.bets[playerN];
					game.bets[playerN]+=game.maxBet-game.bets[playerN];
					return(PokerNextTurn(game));
				}
				val=parseInt(m);
				if(val&&val>=1&&val<=game.banks[playerN]){
					val=Math.floor(val);
				}
				else{
					if(val<0){
						return("You can't bet a negative value.");
					}
					if(val>game.banks[playerN]){
						return("You can't bet more than you have.");
					}
					return('Invalid bet');
				}
				if(val+game.bets[playerN]<game.maxBet){
					return("You must bet at least $"+(game.maxBet-game.bets[playerN])+'.');
				}
				game.pot+=val;
				game.bets[playerN]+=val;
				game.banks[playerN]-=val;
				if(game.bets[playerN]>game.maxBet){
					game.maxBet=game.bets[playerN];
				}
				return(["You bet $"+val+", the bet is now at $"+game.maxBet+"."].concat(PokerNextTurn(game)));
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
					delete openGames[game.server][game.players[0]];
					delete users[player].current[game.server];
					delete games[game.server][game.players[0]];
					return('You have terminated your game of '+game.game+'.');
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
				return('You have forfieted the game of '+game.game+'.');
			break;
		//}
		//{Texas Hold'em
			default:
				if(player===game.players[0]){
					for(let i=0;i<game.players.length;i++){
						users[game.players[i]].netwin+=game.banks[i]-100;
						delete users[game.players[i]].current[game.server];
					}
					if(openGames[game.server].hasOwnProperty(game.players[0])){
						delete openGames[game.server][game.players[0]];
					}
					delete games[game.server][game.players[0]];
					return('The Texas Hold\'em game has been terminated.');
				}
				let n=game.players.indexOf(player);
				game.fold[n]=true;
				let winn=game.banks[n]-100;
				users[game.players[n]].netwin+=game.banks[n]-100;
				delete users[game.players[n]].current[game.server];
				game.banks[n]=0;
				if(game.turn==n){
					return(["You forfeited your turn by leaving the table with a net winnings of $"+winn+"."].concat(PokerNextTurn(game)));
				}
				return("You have left the table with a net winnings of $"+winn+".");
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
					{name:'Net Gambling Winnings',value:p.netwin<0?"-":""+"$"+Math.abs(p.netwin)},
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
					{name:'Net Gambling Winnings',value:p.netwin<0?"-":""+"$"+Math.abs(p.netwin)},
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
	
});

client.login('[REDACTED]');
//}

