var newCounter = function() {
	var currentNumber = 0;
	return {
		getNextNumber: function() {
				return currentNumber++;
			}
		}
}
var idCounter = newCounter();

var moduleFactory = function(props) {

	moduleId = idCounter.getNextNumber();

	var module = {
		id: moduleId,
		name: null,
		material: null,
		finish: { type: null, color: null },
		position 		: {x: null, y: null, z: null},
		dimensions	: {x: null, y: null, z: null},
		orientation : {x: null, y: null, z: null},
		parent			: null,
		children 		: [],
		rules 			: {
			position  : {
				x : { rule: null, module: null },
				y : { rule: null, module: null },
				z : { rule: null, module: null }
			},
			scale 		: {
				x : { rule: null, module: null },
				y : { rule: null, module: null },
				z : { rule: null, module: null }
			} 
		},
		set: function(update) {
			_.merge(module, update);
		},
		get: function(query) {
			_.get(module, query);
		},

		addChild: function(child) {
			child.set( { parent: this } );
			module.children.push(child);
		},

		scale: function(amount) {
			if(amount.x) { module.dimensions.x = module.dimensions.x * amount.x }
			if(amount.y) { module.dimensions.y = module.dimensions.y * amount.y }
			if(amount.z) { module.dimensions.z = module.dimensions.z * amount.z }
			return module;
		}
	}

	if(props) {
		module.set(props);
	}

	return module;
};





