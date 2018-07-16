module=module.exports={};

function KBoard(data,turn){
	var numbers=['<:m0:468015153288445972>','<:m1:468015526741016576>','<:m2:468015972633149441>','<:m3:468016208369680384>','<:m4:468016462963933187>','<:m5:468016720745988112>','<:m6:468017013831499796>','<:m7:468017309722869760>','<:m8:468017558339977216>','<:m9:468017920480378880>','<:m10:468018447671099393>','<:m11:468019543919427594>','<:m12:468020581577523210>','<:several:468021628501098497>'];
	var m='<:md:468014929119674368>';
	var ns='<:blank:468030945174224916>:one::two::three::four::five::six:';
	var sn='<:blank:468030945174224916>:six::five::four::three::two::one:';
	let ans="";
	if(turn>0){
		ans+=sn+'\n';
	}
	for(let i=13;i>6;i--){
		if(data[i]>=numbers.length){
			ans+=numbers[data.length-1];
		}
		else{
			ans+=numbers[data[i]];
		}
	}
	ans+=m+'\n'+m;
	for(let i=0;i<7;i++){
		if(data[i]>=numbers.length){
			ans+=numbers[data.length-1];
		}
		else{
			ans+=numbers[data[i]];
		}
	}
	if(turn<1){
		ans+='\n'+ns;
	}
	return(ans);
};

module.game=function(host,server){
	this.server=server;
	this.game=6;
	this.players=[host];
	this.min=2;
	this.max=2;
	this.status='open';
	this.turn=Math.floor(Math.random()*2);
	this.playfield=[4,4,4,4,4,4,0,4,4,4,4,4,4,0];
};

module.game.prototype.join=function(player,users){
	this.players.push(player);
};

module.game.prototype.start=function(users){
	this.status='playing';
	return(
		"```\nOn your turn, post a number 1-6 in `s indicating where to go.\nexample: `5`\n```\n\n<@"+
		this.players[this.turn]+">, it's your turn:\n"+
		KBoard(this.playfield,this.turn));
};

module.game.prototype.action=function(m,player,users,games,openGames){
	var at,val,rep,win,pf,seeds,turn,done;
	if(this.players[this.turn]!==player){
		return("It's not your turn, it's <@"+this.players[this.turn]+">'s.");
	}
	val=parseInt(m);
	if(val&&val>=1&&val<=6){
		val=Math.round(val);
		val--;
		val+=this.turn*7;
	}
	else{
		return('Must be a number 1-6');
	}
	if(this.playfield[val]>0){
		turn=this.turn;
		this.turn=Math.abs(this.turn-1);
		seeds=this.playfield[val];
		at=val;
		this.playfield[val]=0;
		while(seeds){
			at++;
			if(at>13||(!turn&&at>12)){
				at=0;
			}
			if(at===6&&turn){
				at++;
			}
			this.playfield[at]++;
			seeds--;
		}
		if(!turn&&at===6){this.turn=0;}
		if(turn&&at===13){this.turn=1;}
		if(at!==6&&at!=13&&this.playfield[at]===1&&this.playfield[12-at]&&((at<6&&!turn)||(at>6&&turn))){
			if(!turn){
				this.playfield[6]+=this.playfield[12-at];
				this.playfield[6]+=this.playfield[at];
			}
			else{
				this.playfield[13]+=this.playfield[12-at];
				this.playfield[13]+=this.playfield[at];
			}
			this.playfield[at]=0;
			this.playfield[12-at]=0;
		}
		done=true;
		for(var i=0;i<6;i++){
			if(this.playfield[i]){done=false;}
		}
		if(done){
			var txt='';
			if(this.playfield[6]>24){
				txt='<@'+this.players[0]+'> won $'+(this.buyIn>0?this.pot:4)+', '+this.playfield[6]+' - '+(48-this.playfield[6]);
				users[this.players[0]].won++;
				users[this.players[0]].bank+=this.buyIn>0?this.pot:4;
				users[this.players[1]].lost++;
			}
			else if(this.playfield[6]==24){
				txt='It was a tie!';
				users[this.players[0]].tied++;
				users[this.players[0]].bank+=this.buyIn;
				users[this.players[1]].tied++;
				users[this.players[1]].bank+=this.buyIn;
			}
			else{
				txt='<@'+this.players[1]+'> won $'+(this.buyIn>0?this.pot:4)+', '+(48-this.playfield[6])+' - '+this.playfield[6];
				users[this.players[1]].won++;
				users[this.players[1]].bank+=this.buyIn>0?this.pot:4;
				users[this.players[0]].lost++;
			}
			users[this.players[0]].played++;
			users[this.players[1]].played++;
			delete users[this.players[0]].current[this.server];
			delete users[this.players[0]].current[this.server];
			delete games[this.server][this.players[0]];
			return(txt);
		}
		done=true;
		for(var i=7;i<13;i++){
			if(this.playfield[i]){done=false;}
		}
		if(done){
			var txt='';
			if(this.playfield[13]>24){
				txt='<@'+this.players[1]+'> won $'+(this.buyIn>0?this.pot:4)+', '+this.playfield[13]+' - '+(48-this.playfield[13]);
				users[this.players[1]].won++;
				users[this.players[1]].bank+=this.buyIn>0?this.pot:4;
				users[this.players[0]].lost++;
			}
			else if(this.playfield[13]==24){
				txt='It was a tie!';
				users[this.players[0]].tied++;
				users[this.players[0]].bank+=this.buyIn;
				users[this.players[1]].tied++;
				users[this.players[1]].bank+=this.buyIn;
			}
			else{
				txt='<@'+this.players[0]+'> won $'+(this.buyIn>0?this.pot:4)+', '+(48-this.playfield[13])+' - '+this.playfield[13];
				users[this.players[0]].won++;
				users[this.players[0]].bank+=this.buyIn>0?this.pot:4;
				users[this.players[1]].lost++;
			}
			users[this.players[0]].played++;
			users[this.players[1]].played++;
			delete users[this.players[0]].current[this.server];
			delete users[this.players[0]].current[this.server];
			delete games[this.server][this.players[0]];
			return(txt);
		}
	}
	else{
		return('That house is empty.');
	}
	console.log(this.turn);
	return(["<@"+this.players[this.turn]+">, your turn!",KBoard(this.playfield,this.turn)]);
};

module.game.prototype.quit=function(player,users,games,openGames){
	if(this.status==='open'){
		delete openGames[this.server][this.players[0]];
		delete users[player].current[this.server];
		users[player].bank+=this.buyIn>0?this.pot:4;
		delete games[this.server][this.players[0]];
		return('You have terminated your game of Kalah.');
	}
	for(let i=0;i<2;i++){
		if(this.players[i]===player){
			users[this.players[i]].quit++;
		}
		else{
			users[this.players[i]].won++;
			users[this.players[i]].bank+=this.buyIn>0?this.pot:4;
		}
		users[this.players[i]].played++;
		delete users[this.players[i]].current[this.server];
	}
	delete games[this.server][this.players[0]];
	return('You have forfieted the game of Kalah.');
};

