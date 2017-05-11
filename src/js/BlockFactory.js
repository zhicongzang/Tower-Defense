var BlockFactory = {

	scene: null,
	eventManager: null,

	setup: function(scene, eventManager) {
		this.scene = scene;
		this.eventManager = eventManager;
	},

	create: function(cfg) {
		var block = new Element(cfg);
		$.each(BlockFactory.blockProfiles,function(key, value) {
			block[key] = value;
		});
		block.id = block.prefix + block.id;
		block.x = block.col * block.blockSize;
		block.y = block.row * block.blockSize;
		block.cx = block.x + block.blockSize / 2;
		block.cy = block.y + block.blockSize / 2;
		block.tower = null;
		block.isEntrance = cfg.isEntrance != null ? cfg.isEntrance : false;
		block.isExit = cfg.isExit != null ? cfg.isExit : false;
		block.isPassable = true;

		if (this.scene != null) {
			this.scene.addElement(block);
		}
		if (this.eventManager != null) {
			this.eventManager.registerElement(block);
		}

		return block;
	},

	blockProfiles: {
		prefix: "bl-",
		sceneLevel: 0,
		draw: function(ctx) {
			ctx.strokeStyle = "#eee";
			ctx.strokeRect(this.x, this.y, this.blockSize, this.blockSize);
			if (this.isEmpty() && this.isHover) {
				ctx.fillStyle = "rgba(255,255,200,0.3)";
				ctx.fillRect(this.x, this.y, this.blockSize, this.blockSize);
			} 
			if (this.isEntrance || this.isExit) {
				ctx.fillStyle = "#ccc";
				ctx.fillRect(this.x,this.y,this.blockSize,this.blockSize);
				ctx.strokeStyle = "#666";
				ctx.fillStyle = this.isEntrance ? "#fff" : "#666";
				ctx.beginPath();
				ctx.arc(this.cx, this.cy, this.blockSize * 0.4, 0, Math.PI * 2, true);
				ctx.closePath();
				ctx.fill();
				ctx.stroke();
			}
		},
		onEnter: function() {
			this.isHover = true;
			if (this.tower != null) {
				this.tower.onEnter();
				return;
			}
		},
		onOut: function() {
			this.isHover = false;
			if (this.tower != null) {
				this.tower.onOut();
				return;
			}
		},
		onHover: function() {
			if (this.tower != null) {
				this.tower.onHover();
				return;
			}
		},
		onClick: function() {
			if (this.tower != null) {
				this.tower.onClick();
				return;
			}
			if (this.isEmpty()) {
				this.buildTower("MiniGun");
			}
		},
		isEmpty: function() {
			return this.tower == null && !this.isEntrance && !this.isExit;
		},
		buildTower: function(towerType) {
			this.isPassable = false;
			var towerCfg = {
				"col": this.col,
				"row": this.row,
				"towerType": towerType
			};
			var tower = TowerFactory.create(towerCfg);
			this.tower = tower;
		}
	}
}
