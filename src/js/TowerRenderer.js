var TowerRenderer = {

	lineWidth: Profiles.getLineWidth(),

	drawTube: function(ctx, px0, py0, px1, py1, len) {
		var px2, py2, k, delta;
		if (px0 == px1) {
			px2 = px0;
			py2 = (py0 >= py1) ? py0 - len : py0 + len;
		} else if (py0 == py1) {
			px2 = (px0 >= px1) ? px0 - len : px0 + len;
			py2 = py0;
		} else {
			k = (py1 - py0) / (px1 - px0);
			delta = Math.sqrt(len*len/((k*k) + 1));
			delta = (px1 - px0 >= 0) ? delta : -delta
			px2 = px0 + delta;
			py2 = py0 + delta * k;
		}
		ctx.strokeStyle = "#000";
		ctx.beginPath();
		ctx.moveTo(px0, py0);
		ctx.lineTo(px2,py2);
		ctx.closePath();
		ctx.stroke();
	},

	render: function(ctx, tower) {
		this[tower.type](ctx, tower);
	},

	MiniGun: function(ctx, tower) {
		ctx.fillStyle = "#36f";
		ctx.strokeStyle = "#000";
		ctx.beginPath();
		ctx.arc(tower.cx, tower.cy, tower.blockSize/3, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();

		ctx.lineWidth = this.lineWidth * 2;
		this.drawTube(ctx, tower.cx, tower.cy, tower.tube.cx, tower.tube.cy, tower.blockSize/2);
		ctx.lineWidth = this.lineWidth;

		ctx.fillStyle = "#66c";
		ctx.beginPath();
		ctx.arc(tower.cx, tower.cy, tower.blockSize/4, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();

		ctx.fillStyle = "#ccf";
		ctx.beginPath();
		ctx.arc(tower.cx + 1, tower.cy - 1, tower.blockSize/8, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.fill();

	}
}