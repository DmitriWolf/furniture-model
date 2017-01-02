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
	module.insideDimensions = module.dimensions;
	if(!module.parts) return;

	var fixedParts = module.parts.filter(function(part) {
		return ( _.get(part, "rules.scale", { "rule" : "fixed" } ) );
	});

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
		z : module.dimensions.z - fixedDimensions.y, 
	}
}

sizeParts = function(module) {
	if(!module.parts) return;
	var x = ['x', 'y', 'z'];

	for(var i=0; i<3; i++) {
		var fixedParts = module.parts.filter(function(part) {
			return ( _.get(part, "rules.scale." + x[i] ) == "fixed" );
		});
		var shareParts = module.parts.filter(function(part) {
			return ( _.get(part, "rules.scale." + x[i]) == "share"  );
		});
		var fillParts = module.parts.filter(function(part) {
			return ( !_.get(part, "rules.scale." + x[i] ) || _.get(part, "rules.scale." + x[i]) == "fill" );
		});
		var fullParts = module.parts.filter(function(part) {
			return ( !_.get(part, "rules.scale." + x[i] ) || _.get(part, "rules.scale." + x[i]) == "full" );
		});

		var fixedDimension = fixedParts.reduce(function(prevVal, elem) {
		   return _.get(elem, "dimensions." + x[i] ) ? prevVal + _.get(elem, "dimensions." +x[i]) : prevVal ;
		}, 0);

		var remainingDimension = ( module.parent ? module.parent.insideDimensions[x[i]] : module.dimensions[x[i]] ) - fixedDimension;
		
		fullParts.map(function(part) {
			part.dimensions[x[i]] = module.dimensions[x[i]];
		});
		fillParts.map(function(part) {
			part.dimensions[x[i]] = remainingDimension;
		});

				console.log('------------');
				console.log('module ', module.name, ', dimension ', x[i]);
				console.log('fixedParts: ', fixedParts);
				console.log('shareParts: ', shareParts);
				console.log('fillParts: ', fillParts);
				console.log('fullParts: ', fullParts);



	};
}

sizeChildren = function(module) {
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
}

var moduleFactory = function(props) {

	moduleId = idCounter.getNextNumber();

	var module = {
		id         : moduleId,
		children   : [],
		parts   : [],
		dimensions : {},
		set: function(update) {
			_.merge(this, update);
		},
		get: function(query) {
			_.get(this, query);
		},

		scale: function() {
			calculateInsideDimensions(this);
			sizeParts(this);
			sizeChildren(this);
			this.children.forEach(function(child) { child.scale(); } );
		}
	}

	if(props) {
		module.set(props);
	}

	return module;
};





