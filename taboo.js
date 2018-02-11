module=module.exports={};

const words=[
	['car',['driver','ride','transport','fast','travel']],
	['dragonfly',['red','wings','insect','fly','dragon']],
	['snowflake',['cold','winter','flower','snow','fall']],
	['hungry',['feeling','eat','food','breakfast','meal']],
	['duck',['bird','yellow','chicken','quack','food']],
	['pillow',['head','sleep','soft','bed','blanket']],
	['dance',['shoe','romantic','music','sing','town']],
	['proud',['feel','accomplish','great','boast','humble']],
	['blanket',['warm','bed','pillow','soft','cold']],
	['soccer',['ball','world','cup','sport','team']],
	['cheese',['yellow','white','pizza','food','italy']],
	['snail',['round','slow','river','eat','animal']],
	['dinosaur',['big','animal','extinct','ago','reptile']],
	['japan',['country','asia','blossom','sushi','tokyo']],
	['new york',['city','america','apple','statue','liberty','new','york']],
	['husband',['wife','ring','marry','man','friend']],
	['giraffe',['tall','africa','neck','long','yellow']],
	['work',['camera','photos','picture','snapshot','travel','memo']],
	['comb',['brush','hair','smooth','small','beautiful']],
	['hamburger',['america','beef','bread','donald','healthy']],
	['polar bear',['cold','winter','alaska','white','snow','polar','bear']],
	['penguin',['bird','fly','animal','black','white']],
	['glasses',['eyes','see','contacts','wear','face']],
	['popcorn',['kernel','butter','sweet','microwave','snack','food']],
	['speech',['give','speak','important','audiance','nervous']],
	['chicken',['bird','body','eat','food','kfc']],
	['wish',['want','desire','hope','dream','long']],
	['bench',['sit','wooden','chair','long','park']],
	['excercise',['run','sports','healthy','daily','morning']],
	['crown',['head','gold','king','queen','jewels']],
	['princess',['prince','queen','daughter','royal','castle']],
	['internet',['computer','web','surf','net','tech']],
	['jacket',['coat','warm','cloth','sleeve','zip']],
	['shower',['rain','clean','water','every','day','bath']],
	['wind',['blow','autumn','invisible','tree','kite']],
	['ice cream',['cold','summer','sweet','snack','cone','ice','cream']],
	['church',['sing','build','cross','god','speak']],
	['police',['uniform','safe','peace','protect','siren']],
	['boots',['winter','shoes','warm','fashion','snow']],
	['ticket',['expensive','flight','travel','paper','seat']],
	['turkey',['bird','day','thanksgiving','big','tired']],
	['freezer',['cold','refrigerator','ice','food','kitchen']],
	['straw',['hollow','horse','farm','drink','suck']],
	['leaf',['tree','green','fall','plant','page']],
	['noun',['verb','speech','adj','person','place']],
	['taxi',['car','public','transport','fare','city']],
	['broom',['sweep','floor','witch','wooden','dust']],
	['witch',['broom','green','magic','halloween','powers']],
	['fork',['spoon','knife','eat','prongs','path']],
	['parade',['line','crowd','floats','gather','holiday']],
	['fashion',['clothes','model','girls','look','magazine']],
	['trash can',['rubbish','barrel','worth','ruin','old']],
	['marker',['write','draw','colors','children','art']],
	['snowman',['three','children','make','winter','outside','snow','man']],
	['wings',['bird','chicken','fly','arms','feathers']],
	['pilot',['fly','plane','helicopter','man','travel']],
];

function newTurn(users,game,DM){
	game.turn++;
	if(game.turn>=game.players.length){
		game.turn=0;
	}
	game.word=Math.floor(Math.random()*words.length);
	DM(game.players[game.turn],"Your word is: "+words[game.word][0]+"\nThe Taboo words are: "+words[game.word][1].join(', '));
};

module.game=function(host,server){
	this.server=server;
	this.game=5;
	this.players=[host];
	this.scores=[0];
	this.min=2;
	this.max=20;
	this.status='open';
	this.turn=0;
	this.good=false;
	this.word=0;
	this.anys=true;
};

module.game.prototype.join=function(player,users){
	this.scores.push(0);
	this.players.push(player);
};

