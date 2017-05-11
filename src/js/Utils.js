var Utils = {

	generateRndId: function() {
		var d = new Date().getTime();
    	var uuid = 'xxxx-xxxx-xxxx-xxxx'.replace(/[xy]/g, function(c) {
        	var r = (d + Math.random()*16)%16 | 0;
        	d = Math.floor(d/16);
        	return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    	});	
    	return uuid;
	},

	getMousePos: function(canvas, evt) {
    	var rect = canvas.getBoundingClientRect();
    	return {
        	x: evt.clientX - rect.left,
        	y: evt.clientY - rect.top
        };
    },

    colIsValid: function(col) {
        return col >= 0 && col < Profiles.map_col_size;
    },

    rowIsValid: function(row) {
        return row >= 0 && row < Profiles.map_row_size;
    },

    getIndex: function(col, row) {
        if (this.colIsValid(col) && this.rowIsValid(row)) {
            return col * Profiles.map_row_size + row;
        }
        return -1;
    },

    positionIsValid: function(x, y) {
        return (x >= 0 && x <= Profiles.getBoardWidth() 
            && y >= 0 && y <= Profiles.getBoardHeight());
    },
    
    generateRndColor: function() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    },

    hexToRGB: function(hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },

    generatePathNodeId: function(col, row) {
        return col.toString() + ":" + row.toString();
    },

    generateRandomPosition: function() {
        var maxX = Profiles.getBoardWidth();
        var maxY = Profiles.getBoardHeight();
        return {
            "cx": Math.floor(Math.random() * maxX), 
            "cy": Math.floor(Math.random() * maxY)
        };
    }

}