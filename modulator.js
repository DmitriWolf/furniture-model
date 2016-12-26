console.log('MOD 5 - get & set');

var id = function() {
	var newId = 0;
	return {
		getNewId: function() {
				return newId++;
			}
		}
}
var idCounter = id();

var moduleFactory = function(props) {

	moduleId = idCounter.getNewId();

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
		},

		logChildren: function() {
			module.children.forEach(function(element) {
			  console.log(element.getInfo());
			});
		},
		logInfo: function() {
			console.log( this.getInfo() );
		},
		logDimensions: function() {
			console.log( this.dimensions() );
		}
	}

	if(props) {
		module.set(props);
	}

	return module;
};





