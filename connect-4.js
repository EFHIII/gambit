module=module.exports={};

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

module.game=function(host,server){
	this.server=server;
	this.game=1;
	this.players=[host];
	this.min=2;
	this.max=2;
	this.status='open';
	this.turn=Math.floor(Math.random()*2);
	this.playfield=[[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]];
};

module.game.prototype.join=function(player,users){
	this.players.push(player);
};

module.game.prototype.start=function(users){
	this.status='playing';
	return("```\nOn your turn, post a number 1-7 in `s indicating where to go.\nexample: `4`\n```\n\n<@"+this.players[this.turn]+">, it's your turn:"+C4Board(this.playfield));
};

module.game.prototype.action=function(m,player,users,games,openGames){
	var at,val,rep,win,pf;
	if(this.players[this.turn]!==player){
		return("It's not your turn, it's <@"+this.players[this.turn]+">'s.");
	}
	val=parseInt(m);
	if(val&&val>=1&&val<=7){
		val=Math.round(val);
		val--;
	}
	else{
		return('Must be a number 1-7');
	}
	if(this.playfield[val][0]>0){
		return('That row is full');
	}
	at = 5;
	while (this.playfield[val][at] !== 0) {
		at--;
	}
	this.playfield[val][at] = this.turn+1;
	this.turn++;
	if(this.turn>1){this.turn=0;}
	win=C4Win(this.playfield);
	if(win===3){
		rep="Draw, nobody won. :cry:";
		users[player].tied++;
		users[player].bank+=this.buyIn;
		users[this.players[this.turn]].tied++;
		users[this.players[this.turn]].bank+=this.buyIn;
	}
	else if(win>0){
		rep="<@"+player+"> WON $"+(this.buyIn>0?this.pot:5)+"!";
		users[player].won++;
		users[player].bank+=this.buyIn>0?this.pot:8;
		users[this.players[this.turn]].lost++;
	}
	else{
		rep="<@"+this.players[this.turn]+">, your turn!";
	}
	pf=C4Board(this.playfield);
	if(win>0){
		users[player].played++;
		users[this.players[this.turn]].played++;
		delete users[player].current[this.server];
		delete users[this.players[this.turn]].current[this.server];
		delete games[this.server][this.players[0]];
	}
	return(rep+pf);
};

module.game.prototype.quit=function(player,users,games,openGames){
	if(this.status==='open'){
		delete openGames[this.server][this.players[0]];
		delete users[player].current[this.server];
		users[player].bank+=this.pot;
		delete games[this.server][this.players[0]];
		return('You have terminated your game of Connect 4.');
	}
	for(let i=0;i<2;i++){
		if(this.players[i]===player){
			users[this.players[i]].quit++;
		}
		else{
			users[this.players[i]].won++;
			users[this.players[i]].bank+=this.pot;
		}
		users[this.players[i]].played++;
		delete users[this.players[i]].current[this.server];
	}
	delete games[this.server][this.players[0]];
	return('You have forfieted the game of Connect 4.');
};
