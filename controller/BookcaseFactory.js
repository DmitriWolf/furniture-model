var fModuleMethods = require('../model/FModuleMethods');
var fModule = fModuleMethods();

module.exports = function() {
	var back = 				fModule.moduleFactory({ 
		name: "back", 
		material: "wood",
		dimensions: { y: 0.25 },
		rules: { 
			scale: { x: "full", y:  "fixed", z: "full" }, 
			position: { y:  "back" }  
		},
	});
	var leftSide = 		fModule.moduleFactory({ 
		name: "leftSide", 
		material: "wood",
		dimensions: { x: 0.75 },
		rules: { 
			scale   : { x:  "fixed" }, 
			position: { x:  "left" }  
		},
	});
	var rightSide = 	fModule.moduleFactory({ 
		name: "rightSide", 
		material: "wood",
		dimensions: { x: 0.75 },
		rules: { 
			scale   : { x:  "fixed" }, 
			position: { x:  "right" } 
		},
	});
	var top = 				fModule.moduleFactory({ 
		name: "top", 
		material: "wood",
		dimensions: { z: 0.75 },
		rules: { 
			scale   : { z:  "fixed" }, 
			position: { z:  "top" }  
		}
		});
	var bottom = 			fModule.moduleFactory({ 
		name: "bottom", 
		material: "wood",
		dimensions: { z: 0.75 },
		rules: { 
			scale   : { z:  "fixed" }, 
			position: { z:  "bottom" } 
		}
	});
	var bookcase = 		fModule.moduleFactory({
		name: "bookcase",
		parts: [ top, bottom, leftSide, rightSide, back ], 
		dimensions      : { x: 30, y: 8, z: 80 }, 
		rules: {
			scale: { 
				x: { rule: "fixed" },
			  y: { rule: "fixed" },
				z: { rule: "fixed" } 
			} 
		}
	});

	return bookcase;
}
