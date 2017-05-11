var MonsterFactory = {

	scene: null,

	setup: function(scene) {
		this.scene = scene;
	},

	create: function(cfg, map) {
		var monster = new Element(cfg);
		$.each(MonsterFactory.monsterProfiles,function(key, value) {
			monster[key] = value;
		});
		monster.id = monster.prefix + monster.id;
		monster.color = Utils.generateRndColor();
		monster.rgbColor = Utils.hexToRGB(monster.color);
		monster.lineWidth = Profiles.getLineWidth();
		monster.cx = (monster.col + 1/2) * monster.blockSize;
		monster.cy = (monster.row + 1/2) * monster.blockSize

		monster.type = cfg.monsterType != null ? cfg.monsterType : "NULL";
		monster.attributes = MonsterDatabase.getMonsterAttributes(monster.type);
		monster.size = Math.round(monster.blockSize * monster.attributes.size);
		monster.life = monster.attributes.life;
		monster.speed = monster.attributes.speed * Profiles.global_speed_rate;

		monster.path = [];
		monster.needsUpdatePath = false;
		monster.hasArrived = false;
		monster.isStuck = false;
		monster.isDead = false;
		monster.explode = null;

		monster.setPath(map);

		if (this.scene != null) {
			this.scene.addElement(monster);
		}
		
		return monster;
	},

	monsterProfiles: {
		prefix: "mo-",
		sceneLevel: 2,
		getExplodeAttrs: function() {
			return {
				"cx": this.cx,
				"cy": this.cy,
				"size": this.size * 1.5,
				"color": this.color,
				"duration": 0.3
			};
		},
		arrivedHandler: function() {
			console.log(this.id+"has arrived!!!");
			this.isValid = false;
		},
		draw: function(ctx) {
			if(this.explode != null) {
				this.explode.draw(ctx);
				return;
			}

			ctx.strokeStyle = "#000";
			ctx.lineWidth = this.lineWidth;
			ctx.fillStyle = this.color;
			ctx.beginPath();
			ctx.arc(this.cx, this.cy, this.size, 0, Math.PI * 2, true);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();

			if (Profiles.show_monster_life) {
				var hpMaxWidth = (this.size + this.lineWidth * 4) * 2;
				var hpHeight = this.lineWidth * 4
				ctx.fillStyle = "#000";
				ctx.fillRect(this.cx - hpMaxWidth / 2, this.cy - this.size - this.lineWidth - hpHeight, hpMaxWidth, hpHeight);
				ctx.fillStyle = "#f00";
				ctx.fillRect(this.cx - hpMaxWidth / 2 + this.lineWidth
					, this.cy - this.size - hpHeight
					, (hpMaxWidth - 2 * this.lineWidth) * (this.life / this.attributes.life)
					, hpHeight - 2 * this.lineWidth);
			}
		},
		onEnter: function() {
		},
		onOut: function() {
		},
		onHover: function() {
		},
		onClick: function() {
		},
		setPath: function(map) {
			this.needsUpdatePath = false;
			var p = map.findPathToExit(this.col, this.row);
			if(p == null) {
				this.isStuck = true;
				this.path = [];
				return;
			}
			if(p.length == 0) {
				this.hasArrived = true;
				this.path = [];
				return;
			}
			if(p[0].col == this.col && p[0].row == this.row) {
				p.shift();
			}
			this.path = p;
		},
		checkPathIsValid: function() {
			for(var i in this.path) {
				if(!path[i].isPassable) return false;
			}
			return true;
		},
		hit: function(damage) {
			this.life = Math.max(0, this.life - damage);
		},
		step: function() {
			if(this.isStuck) return;

			if(this.hasArrived) {
				this.arrivedHandler();
				return;
			}

			if(this.explode != null) {
				this.explode.step();
				this.isValid = !this.explode.isCompleted;
				return;
			}
			if (this.isDead) {
				this.explode = new Explode(this.getExplodeAttrs());
				this.explode.step();		
				return;	
			}
			if (this.life <= 0) {
				this.isDead = true;
				return;
			}

			if (this.path.length == 0) {
				this.needsUpdatePath = true;
				return;
			}

			if (this.path.length > 0) {
				var nextBlock = this.path[0];
				var c = nextBlock.col, r = nextBlock.row;
				var delta;
				if(c != this.col) {
					delta = (c - this.col) / Math.abs(c - this.col) * this.speed;
					if ((delta > 0 && this.cx + delta >= nextBlock.cx) 
						|| (delta < 0 && this.cx + delta <= nextBlock.cx)) {
						this.cx = nextBlock.cx;
						this.col = c;
						this.row = r;
						this.path.shift();
					} else {
						this.cx += delta;
					}
				} else {
					delta = (r - this.row) / Math.abs(r - this.row) * this.speed;
					if ((delta > 0 && this.cy + delta >= nextBlock.cy) 
						|| (delta < 0 && this.cy + delta <= nextBlock.cy)) {
						this.cy = nextBlock.cy;
						this.col = c;
						this.row = r;
						this.path.shift();
					} else {
						this.cy += delta;
					}
				}

			} 
			
		}
	}

}