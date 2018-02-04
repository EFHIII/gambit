module=module.exports={};

const numbers=[':zero:',':one:',':two:',':three:',':four:',':five:',':six:',':seven:',':eight:',':nine:',':keycap_ten:'];

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

module.game=function(host,server){
	this.server=server;
	this.game=2;
	this.players=[host];
	this.min=2;
	this.max=2;
	this.status='open';
	this.turn=Math.floor(Math.random()*2);
	this.playfield=[[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,2,1,0,0,0],[0,0,0,1,2,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]];
};

module.game.prototype.join=function(player,users){
	this.players.push(player);
};

module.game.prototype.start=function(users){
	this.status='playing';
	return("```\nOn your turn, post a coordinate a1-h8 in `s indicating where to go.\nexample: `c4`\n```\n\n<@"+this.players[this.turn]+">, it's your turn:"+OthelloBoard(this.playfield,this.turn+1));
};

module.game.prototype.action=function(m,player,users,games,openGames){
	var at,val,rep,win,pf;
	if(this.players[this.turn]!==player){
		return("It's not your turn, it's <@"+this.players[this.turn]+">'s.");
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
	if(!OthelloCheck(val,this.playfield,this.turn+1)){
		return('Invalid move');
	};
	OthelloMove(val,this.turn+1,this.playfield);
	this.turn++;
	if(this.turn>1){this.turn=0;}
	win=OthelloBoard(this.playfield,this.turn+1);
	pf=win[1];
	win=win[0];
	if(win===4){
		this.turn++;
		if(this.turn>1){this.turn=0;}
	}
	else if(win===3){
		rep="Draw, nobody won. :cry:";
		users[player].tied++;
		users[this.players[this.turn]].tied++;
	}
	else if(win>0){
		rep="<@"+this.players[win-1]+"> WON!";
		users[this.players[win-1]].won++;
		users[this.players[Math.abs(win-3)]].lost++;
	}
	else{
		rep="<@"+this.players[this.turn]+">, your turn!";
	}
	if(win>0&&win<4){
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
		delete games[this.server][this.players[0]];
		return('You have terminated your game of '+this.game+'.');
	}
	for(let i=0;i<2;i++){
		if(this.players[i]===player){
			users[this.players[i]].quit++;
		}
		else{
			users[this.players[i]].won++;
		}
		users[this.players[i]].played++;
		delete users[this.players[i]].current[this.server];
	}
	delete games[this.server][this.players[0]];
	return('You have forfieted the game of '+this.game+'.');
};


