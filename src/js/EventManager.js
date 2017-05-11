function EventManager() {
	this.eventX = -1;
	this.eventY = -1;
	this.registeredElements = {};

	this.currentType = "hover";

	this.col = Profiles.map_col_size;
	this.row = Profiles.map_row_size;
	this.blockSize = Profiles.getBlockSize();

	this.map = null;
	this.popup = null;
}

EventManager.prototype = {

	eventIndex: function() {
		if (this.eventX < 0 || this.eventY < 0) {
			return -1;
		}
		return Utils.getIndex(Math.floor(this.eventX / this.blockSize), Math.floor(this.eventY / this.blockSize));
	},

	eventInRect: function(x,y,w,h) {
		return this.eventX >= x && this.eventX <= x+w && this.eventY >= y && this.eventY <= y+h;
	},

	registerElement: function(element) {
		this.registeredElements[element.index] = element;
	},

	removeElement: function(element) {
		var elements = this.registeredElements[element.index];
		var i;
		for(i=0; i<elements.length; i++) {
			if(element.id == elements[i].id) {
				break;
			}
		}
		this.registeredElements[element.index].splice(i,1);
	},

	registerPopup: function(popup) {
		this.popup = popup;
	},
	removePopup: function() {
		this.popup = null;
	},

	clear: function() {
		delete registeredElements;
		this.registeredElements = {};
	},

	step: function() {
		if (!this.currentType) return;
		if (this.popup != null && this.popup.isValid) {
			this.popup.eventHandler(this.currentType, this.eventX, this.eventY);
			this.currentType = "hover";
		} else {
			var eventIndex = this.eventIndex();
			if (!this.registeredElements.hasOwnProperty(eventIndex)) return;
			if (this.currentType != "click") {
				$.each(this.registeredElements, function(key, element) {
					if (element.isHover && key != eventIndex) {
						element.eventListeners["out"]();
					}
				});
				if (!this.registeredElements[eventIndex].isHover) {
					this.registeredElements[eventIndex].eventListeners["enter"]();
				}
				this.registeredElements[eventIndex].eventListeners[this.currentType]();
			} else {
				$.each(this.registeredElements, function(key, element) {
					if (element.tower != null && element.tower.isSelected && key != eventIndex) {
						element.tower.isSelected = false;
					}
				});
				this.registeredElements[eventIndex].eventListeners[this.currentType]();
				this.currentType = "hover";
			}
		}
	},

	hover: function(x, y) {
		if (this.currentType == "click") {
			return;
		}
		this.eventX = x;
		this.eventY = y;
		this.currentType = "hover";
	},

	click: function(x, y) {
		this.eventX = x;
		this.eventY = y;
		this.currentType = "click";
	},

	towerCreatedHandler: function(tower) {
		if (this.map != null && tower != null) {
			this.map.towers.push(tower);
			this.map.updateMonstersPath();
		}
	},

	bulletCreatedHandler: function(bullet) {
		if (this.map != null && bullet != null) {
			this.map.bullets.push(bullet);
		}
	},

}