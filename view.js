var displayModule = function (module) {
 	var str = $('#module-display-template').text();
	var compiled = _.template(str);
	var final = compiled( { module: module } );

	if(module.parts.length) {
		final += '<div class="panel panel-default"> <div class="panel-heading">' + module.name + '\'s Parts:</div> <div class="panel-body"> ';
		module.parts.map(function(part) {
			final += displayModule(part);
		});
		final += '</div></div>';
	}

	if(module.children.length) {
		final += '<div class="panel panel-default"> <div class="panel-heading">' + module.name + '\'s Children:</div> <div class="panel-body"> ';
		module.children.map(function(child) {
			final += displayModule(child);
		});
		final += '</div></div>';
	}

	return final;
}