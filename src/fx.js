// object containing the transitional effect for the plugin
$.laboite.fx = {
	
	// id
	fade: {
		
		// initial state
		init: {
			css: {
				opacity:1
			}
		},
		
		// hidden end state
		hide: { 
			css: {
				opacity:0
			},
			config: {
				duration:500
			}
		},
		
		// show end state
		show: { 
			css: {
				opacity:1
			},
			config: {
				duration:500
			}
		}
	},
	foo: {
		init: {
		
		},
		hide: {
			css: {
				
			},
			config: {
				duration:1000
			}
		},
		show: {
			css: {
				
			},
			config: {
				duration:1000
			}
		}
	}
}; 