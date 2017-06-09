var _ = require('lodash');
var counter = require('./Counter');
var idCounter = counter();

module.exports = function() {
	var fModuleMethods = {

		calculateInsideDimensions: function(module) {
			module.insideDimensions = module.dimensions;
			if(!module.parts) return;

			var fixedParts = module.parts.filter(function(part) {
				return ( _.get(part, "rules.scale", { "rule" : "fixed" } ) );
			});

			// fixedParts.map(function(part) {
			  // random edit
			// })

			var fixedDimensions = {};

			var x = ['x', 'y', 'z'];

			for(var i=0; i<3; i++) {
				fixedDimensions[x[i]] = fixedParts.reduce(function(prevVal, elem) {
				   return _.get(elem, "dimensions." + x[i] ) ? prevVal + _.get(elem, "dimensions." +x[i]) : prevVal ;
				}, 0);
			};

			module.insideDimensions = {
				x : module.dimensions.x - fixedDimensions.x, 
				y : module.dimensions.y - fixedDimensions.y, 
				z : module.dimensions.z - fixedDimensions.z, 
			}
		},


		/*  
			This is going to take some though.

			There may be fixed parts on one or both sides of each dimension
				x: left / right
				y: back / front
				z: top  / bottom

			We need to subtract the dimension of each of these and move the remainder in the right direction, by the right amount.

			This may be different for parts than children.
			Parts
				Parts are relative to the Outside Dimensions of their parent.
				Parts ! form ! the inside dimension (and position) of their parent.

			Children
				Children are relative to the Inside Dimension of their parent.

			Either way, we must iterate through them and give the remainder both dimension *and* position as we go.
			Only then can we place everything properly.

			As we iterate through the parts / children:
				Find the fixed parts and give them their position.
				Keep track of the remaining space and treat it as a volume with a dimension and a position.

			After iterating through, we can size and place the fill / share parts remaining.

			*/



		calculateInsideArea: function(module) {
			/* 
				"Inside AREA" includes inside dimensions and the POSITION of the center of those dimensions.
				This is complicated.
				We are keeping track of the inside dimension of a module (for example a cabinet box)
				 so that we can insert a set of drawers or shelves inside that box. 

				To do this, we 
				  - copy the outside dimensions of the module (inside dimensions = { x: dimensions.x, y: ... })
				
				Then we start to subtract the parts of the module (For a cabinet: the back, sides, bottom, and top)
				We want to find which parts have a thickness (fixed dimension) to subtract from the volume,
				then we find out their position (which side).

				Once we have the necessary information, we 
				  - subtract their thickness from the inside dimension, 
				  - move the center of the inside dimension *away* from the part.

				METHOD
				First we 
					- find the parts with one or more fixed dimensions, in any axis (x, y, z),
				Once we have those, 
					- iterate through each dimension (x, y, z)
					- locate the parts with a fixed dimension in THAT axis (x, y, or z)
					- Iterate through each part and (as outlined above):
					  - subtract their thickness from the inside dimension, 
					  - move the center of the inside dimension *away* from the part.

				After doing all that, we will have an accurate Inside Dimension with dimensions(xyz) and position(xyz)

			*/

			console.log('calculateInsideArea for module "'+ module.name + '"');

			var insideDimensions = module.dimensions;
			var insidePosition	 = module.position;

			if(!module.parts) return;

			var partsWithFixedDimensions = fixedParts(bookcase);
			console.log('partsWithFixedDimensions: ', partsWithFixedDimensions);

			var x = ['x', 'y', 'z'];

			for(var i=0; i<3; i++) {
				partsWithFixedDimensions[x[i]].forEach(function(part) {

					if( part.rules.scale[x[i]] == "fixed" ) { 
						console.log(' we have a fixed part in dimension ', x[i], ': ', part);

					var rule = _.get(part, "rules.position." + x[i]);

					switch (rule) {
					  case "front":
					    if(x[i] == "y") {
					    	// now remove the thickness from the dimension and move the center back by half the thickness.
					    	insideDimensions.y += part.dimensions.y;
					    	insidePosition.y += part.dimensions.y / 2;
					    }
					    break;
					  case "back":
					    if(x[i] == "y") {
					    	insideDimensions.y -= part.dimensions.y;
					    	insidePosition.y -= part.dimensions.y / 2;
					    }
					    break;
					  case "left":
					    if(x[i] == "x") {
					    	insideDimensions.x += part.dimensions.x;
					    	insidePosition.x += part.dimensions.x / 2;
					    }
					    break;
					  case "right":
					    if(x[i] == "x") {
					    	insideDimensions.x -= part.dimensions.x;
					    	insidePosition.x -= part.dimensions.x / 2;
					    }
					    break;
					  case "top":
					    if(x[i] == "z") {
					    	insideDimensions.z -= part.dimensions.z;
					    	insidePosition.z -= part.dimensions.z / 2;
					    }
					    break;
					  case "bottom":
					    if(x[i] == "z") {
					    	insideDimensions.z -= part.dimensions.z;
					    	insidePosition.z -= part.dimensions.z / 2;
					    }
					    break;
					  default:
					  console.error('default ', part.name);
					    break;
					  }


					}
				});
			} // end loop x, y, z, shrinking inside dimension and moving its position

			module.insideArea = {
				insideDimensions : module.dimensions,
				insidePosition	 : module.position
			}

			console.log('module.insideArea: ', module.insideArea);

			// done 
		},

		fixedParts: function(module) {
			var x = ['x', 'y', 'z'];
			var parts = { x: [], y: [], z: [] };
			for(var i=0; i<3; i++) {
				parts[x[i]] = module.parts.filter(function(part) {
					return ( _.get(part, "rules.scale." + x[i] ) == "fixed" );
				});
			}
			module.fixedParts = parts;
			return parts;
		},

		fixedDimensions: function(module) {
			var fixedParts = module.fixedParts || fixedParts(module);
			var dimensions = { x: 0, y: 0, z: 0 };
			for(var i=0; i<3; i++) {
				dimensions[x[i]] = fixedParts.reduce(function(prevVal, elem) {
				   return _.get(elem, "dimensions." + x[i] ) ? prevVal + _.get(elem, "dimensions." +x[i]) : prevVal ;
				}, 0);
			}
			console.log('fixed dimensions for part ', module.name, ' are x: ', dimensions.x, ', y: ', dimensions.y, ', z: ', dimensions.z);

			return dimensions;
		},

		sizeParts: function(module) {
			if(!module.parts) return;
			var x = ['x', 'y', 'z'];

			for(var i=0; i<3; i++) {
				var fixedPartNames = '';

				var fixedParts = module.parts.filter(function(part) {
					return ( _.get(part, "rules.scale." + x[i] ) == "fixed" );
				});
				var fillParts = module.parts.filter(function(part) {
					return ( !_.get(part, "rules.scale." + x[i] ) || _.get(part, "rules.scale." + x[i]) == "fill" );
				});
				var fullParts = module.parts.filter(function(part) {
					return ( !_.get(part, "rules.scale." + x[i] ) || _.get(part, "rules.scale." + x[i]) == "full" );
				});

				var fixedDimension = fixedParts.reduce(function(prevVal, elem) {
					fixedPartNames += _.get(elem, "name");

				   return _.get(elem, "dimensions." + x[i] ) ? prevVal + _.get(elem, "dimensions." +x[i]) : prevVal ;
				}, 0);

				// console.log('fixed info - ', fixedPartNames, ', ', x[i], ': ', fixedParts, ', fixedDimension: ', fixedDimension);

				var remainingDimension = ( module.parent ? module.parent.insideDimensions[x[i]] : module.dimensions[x[i]] ) - fixedDimension;
				
				fullParts.map(function(part) {
					part.dimensions[x[i]] = module.dimensions[x[i]];
				});
				fillParts.map(function(part) {
					part.dimensions[x[i]] = remainingDimension;
				});
			};
		},

		positionModule: function(module) {
			if(!module) return;
			if(!module.parent) {
				module.position = { x: 0, y: 0, z: 0 };
				return;
			}
			
			module.position = module.position || {};

			/*  
			This is going to take some though.

			There may be fixed parts on one or both sides of each dimension
				x: left / right
				y: back / front
				z: top  / bottom

			We need to subtract the dimension of each of these and move the remainder in the right direction, by the right amount.

			This may be different for parts than children.
			Parts
				Parts are relative to the Outside Dimensions of their parent.
				Parts ! form ! the inside dimension (and position) of their parent.

			Children
				Children are relative to the Inside Dimension of their parent.

			Either way, we must iterate through them and give the remainder both dimension *and* position as we go.
			Only then can we place everything properly.

			As we iterate through the parts / children:
				Find the fixed parts and give them their position.
				Keep track of the remaining space and treat it as a volume with a dimension and a position.

			After iterating through, we can size and place the fill / share parts remaining.

			*/

			var x = ['x', 'y', 'z'];
			for(var i=0; i<3; i++) {
					var rule = _.get(module, "rules.position." + x[i]);

					switch (rule) {
					  case "front":
					    if(x[i] == "y") {
					    	var frontOfParent = module.parent.position.y - module.parent.dimensions.y / 2;
					    	module.position.y = frontOfParent + module.dimensions.y / 2;
					    }
					  // console.log('front ', module);
					    break;
					  case "back":
					    if(x[i] == "y") {
					    	var backOfParent = module.parent.position.y + module.parent.dimensions.y / 2;
					    	module.position.y = backOfParent - module.dimensions.y / 2;
					    }
					  // console.log('back ', module);
					    break;
					  case "left":
					    if(x[i] == "x") {
					    	var leftOfParent = module.parent.position.x - module.parent.dimensions.x / 2;
					    	module.position.x = leftOfParent + module.dimensions.x / 2;
					    }
					  // console.log('left ', module);
					    break;
					  case "right":
					    if(x[i] == "x") {
					    	var rightOfParent = module.parent.position.x + module.parent.dimensions.x / 2;
					    	module.position.x = rightOfParent - module.dimensions.x / 2;
					    }
					  // console.log('right ', module);
					    break;
					  case "top":
					    if(x[i] == "z") {
					    	var topOfParent = module.parent.position.z - module.parent.dimensions.z / 2;
					    	module.position.z = topOfParent - module.dimensions.z / 2;
					    }
					  // console.log('top ', module);
					    break;
					  case "bottom":
					    if(x[i] == "z") {
					    	var bottomOfParent = module.parent.position.z + module.parent.dimensions.z / 2;
					    	module.position.z = bottomOfParent + module.dimensions.z / 2;
					    }
					  // console.log('bottom ', module);
					    break;
					  default:
					  	module.fixedParts = module.fillParts || this.fixedParts(module);

					  	module.position[x[i]] = module.parent.position[x[i]];
					  // console.log('default ', module);
					    break;
					  }

			}
		},

		sizeChildren: function(module) {
			if(!module.children) return;

			var x = ['x', 'y', 'z'];
			for(var i=0; i<3; i++) {
				var shareChildren = [];
				var fillChildren = [];
				var fixedDimension = 0;
				module.children.forEach(function(child) {
					if( _.get(child, ('rules.scale.' + x[i]) ) == "fixed" ) {
						fixedDimension += child.dimensions[x[i]];
					} else if( _.get(child, ('rules.scale.' + x[i]) ) == "share" ) {
						shareChildren.push(child);
					} else {
						fillChildren.push(child);
					}
				});

				var remainingDimension = ( module.parent ? module.parent.insideDimensions[x[i]] : module.insideDimensions[x[i]] ) - fixedDimension;

				fillChildren.forEach(function(child) {
					child.dimensions = child.dimensions || {};
					child.dimensions[x[i]] = remainingDimension;
				})
				shareChildren.forEach(function(child) {
					child.dimensions = child.dimensions || {};
					child.dimensions[x[i]] = remainingDimension / shareChildren.length;
				});
			}
		},

		setup: function(module) {
			module.parts.map(function(part) { 
				part.parent = module; 
			});
			module.children.map((child) => { 
				child.parent = module;
				this.setup(child);
			});
		},

		scale: function(module) {
			this.calculateInsideDimensions(module);
			this.sizeParts(module);
			this.positionModule(module);
			module.parts.map((part) => { 
				this.positionModule(part); 
			} );
			this.sizeChildren(module);
			module.children.map((child) => { this.scale(child); } );
		},

		moduleFactory: function(props) {

			moduleId = idCounter.getNextNumber();

			var module = {
				id         : moduleId,
				name			 : "untitled",
				children   : [],
				parts   : [],
				dimensions : {},
				set: function(update) {
					_.merge(this, update);
				},
				get: function(query) {
					_.get(this, query);
				}
			}

			if(props) {
				module.set(props);
			}

			return module;
		}
	}
	return fModuleMethods;
}
