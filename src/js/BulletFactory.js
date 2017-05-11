var BulletFactory = {

	scene: null,
	eventManager: null,

	setup: function(scene, eventManager) {
		this.scene = scene;
		this.eventManager = eventManager;
	},

	create: function(cfg, target) {
		var bullet = new Element(cfg);
		$.each(BulletFactory.monsterProfiles,function(key, value) {
			bullet[key] = value;
		});
		bullet.id = bullet.prefix + bullet.id;
		bullet.cx = (bullet.col + 1/2) * bullet.blockSize;
		bullet.cy = (bullet.row + 1/2) * bullet.blockSize;
		bullet.target = target;
		bullet.color = cfg.color != null ? cfg.color : "#000";
		bullet.rgbColor = Utils.hexToRGB(bullet.color);
		bullet.size = cfg.size != null ? cfg.size : Math.round(bullet.blockSize / 16);
		bullet.speed = cfg.speed != null ? cfg.speed : 6;
		bullet.damage = cfg.damage != null ? cfg.damage : 1;

		bullet.hit = false;
		bullet.explode = null;

		bullet.init();

		if (this.scene != null) {
			this.scene.addElement(bullet);
		}
		if (this.eventManager != null) {
			this.eventManager.bulletCreatedHandler(bullet);
		}

		return bullet;
	},

	monsterProfiles: {
		prefix: "bu-",
		sceneLevel: 3,
		init: function() {
			if (this.cy == this.target.cy) {
				this.vy = 0;
				this.vx = (this.target.cx >= this.cx) ? this.speed : -this.speed;
				return;
			}
			if (this.cx == this.target.cx) {
				this.vx = 0;
				this.vy = (this.target.cy >= this.cy) ? this.speed : -this.speed;
				return;
			}
			var k = (this.target.cy - this.cy) / (this.target.cx - this.cx);
			this.vx = Math.sqrt(Math.pow(this.speed,2) / (k*k + 1));
			this.vx = (this.target.cx - this.cx > 0) ? this.vx : -this.vx;
			this.vy = k * this.vx;
		},
		getExplodeAttrs: function() {
			return {
				"cx": this.cx,
				"cy": this.cy,
				"size": this.size,
				"color": this.color,
				"duration": 1/6
			};
		},
		draw: function(ctx) {
			if(this.explode != null) {
				this.explode.draw(ctx);
				return;
			}
			ctx.fillStyle = this.color;
			ctx.beginPath();
			ctx.arc(this.cx, this.cy, this.size, 0, Math.PI * 2, true);
			ctx.closePath();
			ctx.fill();
		},
		onEnter: function() {
		},
		onOut: function() {
		},
		onHover: function() {
		},
		onClick: function() {
		},
		checkIsValid: function() {
			this.isValid = Utils.positionIsValid(this.cx, this.cy);
			return this.isValid;
		},
		hitTarget: function(monster) {
			if (this.cx == monster.cx) {
					this.cy = (monster.cy >= this.cy) ? monster.cy - monster.size - this.size :  monster.cy + monster.size + this.size
				} else if (this.cy == monster.cy) {
					this.cx = (monster.cx >= this.cx) ? monster.cx - monster.size - this.size :  monster.cx + monster.size + this.size
				} else {
					var dx,dy;
					var k = (monster.cy - this.cy) / (monster.cx - this.cx);
					dx = Math.sqrt(Math.pow((monster.size + this.size),2) / (1 + k * k));
					dx = (monster.cx >= this.cx) ? -dx : dx;
					dy = k * dx;
					this.cx = monster.cx + dx;
					this.cy = monster.cy + dy;
				}
				monster.hit(this.damage);
				this.hit = true;
		},
		step: function() {
			if(this.explode != null) {
				this.explode.step();
				this.isValid = !this.explode.isCompleted;
				return;
			}
			if(this.hit) {
				this.explode = new Explode(this.getExplodeAttrs());
				this.explode.step();		
				return;		
			}
			if (!this.checkIsValid) return;
			this.cx += this.vx;
			this.cy += this.vy;
		}
	}
}