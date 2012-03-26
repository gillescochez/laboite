// object containing the transitional effect for laboite
$.laboite.effects = {

	// required by laboite to handle basic show/hide transition
	none: {
		hide: {
			css: {display:'none'},
			config: {duration:0}
		},
		show: {
			css: {display:''},
			config: {duration:0}
		}
	},
	
	// Fading transition
	fade: {
		
		// hidden end state
		hide: { 
			css: {opacity:0},
			config: {duration:1000}
		},
		
		// show end state
		show: { 
			css: {opacity:1},
			config: {duration:1000}
		}
	},
	
	// Drop effect (to illustrate usage of the init object)
	drop: {
	
		// hidden end state
		hide: { 
			css: {
				bottom:'-120%',
				opacity:0
			},
			config: {duration:1000}
		},
		
		// show end state
		show: { 
			init: { // applied to the element before the animation starts
				bottom:'120%'
			},
			css: {
				bottom:'0%',
				opacity:1
			},
			config: {duration:1000}
		}
	}
}; 