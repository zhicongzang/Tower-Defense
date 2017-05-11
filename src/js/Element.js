function Element(cfg) {
	this.id = Utils.generateRndId();
	this.isValid = true;
	this.isVisiable = cfg.visiable != null ? cfg.visiable : true;
	this.isPaused = false;
	this.isHover = false;
	this.col = cfg.col != null ? cfg.col : -1;
	this.row = cfg.row != null ? cfg.row : -1;
	this.index = Utils.getIndex(this.col, this.row);
	this.sceneLevel = -1;
	var _this = this;
	this.eventListeners = {
		"enter": function() {
			_this.onEnter()
		},
		"out": function() {
			_this.onOut()
		},
		"click": function() {
			_this.onClick()
		},
		"hover": function() {
			_this.onHover()
		}
	};
}

Element.prototype = {

	blockSize: Profiles.getBlockSize(),

	draw: function(ctx) {

	},
	onEnter: function() {
		this.isHover = true;
	},
	onOut: function() {
		this.isHover = false;
	},
	onHover: function() {
		console.log("Hover: " + this.id);
	},
	onClick: function() {
		console.log("Click: " + this.id);
	},
	step: function() {

	},
	start: function() {
		this.isPaused = false;
	},

	pause: function() {
		this.isPaused = true;
	},

	hide: function() {
		this.isVisiable = false;
		this.onOut();
	},

	show: function() {
		this.isVisiable = true;
	},

	del: function() {
		this.isValid = false;
	}



}