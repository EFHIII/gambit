module=module.exports={};

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

module.game=function(host,server){
	this.server=server;
	this.game=0;
	this.players=[host];
	this.min=2;
	this.max=2;
	this.status='open';
	this.turn=Math.floor(Math.random()*2);
	this.playfield=[[0,0,0],[0,0,0],[0,0,0]];
};

module.game.prototype.join=function(player,users){
	this.players.push(player);
};

module.game.prototype.start=function(users){
	this.status='playing';
	return(
		"```\nOn your turn, post a number 1-9 in `s indicating where to go.\nexample: `5`\n```\n\n<@"+
		this.players[this.turn]+">, it's your turn:"+
		TTTBoard(this.playfield));
};

module.game.prototype.action=function(m,player,users,games,openGames){
	var at,val,rep,win,pf;
	if(this.players[this.turn]!==player){
		return("It's not your turn, it's <@"+this.players[this.turn]+">'s.");
	}
	val=parseInt(m);
	if(val&&val>=1&&val<=9){
		val=Math.round(val);
		val--;
	}
	else{
		return('Must be a number 1-9');
	}
	if(this.playfield[Math.floor(val/3)][val%3]===0){
		this.playfield[Math.floor(val/3)][val%3]=this.turn+1;
	}
	else{
		return('That space is taken.');
	}
	this.turn++;
	if(this.turn>1){this.turn=0;}
	rep="";
	win=TTTWin(this.playfield);
	if(win===2){
		rep="<@"+player+"> WON $"+(this.buyIn>0?this.pot:2)+"!";
		users[player].won++;
		users[player].bank+=this.buyIn>0?this.pot:2;
		users[this.players[this.turn]].lost++;
	}
	else if(win===1){
		rep="Cats game, nobody won. :cry:";
		users[player].tied++;
		users[player].bank+=this.buyIn;
		users[this.players[this.turn]].tied++;
		users[this.players[this.turn]].bank+=this.buyIn;
	}
	else{
		rep="<@"+this.players[this.turn]+">, your turn!";
	}
	pf=TTTBoard(this.playfield);
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
		return('You have terminated your game of Tic-Tac-Toe.');
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
	return('You have forfieted the game of Tic-Tac-Toe.');
};

