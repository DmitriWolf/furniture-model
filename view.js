var displayModule = function (module) {
 	var str = $('#module-display-template').text();
	var compiled = _.template(str);
	var final = compiled( { module: module } );

	if(module.parts.length) {
		final += '<div class="panel panel-default"> <div class="panel-heading">' + module.name + '\'s Parts:</div> <div class="panel-body"> ';
		module.parts.map(function(part) {
			final += '<div class="col-md-3">' + displayModule(part) + "</div>";
		});
		final += '</div></div>';
	}

	if(module.children.length) {
		final += '<div class="panel panel-default"> <div class="panel-heading">' + module.name + '\'s Children:</div> <div class="panel-body"> ';
		module.children.map(function(child) {
			final += '<div class="col-md-12">' + displayModule(child) + "</div>";
		});
		final += '</div></div>';
	}

	return final;
}