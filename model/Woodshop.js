var fModuleMethods = require('../model/FModuleMethods.js');
var counter = require('../model/Counter');
var bookcaseFactory = require('../controller/BookcaseFactory.js');
var shelfFactory = require('../controller/ShelfFactory.js');

var fModule = fModuleMethods();

module.exports = function() {

	var shelves = fModule.moduleFactory({
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

	fModule.setup(bookcase);
	fModule.scale(bookcase);

	return bookcase;	
}