module.game.prototype.start=function(users){
		return("```\nIn Taboo, one person is given a few words along with a specific word that they are supposed to get one of the other players to say. The catch is that, although they can give as many hints as they want, they can't use the words they're given in their hints. \n\nEveryone else's job is to try and guess what word they were given. You make your guess by putting it in `s\nexample: `car`\n\nBoth the person to guess correctly and the person with the word both receive one point. To see how many points you have, post `score`\nTo see how many points everyone has, post `scores`\nTo give up, post `i give up`\n\nThe game will start when the host says `start`\n```");
};

module.game.prototype.action=function(m,player,users,games,openGames,DM){
	let playerN=this.players.indexOf(player);
	if(this.status==='open'&&player===this.players[0]&&m==='start'){
		this.status='playing';
		if(this.players.length<2){
			return('Not enough players.');
		}
		newTurn(users,this,DM);
		return('<@'+this.players[this.turn]+'> has recieved their word.');
	}
	if(this.players.length<2){return('Not enough players.');}
	if(m==='score'){
		return(this.scores[playerN]);
	}
	if(m==='scores'){
		let fs=[];
		let rps=[];
		for(let i=0;i<this.players.length;i++){
			rps.push(i);
		}
		rps.sort((a,b)=>{return(this.scores[b]-this.scores[a]);});
		for(let i=0;i<this.players.length;i++){
			fs.push({
				name:users[this.players[rps[i]]].nick+(this.turn==rps[i]?' :white_circle:':''),
				value:this.scores[rps[i]]
			});
		}
		return({embed:{
			title:"Taboo scores",
			fields:fs,
			color: 5635942
			}});
	}
	if(this.players[this.turn]==player){
		if(m=='skip'||m=='quit'||m=='leave'||m=='give up'||m=='i give up'||m=='forfiet'){
			let buf='<@'+player+'> gave up. The word was '+words[this.word][0]+'.';
			newTurn(users,this,DM);
			return([buf,'<@'+this.players[this.turn]+'> has recieved their word.']);
		}
		return("You're not supposed to guess your own word...");
	}
	if(m==words[this.word][0]){
		let buf='<@'+player+'> got it! The word was '+words[this.word][0]+'.';
		this.scores[playerN]++;
		this.scores[this.turn]++;
		newTurn(users,this,DM);
		return([buf,'<@'+this.players[this.turn]+'> has recieved their word.']);
	}
	return('');
};

module.game.prototype.any=function(m,player,users,games,openGames,DM){
	let playerN=this.players.indexOf(player);
	if(this.players.length<2||playerN!=this.turn){
		return('');
	}
	if(m.indexOf(words[this.word][0])>-1){
		let buf='You use the Taboo word; '+words[this.word][1]+', Forfieting your turn.';
		this.scores[this.turn]--;
		newTurn(users,this,DM);
		return([buf,'<@'+this.players[this.turn]+'> has recieved their word.']);
	}
	for(let i=0;i<words[this.word][1].length;i++){
		if(m.indexOf(words[this.word][1][i])>-1){
			let buf='You used the word '+words[this.word][1][i]+' which was one of the Taboo words, forfieting your turn.';
			this.scores[this.turn]--;
			newTurn(users,this,DM);
			return([buf,'<@'+this.players[this.turn]+'> has recieved their word.']);
		}
	}
	return('');
};

module.game.prototype.quit=function(player,users,games,openGames,DM){
	if(player===this.players[0]){
		for(let i=0;i<this.players.length;i++){
			users[this.players[i]].bank+=Math.floor(this.scores[i]/5);
			delete users[this.players[i]].current[this.server];
		}
		if(openGames[this.server].hasOwnProperty(this.players[0])){
			delete openGames[this.server][this.players[0]];
		}
		delete games[this.server][this.players[0]];
		return('The game of Taboo has been terminated.');
	}
	let n=this.players.indexOf(player);
	users[this.players[n]].bank+=Math.floor(this.scores[n]/5);
	
	delete users[this.players[n]].current[this.server];
	this.players.slice(n,1);
	this.scores.slice(n,1);
	let score=this.scores.slice(n,1);
	if(this.turn==n){
		this.turn--;
		if(this.players.length<2){
			this.status='open';
			return('You left the table, leaving the host all alone.');
		}
		newTurn(users,this,DM);
		return(["You forfeited your turn by leaving the table, winning $"+Math.floor(score/5)+".",'<@'+this.players[this.turn]+'> has recieved their word.']);
	}
	return("You have left the table, winning $"+Math.floor(score/5)+".");
};

