function Map(cfg, eventManager) {

	eventManager.map = this;

	this.maxCol = Profiles.map_col_size;
	this.maxRow =  Profiles.map_row_size;
	this.entrance = cfg.entrance != null ? cfg.entrance : {"col":0,"row":0};
	this.exit = cfg.exit != null ? cfg.exit : {"col":Profiles.map_col_size-1,"row":Profiles.map_row_size-1};

	this.wave = 0;

	this.blocks = [];
	this.towers = [];
	this.monsters = [];
	this.bullets = [];

	this.monstersWaitingList = [];
	this.monstersDelay = 0;
	this.mD = 0;


	this.init();

}

Map.prototype = {

	init: function() {
		var c,r;
		var cfg = {};
		var block;
		for (c=0; c < this.maxCol; c++) {
			var colBlocks = [];
			cfg.col = c;
			for (r=0; r < this.maxRow; r++) {
				cfg.row = r;
				if (c == this.entrance.col && r == this.entrance.row) {
					cfg.isEntrance = true;
				} else {
					delete cfg.isEntrance;
				}
				if (c == this.exit.col && r == this.exit.row) {
					cfg.isExit = true;
				} else {
					delete cfg.isExit;
				}
				block = BlockFactory.create(cfg);
				colBlocks.push(block);
			}
			this.blocks.push(colBlocks);
		}
	},

	step: function() {
		var _this = this;
		this.bullets = this.bullets.filter(b => b.isValid);
		this.monsters = this.monsters.filter(m => m.isValid);
		this.towers = this.towers.filter(t => t.isValid);
		this.monsters.forEach(function(monster) {
			if(monster.needsUpdatePath) {
				monster.setPath(_this);
			}
			monster.step();
		});
		this.towers.forEach(function(tower) {
			if(tower.needsUpdateTarget) {
				tower.setTarget(_this);
			}
			tower.step();
		});
		this.bullets.forEach(function(bullet) {
			bullet.step();
			_this.checkHit(bullet);
		});
		if(this.monsters.length == 0 && this.monstersWaitingList.length == 0) {
			this.addMonstersToWaitingList();
			return;
		}
		if(this.mD <= 0 && this.monstersWaitingList.length > 0) {
			this.addMonster(this.monstersWaitingList.shift());
			this.mD = this.monstersDelay;
			return;
		}
		if(this.mD > 0 && this.monstersWaitingList.length > 0) {
			this.mD -= 1;
		}
	},

	addMonstersToWaitingList: function() {
		var info = MonsterDatabase.getMonstersInfo(this.wave)
		this.monstersWaitingList = info.monsters;
		this.monstersDelay = info.delay;
		this.mD = this.monstersDelay;
		//this.wave += 1;
	},

	addMonster: function(monsterType) {
		var monsterCfg = {
			"monsterType": monsterType
		};
		var monster = MonsterFactory.create(Object.assign(this.entrance, monsterCfg), this);
		this.monsters.push(monster);
	},

	findPath: function(sc, sr, ec, er) {
		if(sc == ec && sr == er) {
			return [];
		}
		var sNode = {
			"col": sc,
			"row": sr,
			"id": Utils.generatePathNodeId(sc,sr),
			"distance": Math.abs(sc - ec) + Math.abs(sr - er),
			"super": null
		}, node;
		var queue = [
			sNode
		];
		var trash = {};
		var c,r;
		while(queue.length > 0) {
			sNode = queue.shift();
			c = sNode.col-1;
			r = sNode.row;
			node = {};
			node.col = c;
			node.row = r;
			node.id = Utils.generatePathNodeId(c,r);
			node.super = sNode;
			if(c == ec && r == er) {
				break;
			} 
			if(Utils.colIsValid(c) && trash[node.id] == null && this.blocks[c][r].isPassable) {
				node.distance = Math.abs(c - ec) + Math.abs(r - er);
				var i;
				for(i=0; i<queue.length; i++) {
					if (node.distance <= queue[i].distance) break;
				}
				queue.splice(i,0,node);
			}
			c = sNode.col+1;
			r = sNode.row;
			node = {};
			node.col = c;
			node.row = r;
			node.id = Utils.generatePathNodeId(c,r);
			node.super = sNode;
			if(c == ec && r == er) {
				break;
			} 
			if(Utils.colIsValid(c) && trash[node.id] == null && this.blocks[c][r].isPassable) {
				node.distance = Math.abs(c - ec) + Math.abs(r - er);
				var i;
				for(i=0; i<queue.length; i++) {
					if (node.distance <= queue[i].distance) break;
				}
				queue.splice(i,0,node);
			}
			c = sNode.col;
			r = sNode.row-1;
			node = {};
			node.col = c;
			node.row = r;
			node.id = Utils.generatePathNodeId(c,r);
			node.super = sNode;
			if(c == ec && r == er) {
				break;
			} 
			if(Utils.rowIsValid(r) && trash[node.id] == null && this.blocks[c][r].isPassable) {
				node.distance = Math.abs(c - ec) + Math.abs(r - er);
				var i;
				for(i=0; i<queue.length; i++) {
					if (node.distance <= queue[i].distance) break;
				}
				queue.splice(i,0,node);
			}
			c = sNode.col;
			r = sNode.row+1;
			node = {};
			node.col = c;
			node.row = r;
			node.id = Utils.generatePathNodeId(c,r);
			node.super = sNode;
			if(c == ec && r == er) {
				break;
			} 
			if(Utils.rowIsValid(r) && trash[node.id] == null && this.blocks[c][r].isPassable) {
				node.distance = Math.abs(c - ec) + Math.abs(r - er);
				var i;
				for(i=0; i<queue.length; i++) {
					if (node.distance <= queue[i].distance) break;
				}
				queue.splice(i,0,node);
			}
			node = null;
			trash[sNode.id] = true;
		}
		if (node == null) {
			return null;
		}
		var path = [];
		while(node != null) {
			path.unshift(this.blocks[node.col][node.row]);
			node = node.super;
		}
		return path;
	},

	findPathToExit: function(col, row) {
		return this.findPath(col, row, this.exit.col, this.exit.row);
	},

	updateMonstersPath: function() {
		var _this = this;
		this.monsters.forEach(function(monster) {
			monster.setPath(_this);
		});
	},

	findMonsterInRange: function(cx, cy, range) {
		var monster = null
		for (var i in this.monsters) {
			monster = this.monsters[i];
			if (Math.pow((cx - monster.cx),2) + Math.pow((cy - monster.cy),2) <= Math.pow(range + monster.size,2)) {
				return monster;
			}
		}
		return null;
	},

	checkHit: function(bullet) {
		for (var i in this.monsters) {
			monster = this.monsters[i];
			var dis = Math.sqrt(Math.pow(bullet.cx-monster.cx,2)+Math.pow(bullet.cy-monster.cy,2));
			if ( dis <= monster.size+bullet.size+bullet.speed) {
				if (bullet.cx == monster.cx) {
					bullet.cy = (monster.cy >= bullet.cy) ? monster.cy - monster.size - bullet.size :  monster.cy + monster.size + bullet.size
				} else if (bullet.cy == monster.cy) {
					bullet.cx = (monster.cx >= bullet.cx) ? monster.cx - monster.size - bullet.size :  monster.cx + monster.size + bullet.size
				} else {
					var dx,dy;
					var k = (monster.cy - bullet.cy) / (monster.cx - bullet.cx);
					dx = Math.sqrt(Math.pow((monster.size + bullet.size),2) / (1 + k * k));
					dx = (monster.cx >= bullet.cx) ? -dx : dx;
					dy = k * dx;
					bullet.cx = monster.cx + dx;
					bullet.cy = monster.cy + dy;
				}
				monster.life -= bullet.damage;
				bullet.hit = true;
				break;
			}
		}
	}

}
