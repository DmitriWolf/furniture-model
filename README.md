# furniture-model
A flexible model for furniture specifications. 

var calculateInsideArea = function(module) {
	/* 
		"Inside AREA" includes inside dimensions and the POSITION of the center of those dimensions.
		This is complicated.
		We are keeping track of the inside dimension of a module (for example a cabinet box)
		 so that we can insert a set of drawers or shelves inside that box. 

		To do this, we 
		  - copy the outside dimensions of the module (inside dimensions = { x: dimensions.x, y: dimensions, ... })
		
		Then we start to subtract the parts of the module (For a cabinet: the back, sides, bottom, and top)
		We want to find which parts have a thickness (fixed dimension) to subtract from the volume,
		then we find out their position (which side they are on) so we know which way to move the center of the remaining volume.

		Once we have the necessary information, we 
		  - subtract their thickness from the inside dimension, 
		  - move the center of the inside dimension *away* from the part.

		METHOD
		First we 
			- find the parts with one or more fixed dimensions, in any axis (x, y, z),
		Once we have those, 
			- iterate through each dimension (x, y, z)
			- locate the parts with a fixed dimension in THAT axis (x, y, or z)
			- Iterate through each part and (as outlined above):
			  - subtract their thickness from the inside dimension, 
			  - move the center of the inside dimension *away* from the part.

		After doing all that, we will have an accurate Inside Dimension with dimensions(xyz) and position(xyz)

	*/


	Notes on Positon

	All positions are relative the the CENTER of a rectangular volume.

	Question: Positions are absolute or relative to their parent?
	(we should always be keeping track of both anyway.

