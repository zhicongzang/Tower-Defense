function Scene(canvas) {
	this.id = "sc-" + Utils.generateRndId();
	/*
		0: waiting
		1: running
		2: paused
		3: end
	 */
	this.state = 0;
	this.completedHandlers = [];
	this.elements = [
		[],		// 0 background
		[],		// 1 buildings
		[],		// 2 monsters
		[],		// 3 bullets
		[],		// 4 sky
		[]		// 5 special
	];
	this.canvas = canvas;
}

Scene.prototype = {
	start: function() {
		this.state = 1;
	},
	pause: function() {
		this.state = 2;
	},
	end: function() {
		this.state = 3;
		this.completedHandlers.forEach(function(f) {
			f();
		});
		this.completedHandlers = [];
	},
	clear: function() {
		this.elements.forEach(function(e) {
			e.del();
		});
	},
	completed: function(f) {
		this.completedHandlers.push(f)
	},
	step: function() {
		if(this.state != 1) return;
		var ctx = this.canvas.getContext("2d");
		ctx.clearRect(0, 0, this.canvas.width, canvas.height);
		var i;
		for(i=0; i<this.elements.length; i++) {
			this.elements[i] = this.elements[i].filter(e => e.isValid);
			this.elements[i].forEach(function(e) {
				e.draw(ctx);
			})
		}
	},
	addElement: function(element) {
		this.elements[element.sceneLevel].push(element);
	}


}