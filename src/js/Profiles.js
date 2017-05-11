var Profiles = {
	retina: window.devicePiexlRatio || 1,
	map_col_size: 16,
	map_row_size: 16,
	show_monster_life: true,
	line_width: 1,
	block_size: 32,
	popup_block_rate: 1.5,
	padding: 10,
	global_speed_rate: 1.0,
	default_step_time: 40,
	default_fps: 24,
	delta_fps: 0.5,

	getLineWidth: function() {
		return this.retina * this.line_width;
	},

	getBlockSize: function() {
		return this.retina * this.block_size;
	},

	getPadding: function() {
		return this.retina * this.padding;
	},

	getPopupBlockSize: function() {
		return this.retina * this.block_size * this.popup_block_rate;
	},

	getBoardWidth: function() {
		return this.retina * this.block_size * this.map_col_size;
	},

	getBoardHeight: function() {
		return this.retina * this.block_size * this.map_row_size;
	},


}