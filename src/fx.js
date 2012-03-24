// object containing the transitional effect for the plugin
$.laboite.fx = {

	// used to do the basic hide/show when the effect option is not declared or disabled
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
	
	// go left and back transition
	clip: {
	
		// initial CSS rules to set on the element before any transition occurs (so effects are not dependent on external CSS)
		css: {
			position:'relative'
		},
		
		// hidden end state
		hide: { 
			css: {
				height: function(index, value) {
					console.log(this);
					this.style.height = value + 'px';
					return '0%';
				},
				top:'50%'
			},
			config: {duration:1000}
		},
		
		// show end state
		show: { 
			css: {
				height:'100%',
				top:'0%'
			},
			config: {duration:1000}
		}
	},
	
	// go left and back transition
	drop: {
	
		// initial CSS rules to set on the element before any transition occurs (so effects are not dependent on external CSS)
		css: {
			position:'relative'
		},
		
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
			css: {
				bottom:'0%',
				opacity:1
			},
			config: {duration:1000}
		}
	},
	
	// go left and back transition
	left: {
	
		// initial CSS rules to set on the element before any transition occurs (so effects are not dependent on external CSS)
		css: {
			position:'relative'
		},
		
		// hidden end state
		hide: { 
			css: {left:'-120%'},
			config: {duration:1000}
		},
		
		// show end state
		show: { 
			css: {left:'0%'},
			config: {duration:1000}
		}
	},
	
	// go left and back transition
	right: {
	
		// initial CSS rules to set on the element before any transition occurs (so effects are not dependent on external CSS)
		css: {
			position:'relative'
		},
		
		// hidden end state
		hide: { 
			css: {right:'-120%'},
			config: {duration:1000}
		},
		
		// show end state
		show: { 
			css: {right:'0%'},
			config: {duration:1000}
		}
	},
	
	// go left and back transition
	down: {
	
		// initial CSS rules to set on the element before any transition occurs (so effects are not dependent on external CSS)
		css: {
			position:'relative'
		},
		
		// hidden end state
		hide: { 
			css: {bottom:'-120%'},
			config: {duration:1000}
		},
		
		// show end state
		show: { 
			css: {bottom:'0%'},
			config: {duration:1000}
		}
	},
	
	// go left and back transition
	up: {
	
		// initial CSS rules to set on the element before any transition occurs (so effects are not dependent on external CSS)
		css: {
			position:'relative'
		},
		
		// hidden end state
		hide: { 
			css: {top:'-120%'},
			config: {duration:1000}
		},
		
		// show end state
		show: { 
			css: {top:'0%'},
			config: {duration:1000}
		}
	}
}; 