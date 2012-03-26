// jQuery plugin declaration
$.fn.laboite = function() {

	// is the laboite "class" already declared for the element
	if (!$(this).data('laboite')) {
	
		// if not we declare it
		$(this).data('laboite', new $.laboite(this));
		
		// we can then run the initialization function
		$(this).data('laboite')['init'].apply(null, arguments);
	
	// if the class is already started we look to handle method calls
	} else {
	
		// make sure we have some arguments
		if (arguments.length) {
		
			// make sure our first argument is a string
			if (arguments[0].constructor == String) {
				
				// make sure it is a valid method
				if ($.isFunction($(this).data('laboite')[arguments[0]])) {
				
					// handle methods direct method calls as well as via cal method (that line handle both cases)
					var res = $(this).data('laboite')[arguments[0]].apply(null, Array.prototype.slice.call(arguments, 1));
				};
			};
		};
	};
	
	// return the value of a method call (if any) or conserve chainability
	return res || this;
};