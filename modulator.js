var newCounter = function() {
	var currentNumber = 0;
	return {
		getNextNumber: function() {
				return currentNumber++;
			}
		}
}
var idCounter = newCounter();

calculateInsideDimensions = function(module) {
	// assuming we already have outside dimensions
	module.insideDimensions = module.insideDimensions || {};
	if(!module.parts) {
		module.insideDimensions = module.dimensions;
		return;
	}

	var x = ['x', 'y', 'z'];
	for(var i=0; i<3; i++) {
		var fixedParts = module.parts.filter(function( part ) {
		  return _.get(part, ('rules.scale.' + x[i]) ) ;
		});

		var fixedDimension = 0;
		fixedParts.forEach(function(part) { 
			fixedDimension += part.dimensions[x[i]]; 
		});

		module.insideDimensions[x[i]] = ( module.dimensions[x[i]] - fixedDimension );
	}
}

sizeChildren = function(module) {
	if(!module.children) return;

	var x = ['x', 'y', 'z'];
	for(var i=0; i<3; i++) {
		var shareChildren = [];
		var fillChildren = [];
		var shareChildren = [];
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
}

var moduleFactory = function(props) {

	moduleId = idCounter.getNextNumber();

	var module = {
		id: moduleId,
		children 		: [],
		set: function(update) {
			_.merge(this, update);
		},
		get: function(query) {
			_.get(this, query);
		},
		scale: function() {
			calculateInsideDimensions(this);
			sizeChildren(this);
			this.children.forEach(function(child) { child.scale(); } );
		}
	}

	if(props) {
		module.set(props);
	}

	return module;
};





