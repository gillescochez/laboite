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
    }
}; 
