var Popup = {

	scene: null,
	eventManager: null,

	sceneLevel: 5,
	isValid: false,

	blockSize: Profiles.getPopupBlockSize(),
	padding: Profiles.getPadding(),
	lineWidth: Profiles.getLineWidth(),

	sx: -1,
	sy: -1,
	maxCol: -1,
	maxRow: -1,
	x: -1,
	y: -1,
	width: 0,
	height: 0,
	// Draw function;
	content: {},
	hover: null,

	init: function(scene, eventManager) {
		this.scene = scene;
		this.eventManager = eventManager;
	},

	prepare: function(sx, sy, content) {
		this.sx = sx;
		this.sy = sy;
		this.content = content;
		this.maxCol = Math.min(3, this.content.length);
		this.width = this.maxCol * this.blockSize;
		this.maxRow = Math.ceil(content.length / 3)
		this.height = this.maxRow * this.blockSize;
		this.x = Math.max(sx - this.width / 2, this.padding);
		this.x = (this.x + this.width) > Profiles.getBoardWidth() - this.padding
		? Profiles.getBoardWidth() - this.padding - this.width 
		: this.x
		this.y = sy + 1/2 * this.blockSize + 2 * this.padding;
		if (this.y + this.height > Profiles.getBoardHeight() - this.padding) {
			this.y = sy - 1/2 * this.blockSize - 2 * this.padding - this.height;
		}
	},

	show: function() {
		this.isValid = true;
		this.scene.addElement(this);
		this.eventManager.registerPopup(this);
	},

	complete: function() {
		this.hover = null;
		this.isValid = false;
		this.eventManager.removePopup();
	},

	draw: function(ctx) {
		ctx.strokeStyle = "#808080";
		ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		// bottom
		if (this.y >= this.sy) {		
			// 	_
			ctx.lineTo(Math.max(this.x, this.sx - this.padding / 2), this.y);	
			//	_/	
			ctx.lineTo(Math.max(this.x, this.sx), this.y - this.padding);
			//	_/\		
			ctx.lineTo(Math.min(this.x + this.width, this.sx + this.padding / 2), this.y);	
			//	_/\_
			ctx.lineTo(this.x + this.width, this.y);
			ctx.lineTo(this.x + this.width, this.y + this.height);
			ctx.lineTo(this.x, this.y + this.height);

		// top
		} else {			
			ctx.lineTo(this.x + this.width, this.y);
			ctx.lineTo(this.x + this.width, this.y + this.height);
			// 	-
			ctx.lineTo(Math.min(this.x + this.width, this.sx + this.padding / 2), this.y + this.height);
			//	/-
			ctx.lineTo(Math.max(this.x, this.sx), this.y + this.height + this.padding);
			//	\/-
			ctx.lineTo(Math.max(this.x, this.sx - this.padding / 2), this.y + this.height);
			//	-\/-
			ctx.lineTo(this.x, this.y + this.height);

		}
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		ctx.strokeStyle = "#C0C0C0";
		ctx.beginPath();
		for (var c=0; c<this.maxCol; c++) {
			ctx.moveTo((c+1)*this.blockSize + this.x, this.y);
			ctx.lineTo((c+1)*this.blockSize + this.x, this.y + this.height);
		}
		for (var r=0; r<this.maxRow; r++) {
			ctx.moveTo(this.x, this.y + (r+1)*this.blockSize);
			ctx.lineTo(this.x + this.width, this.y + (r+1)*this.blockSize);
		}
		ctx.closePath();
		ctx.stroke();
		if (this.hover != null) {
			ctx.fillStyle = "rgba(255,255,200,0.3)";
			ctx.fillRect(this.x+this.hover.col*this.blockSize, this.y+this.hover.row*this.blockSize, this.blockSize, this.blockSize);
		}
		
	},
	onHover: function(eventX, eventY) {
		if (this.x <= eventX && this.y <= eventY && this.x+this.width >= eventX && this.y+this.height >= eventY) {
			this.hover = {
				"col": Math.floor((eventX-this.x)/this.blockSize),
				"row": Math.floor((eventY-this.y)/this.blockSize)
			};
		} else  {
			this.hover = null;
		} 
	},
	onClick: function(eventX, eventY) {
		if (this.x <= eventX && this.y <= eventY && this.x+this.width >= eventX && this.y+this.height >= eventY) {

		} else {
			this.complete();
		}
	},

	eventHandler : function(event, x, y) {
		switch(event) {
			case "click": 
				this.onClick(x,y);
				break;
			case "hover": 
				this.onHover(x,y);
				break;
		}
	}


}