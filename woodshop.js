console.log('------------------   WOODSHOP   -------------------');

/*  
	Shelves are made up of a "Board" module, child of a larger empty module, used for spacing.
*/

var thickness = 0.75;

var shelfFactory = function() {

	var board = moduleFactory({
		material  : "wood", 
		name      : "board",
		dimensions: { x: 30, y: 8, z: 80 }, 
		rules     : { 
			scale: {
				z: { rule: "fixed" } 
			},
			position: {
				z: { rule: "bottom" }
			}
		}
	});

	var shelf = moduleFactory({
		name      : "shelf",
		children  : [ board ], 
		dimensions: {z: 10}, 
		rules     : {
			position: { 
				z: { rule: "top" } 
			},
			scale: { 
				z: { rule: "fixed" } 
			} 
		}
	});

	return shelf;
}

var bookcaseFactory = function() {
	var back = 				moduleFactory({ name: "back", material: "wood" });
	var leftSide = 		moduleFactory({ name: "leftSide", material: "wood" });
	var rightSide = 	moduleFactory({ name: "rightSide", material: "wood" });
	var top = 				moduleFactory({ name: "top", material: "wood" });
	var bottom = 			moduleFactory({ name: "bottom", material: "wood" });
	var bookcase = 		moduleFactory({
		name: "bookcase",
		children: [ top, bottom, leftSide, rightSide, back ], 
		dimensions: { x: 30, y: 8, z: 80 }, 
		insideDimensions: { x: 28.5, y: 7.75, z: 76 },
		rules: {
			// position defaults to Center
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
	shelves.addChild( shelfFactory() );
}

var bookcase = bookcaseFactory();
bookcase.addChild( shelves );

console.log('BOOKCASE: ', bookcase);

$(function() {
	var html = displayModule(bookcase);
	$(display).append(html);
});


