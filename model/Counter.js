module.exports =  function() {
	var currentNumber = 0;
	return {
		getNextNumber: function() {
				return currentNumber++;
			}
		}
}
