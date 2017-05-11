var MonsterDatabase = {

	"NULL": {

	},

	"M-1": {
		// real_size = size * block_size
		size: 1/6,
		damage: 1,
		speed: 1,
		life: 100,
		money: 5
	},

	"M-2": {
		size: 1/6,
		damage: 2,
		speed: 2,
		life: 60,
		money: 100
	},

	"wave_0": {
		monsters: [
			"M-1","M-1","M-1","M-1","M-1","M-1","M-1","M-1","M-1","M-1"
		],
		delay: 1 * Profiles.default_fps
	},

	"wave_1": { 
		monsters: [	
			"M-","M-2","M-1","M-2","M-1","M-2","M-1","M-2","M-1","M-1"
		],
		delay: 1 * Profiles.default_fps
	},

	getMonsterAttributes: function(type) {
		if (this.hasOwnProperty(type)) {
			return this[type];
		}
		return this["NULL"];
	},

	getMonstersInfo: function(wave) {
		var w = "wave_" + wave.toString();
		var info = {};
		if (this.hasOwnProperty(w)) {
			$.extend(true, info, this[w]);
		}
		return info;
	}


}