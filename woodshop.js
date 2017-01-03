var thickness = 0.75;

var shelfFactory = function() {

	var board = moduleFactory({
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

	var shelf = moduleFactory({
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

var bookcaseFactory = function() {
	var back = 				moduleFactory({ 
		name: "back", 
		material: "wood",
		dimensions: { y: 0.25 },
		rules: { 
			scale: { x: "full", y:  "fixed", z: "full" }, 
			position: { y:  "back" }  
		},
	});
	var leftSide = 		moduleFactory({ 
		name: "leftSide", 
		material: "wood",
		dimensions: { x: 0.75 },
		rules: { 
			scale   : { x:  "fixed" }, 
			position: { x:  "left" }  
		},
	});
	var rightSide = 	moduleFactory({ 
		name: "rightSide", 
		material: "wood",
		dimensions: { x: 0.75 },
		rules: { 
			scale   : { x:  "fixed" }, 
			position: { x:  "right" } 
		},
	});
	var top = 				moduleFactory({ 
		name: "top", 
		material: "wood",
		dimensions: { z: 0.75 },
		rules: { 
			scale   : { z:  "fixed" }, 
			position: { z:  "top" }  
		}
		});
	var bottom = 			moduleFactory({ 
		name: "bottom", 
		material: "wood",
		dimensions: { z: 0.75 },
		rules: { 
			scale   : { z:  "fixed" }, 
			position: { z:  "bottom" } 
		}
	});
	var bookcase = 		moduleFactory({
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

var shelves = moduleFactory({
		name: "shelves"
	});

for(var i=0; i<3; i++) {
	var newShelf = shelfFactory();
	newShelf.parent = shelves;
	shelves.children.push(newShelf);
}

var bookcase = bookcaseFactory();
shelves.parent = bookcase;
bookcase.children.push(shelves);

setup(bookcase);
bookcase.scale();
console.log('BOOKCASE: ', bookcase);

$(function() {
	var html = displayModule(bookcase);
	var	final =	'<div id="module-' + bookcase.id + '">' +
						  	'<div class="information">' +
						  		'<div class="children panel panel-default">' +
										html + '</div>' +
						'</div' +
					'</div';
	$(display).append(final);
});
