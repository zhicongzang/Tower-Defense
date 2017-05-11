var WeaponDatabase = {


	"wall": {
		damage: 0,
		range: 0,
		aimSpeed: 0,
		delay: 0,
		bulletColor: "#000",
		bulletSpeed: 0,
		bulletSize: 0,
		life: 100,
		cost: 5
	},

	"MiniGun": {
		damage: 2,
		range: 3,
		aimSpeed: Math.PI / 12,
		delay: 1/3,
		bulletColor: "#000",
		bulletSpeed: 10,
		bulletSize: 1/24,
		life: 100,
		cost: 100,
		upgrade: {
			damage: 0.5,
			range: 0.2,
			delay: 0.9
		}
	},

	getWeaponAttributes: function(type) {
		var attrs = {};
		if (this.hasOwnProperty(type)) {
			$.extend(true, attrs, this[type]);
		}
		return attrs;
	}
}