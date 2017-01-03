var displayModule = function (module) {
 	var str = $('#module-display-template').text();
	var compiled = _.template(str);
	var final = compiled( { module: module } );
	// var final = '<div class="part col-md-3"><div class="part panel panel-default">' + compiled( { module: module } ) + "</div></div>";

	if(module.parts.length) {

		final += '<div id="module-'+ module.id + '">' +
						  	'<div class="information">' +
												'<div class="parts panel panel-default">' +
												  '<div class="parts panel-heading">' + module.name + 
												  '\'s Parts:</div> ' +
												   '<div class="panel-body"> ';
		module.parts.map(function(part) {
			final += '<div class="part col-md-3"><div class="part panel panel-default">' + displayModule(part) + "</div></div>";
		});
	final += 								'</div>' +
						  	'</div> <!-- .information -->' +
						  '</div>';
		}

	if(module.children.length) {
		final += '<div id="module-'+ module.id + '">' +
						  	'<div class="information">' +
						  		'<div class="children panel panel-default"> <div class="children panel-heading">' + module.name + '\'s Children:</div> ';
		module.children.map(function(child) {
			final += displayModule(child);
		});
		final += '</div>' +
						'</div' +
					'</div';
	}
	
	return final;
}