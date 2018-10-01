module=module.exports={};

const suits=[':clubs:',':diamonds:',':hearts:',':spades:'];
const cardValues=[':two:',':three:',':four:',':five:',':six:',':seven:',':eight:',':nine:',':keycap_ten:',':regional_indicator_j:',':regional_indicator_q:',':regional_indicator_k:',':regional_indicator_a:'];
const hands=['High Card','Pair','2 Pair','3 of a Kind','Straight','Flush','Full House','4 of a Kind','Straight Flush','Royal Flush'];

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
        for (var i=0;i<cards.length-groups+1;i++){
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

function PokerNewHand(users,game,DM){
	game.deck=newDeck();
	game.maxBet=0;
	console.log(game.maxBet);
	game.fold=[];
	game.bets=[];
	game.hands=[];
	for(var i=1;i>0&&i<game.players.length;i++){
		if(game.banks[i]<game.ante){
			//delete users[game.players[i]].current[game.server];
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
	game.Pot=0;
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
			game.Pot+=game.ante;
		}
		else{
			game.fold[i]=true;
		}
	}
	return(false);
};
function PokerNextPhase(users,game,DM){
	game.phase++;
	game.good=false;
	if(game.phase===4){
		let top=[0,[]];
		let txt=[];
		let table=game.deck.slice(0,5);
		txt.push('The table:\n'+printCards(table));
		for(let i=0;i<game.players.length;i++){
			if(!game.fold[i]){
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
		}
		for(let i=0;i<top[1].length;i++){
			game.banks[top[1][i]]+=game.Pot/top[1].length;
		}
		let oldPot=game.Pot;
		if(top[1].length>1){
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
			txt.push(tmp+" won $"+(oldPot/top[1].length)+"!\n");
		}
		else{
			txt.push("<@"+game.players[top[1][0]]+"> won $"+oldPot+"!\n");
		}
		PokerNewHand(users,game,DM);
		if(game.players.length<2){
			txt.push('Not enough players.');
		}
		else{
			txt.push('Everyone antes $'+game.ante+'. First betting phase: <@'+game.players[game.turn]+'> bets first.');
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
function PokerNextTurn(users,game,DM){
	game.turn++;
	if(game.turn>=game.players.length){
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
			if(game.bets[i]<game.maxBet&&game.banks[i]>0){
				belowMax=true;
			}
		}
	}
	if(stillIn<2){
		for(let i=0;i<game.players.length;i++){
			if(!game.fold[i]){
				game.banks[i]+=game.Pot;
				game.good=false;
				let oldPot=game.Pot;
				if(PokerNewHand(users,game,DM)){
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
			return(PokerNextTurn(users,game,DM));
		}
		return(PokerNextPhase(users,game,DM));
	}
	if(game.good&&!newlyGood&&!belowMax){
		return(PokerNextPhase(users,game,DM));
	}
	return(['<@'+game.players[game.turn]+'>, your bet, the bet is at $'+game.maxBet+'.']);
};

module.game=function(host,server){
	this.server=server;
	this.game=3;
	this.players=[host];
	this.banks=[100];
	this.min=2;
	this.max=10;
	this.status='open';
	this.phase=0;
	this.turn=0;
	this.good=false;
	this.dealer=-1;
	this.deck=newDeck();
	this.ante=2;
	this.maxBet=0;
	this.hands=[];
	this.bets=[];
	this.fold=[];
	this.Pot=0;
};

module.game.prototype.join=function(player,users){
	this.banks.push(100);
	this.fold.push(true);
	this.players.push(player);
};

module.game.prototype.start=function(users){
		return("```javascript\nOn your turn, you can check, fold, call, or bet. Check, fold, or call by posting `check`, `fold`, or `call` respectively. You may not check when there is already a bet and you may not call when there is not already a bet. To bet, post your bet inside ``s indicating your bet.\nexample: `15`\n\nTo see how much you have, post `bank`\nTo see how much everyone has, post `banks`\nTo see the hands chart, post `hands`\n\nThe game will start when the host says `start`\n```");
};

module.game.prototype.action=function(m,player,users,games,openGames,DM){
	let playerN=this.players.indexOf(player);
	if(this.status==='open'&&player===this.players[0]&&m==='start'){
		this.status='playing';
		if(PokerNewHand(users,this,DM)){
			return('Not enough players.');
		}
		return('Everyone antes $'+this.ante+'. First betting phase: <@'+this.players[this.turn]+'> bets first.');
	}
	if(m==='bank'){
		return('$'+this.banks[playerN]);
	}
	if(m==='banks'){
		let fs=[];
		let rps=[];
		for(let i=0;i<this.players.length;i++){
			rps.push(i);
		}
		rps.sort((a,b)=>{return(this.banks[b]-this.banks[a]);});
		for(let i=0;i<this.players.length;i++){
			fs.push({
				name:
					(this.banks[rps[i]]<this.ante?':skull_crossbones: ':
					(this.fold[rps[i]]?':file_folder: ':':white_flower: '))+
					users[this.players[rps[i]]].nick+(this.dealer==rps[i]?' :white_circle:':''),
				value:
					this.banks[rps[i]]<=0?'Bankrupt':'$'+this.banks[rps[i]]
			});
		}
		fs.push({name:"Pot",value:'$'+this.Pot},{name:"Current Bet",value:'$'+this.maxBet});
		return({embed:{
			title:"Texas Hold'em standings",
			fields:fs,
			color: 5635942
			}});
	}
	if(m==='hands'){
		return('http://www.tunisiewin.tn/wp-content/uploads/2017/11/poker-hand.png');
	}
	if(this.players[this.turn]!==player){
		return("It's not your turn, it's <@"+this.players[this.turn]+">'s.");
	}
	if(m==='fold'){
		this.fold[playerN]=true;
		return(PokerNextTurn(users,this,DM));
	}
	if(m==='check'){
		if(this.maxBet===0){
			return(PokerNextTurn(users,this,DM));
		}
		return("You can't check, the current bet is $"+this.maxBet+".");
	}
	if(m==='call'){
		if(this.maxBet===0){
			return("You can't call when there isn't a bet.");
		}
		if(this.banks[playerN]+this.bets[playerN]<this.maxBet){
			this.Pot+=this.banks[playerN];
			this.bets[playerN]+=this.banks[playerN];
			this.banks[playerN]=0;
			return(['You went all in!'].concat(PokerNextTurn(users,this,DM)));
		}
		this.Pot+=this.maxBet-this.bets[playerN];
		this.banks[playerN]-=this.maxBet-this.bets[playerN];
		this.bets[playerN]+=this.maxBet-this.bets[playerN];
		return(PokerNextTurn(users,this,DM));
	}
	val=parseInt(m);
	if(val&&val>=1&&val<=this.banks[playerN]){
		val=Math.floor(val);
	}
	else{
		if(val<0){
			return("You can't bet a negative value.");
		}
		if(val>this.banks[playerN]){
			return("You can't bet more than you have.");
		}
		return('Invalid bet');
	}
	if(val+this.bets[playerN]<this.maxBet){
		return("You must bet at least $"+(this.maxBet-this.bets[playerN])+'.');
	}
	this.Pot+=val;
	this.bets[playerN]+=val;
	this.banks[playerN]-=val;
	if(this.bets[playerN]>this.maxBet){
		this.maxBet=this.bets[playerN];
	}
	return(["You bet $"+val+", the bet is now at $"+this.maxBet+"."].concat(PokerNextTurn(users,this,DM)));
};

module.game.prototype.quit=function(player,users,games,openGames,DM){
	try{
	if(player===this.players[0]){
		for(let i=0;i<this.players.length;i++){
			users[this.players[i]].netwin+=this.banks[i]-100;
			if(this.banks[i]>100){
				users[this.players[i]].bank+=Math.floor((this.banks[i]-100)*(this.buyIn>0?this.buyIn/100:0.2));
			}
			delete users[this.players[i]].current[this.server];
		}
		if(openGames[this.server].hasOwnProperty(this.players[0])){
			delete openGames[this.server][this.players[0]];
		}
		delete games[this.server][this.players[0]];
		return('The Texas Hold\'em game has been terminated.');
	}
	let n=this.players.indexOf(player);
	console.log('n='+n);
	console.log(JSON.stringify(this.players));
	this.fold[n]=true;
	let winn=this.banks[n]-100;
	users[player].netwin+=this.banks[n]-100;
	if(this.banks[n]>100){
		users[this.players[n]].bank+=Math.floor((this.banks[n]-100)*(this.buyIn>0?this.buyIn/100:0.2));
	}
	delete users[this.players[n]].current[this.server];
	this.banks[n]=0;
	if(this.turn==n){
		return(["You forfeited your turn by leaving the table with a net winnings of "+(winn<0?'-':'')+"$"+Math.abs(winn)+"."].concat(PokerNextTurn(users,this,DM)));
	}
	return("You have left the table with a net winnings of "+(winn<0?'-':'')+"$"+Math.abs(winn)+".");
	}catch(e){
		console.log('error quiting:\n'+e);
		return("You found a known bug, congrats! Try bugging the devs about it; server invite: WYYYNjM");
	}
};

