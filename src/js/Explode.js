function Explode(attrs) {
	this.cx = attrs.cx;
	this.cy = attrs.cy;
	this.size = attrs.size;
	this.duration = Math.round(attrs.duration * Profiles.default_fps);
	this.rgbColor = Utils.hexToRGB(attrs.color);
	this.d = this.duration;
	this.isCompleted = false
}

Explode.prototype = {
	draw: function(ctx) {
		if (this.isCompleted) return;
		ctx.fillStyle = "rgba(" + this.rgbColor.r + "," + this.rgbColor.g 
		+ "," + this.rgbColor.b + "," + (this.d/this.duration) + ")";
		ctx.beginPath();
		ctx.arc(this.cx, this.cy, this.size, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.fill(); 
	},
	step: function() {
		this.isCompleted =  (this.d <= 0);
		if (this.isCompleted) return;
		this.size += 1;
		this.d -= 1;
	}
}