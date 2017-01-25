var fModuleMethods = require('../model/FModuleMethods');
var fModule = fModuleMethods();

module.exports = function() {
	var thickness = 0.75;
	
	var board = fModule.moduleFactory({
		material: "wood", 
		name: "board",
		dimensions: { z: 0.75 }, 
		rules: { 
			scale: {
				z: "fixed"
			},
			position: {
				z: "bottom" 
			}
		}
	});

	var shelf = fModule.moduleFactory({
		name      : "shelf",
		parts  : [ board ], 
		dimensions: {z: 10}, 
		rules     : {
			scale: { 
				z: "share" 
			},
			position: { 
				z: "top"
			}
		}
	});

	return shelf;
}