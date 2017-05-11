var TowerFactory = {
	
	scene: null,
	eventManager: null,

	setup: function(scene, eventManager) {
		this.scene = scene;
		this.eventManager = eventManager;
	},

	create: function(cfg) {
		var tower = new Element(cfg);
		$.each(TowerFactory.towerProfiles,function(key, value) {
			tower[key] = value;
		});
		tower.id = tower.prefix + tower.id;
		tower.cx = (tower.col + 1/2) * tower.blockSize;
		tower.cy = (tower.row + 1/2) * tower.blockSize;
		tower.type = cfg.towerType != null ? cfg.towerType : "NULL";
		tower.attributes = WeaponDatabase.getWeaponAttributes(tower.type);

		tower.level = 0;
		tower.damage = tower.attributes.damage;
		tower.range = Math.round(tower.attributes.range * tower.blockSize);
		tower.delay = Math.round(tower.attributes.delay * Profiles.default_fps);

		tower.target = null;
		tower.aimed = false;
		tower.tube = Utils.generateRandomPosition();

		tower.timer = tower.delay;

		tower.needsUpdateTarget = (tower.target == null);

		if (this.scene != null) {
			this.scene.addElement(tower);
		}
		if (this.eventManager != null) {
			this.eventManager.towerCreatedHandler(tower);
		}

		return tower;
	},

	towerProfiles: {
		prefix: "to-",
		sceneLevel: 1,
		isSelected: false,
		draw: function(ctx) {
			
			TowerRenderer.render(ctx, this);
			// Draw range
			if(this.isSelected && this.attributes["range"] > 0) {
				ctx.fillStyle = "rgba(255, 128, 128, 0.2)";
				ctx.strokeStyle = "rgba(255, 128, 128, 0.6)";
				ctx.beginPath();
				ctx.arc(this.cx, this.cy, this.range, 0, Math.PI * 2, true);
				ctx.closePath();
				ctx.fill();
				ctx.stroke();
			}
		},
		onEnter: function() {
			this.isHover = true;
		},
		onOut: function() {
			this.isHover = false;
		},
		onHover: function() {
			
		},
		onClick: function() {
			if (this.isSelected) {
				this.upgrade();
				console.log(this.level);
			} else {
				this.isSelected = true;
			}
		},
		setTarget: function(map) {
			this.target = map.findMonsterInRange(this.cx, this.cy, this.range);
			this.needsUpdateTarget = false
		},
		checkTargetIsValid: function() {
			return (this.target != null 
				&& this.target.isValid && !this.target.isDead 
				&& (Math.pow((this.cx-this.target.cx),2) + Math.pow((this.cy-this.target.cy),2) <= Math.pow(this.range+this.target.size,2)));
		},
		updateTube: function() {
			var tubeDis = Math.sqrt(Math.pow((this.tube.cy - this.cy),2) + Math.pow((this.tube.cx - this.cx),2));
			var tubeSin = (this.tube.cy - this.cy) / tubeDis;
			var tubeCos = (this.tube.cx - this.cx) / tubeDis;
			var targetDis = Math.sqrt(Math.pow((this.target.cy - this.cy),2) + Math.pow((this.target.cx - this.cx),2));
			var targetSin = (this.target.cy - this.cy) / targetDis;
			var targetCos = (this.target.cx - this.cx) / targetDis;
			var cos = Math.max(Math.min(tubeCos * targetCos + tubeSin * targetSin ,1), -1);
			var sin = Math.max(Math.min(tubeSin * targetCos - tubeCos * targetSin ,1), -1);

			if (Math.acos(cos) <= this.attributes.aimSpeed) {
				this.tube.cx = this.target.cx;
				this.tube.cy = this.target.cy;
				this.aimed = true;
			} else {
				var degree = Math.asin(sin) >= 0 ? -this.attributes.aimSpeed : this.attributes.aimSpeed;
				this.tube.cx = this.cx + tubeDis * (tubeCos * Math.cos(degree) - tubeSin * Math.sin(degree));
				this.tube.cy = this.cy + tubeDis * (tubeSin * Math.cos(degree) + tubeCos * Math.sin(degree));
			}
		},
		getBulletAttrs: function() {
			return {
				"col": this.col,
				"row": this.row,
				"color": this.attributes.bulletColor,
				"size": this.attributes.bulletSize * this.blockSize,
				"speed": this.attributes.bulletSpeed,
				"damage": this.damage
			};
		},
		fire: function() {
			if (this.timer <= 0) {
				BulletFactory.create(this.getBulletAttrs(), this.target);
				this.timer = this.delay;
			} else {
				this.timer -= 1;
			}
		},
		upgrade: function() {
			this.level += 1;
			this.damage = this.attributes.damage + this.level * this.attributes.upgrade.damage;
			this.range = Math.round((this.attributes.range + this.level * this.attributes.upgrade.range) * this.blockSize);
			this.delay = Math.round(this.attributes.delay * Profiles.default_fps * this.attributes.upgrade.delay);
		},	
		step: function() {
			if (this.checkTargetIsValid()) {
				this.updateTube();
				if(this.aimed) {
					this.fire();
				}
			} else {
				this.aimed = false;
				this.needsUpdateTarget = true;
			}
		}
	}
}