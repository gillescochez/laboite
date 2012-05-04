// plugin default settings
$.laboite.defaults = {

    // language setting
    lang: 'en', // set which language to use
    
    // debugging tools
    log: false, // if enabled all method called made using the call method will be logged into the console
    debug: false, // enable | disable error reporting (using console.error() if available otherwise default to alert())
    
    // data options
    data: false, // can be used to pass the data to use when calling the plugin
    dataURL: false, // can be used to pass a URL which can be request via ajax to get the data for the plugin
    jsonp: false, // set wether the ajax call for data should be json or jsonp (cross domain querying)
    
    // layout
    layout: 'modal', // modal | inline (can be extended via $.fn.laboite.layouts to use custom ones)
    
    // Options related to the injected UI
    inject: false, // if true the UI will be inserted into the injectTarget selector 
    injectType: 'append', // append | prepend | replace (where the injection should take place, if replace is set then the all content of the element is replaced with the UI
    injectTarget: '', // selector used to grab the element in which to inject the UI (all jQuery selectors are supported)
    
    // options related to modal UI
    modalAtCenter: true, // enable | disable the modal box being place in the center of the viewport
    modalKeepAtCenter: true, // if enable will keep the modal centered in the viewport (scrolling won't affect its position)
    modalTarget: null, // can take a selector string pointing to a single element or an element to which the modal box will appear on
    modalOffsetTop: 0, // modal box top offset
    modalOffsetLeft: 0, // modal box left offset
    
    // resize to content animation settings
    resize: true, // enable/disable resizing of the container
    resizeDuration: 350, // the duration of the animation
    resizeEasing: 'linear', // easing to use
    
    // slideshow options
    slideshow: false, // enable | disable slideshow functionality
    slideshowDelay:3500, // delay between transition
    
    // element embedding option
    elementClone: false, // set to true to clone the targetted element
    
    // iFramme options
    iFrameWidth: 640,
    iFrameHeight: 480,
    
    // Flash option
    flashWidth:640,
    flashHeight:480,
    flashVersion: '9.0.0',
    SWFObject: 'https://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js',
    
    // container dimension limits
    maxWidth: null,
    maxheight: null,
    minWidth: null,
    minheight: null,
    
    // dimmer options (for modal effect)
    dimmer: true, // enable | disable the usage of a dimmer element for modal display
    dimmerOpacity: 0.5, // amount of opacity of the dimmer element
    dimmerBindToClose: true, // enable | disable binding of the dimmer element so clicking it close the UI
    dimmerFadeDuration: 250, // duration in miliseconds of the duration of the fading effect (0 = no fade effect)
    dimmerMatchBackground: false, // enable | disable detecting and using the background of the body as dimmer styling
    
    // misc
    effect: 'fade', // effect to be used for transition (see effects object)
    defaultIndex: 0, // index of the default that will be show by the interface
    continuous: false, // enable | disable contiuous browsing
    callbacks: {}, // hold callbacks if there is any
    autorun: true, // enable/disable auto run (this need to be overwritten prior dom ready for it to be applied)
    onEvent: 'click', // string used by the live binding function (see api.jquery.com for event types supported by live())
    loadAsImage: false, // can be use to tell the plugin to threat all requests as images requests
    transitionDuration: 1000, // duration in milliseconds used by the animation transitioning IN and OUT item (full cycle without loading time = transitionDuration * 2)
    
    // hold various CSS strings used in the generated markup (fully customizable)
    // This is for advanced user and to simplify part of the plugin as well as making it more flexible
    // NOTE: IF CLASSES THAT ARE BINDED TO AN ACTION ARE CHANGED THE BINDING MUST BE DONE MANUALLY!
    css: {

        // common prefix
        prefix: 'laboite-', // prefix added to all CSS classes
        
        // buttons
        play: 'play', // play button CSS class
        pause: 'pause', // pause button CSS class
        stop: 'stop', // stop button CSS class
        previous: 'previous', // next button CSS class
        next: 'next', // next button CSS class

        // the following are used by autorun to detect interface need and items
        autorun: 'autorun', // autorun CSS class (check it is still used)
        items: 'items', // item list wrapper element class
        item: 'item', // item element class
        itemWrap: 'item-wrap', // item wrapper class (added on each items)

        // those are status classes that are added to the main wrapper depending on various status
        slideshowDisabled: 'slideshowDisabled',
        slideshowOn: 'slideshowOn',
        slideshowOff: 'slideshowOff',
        itemLoading: 'itemLoading',
        itemLoaded: 'itemLoaded',

        // misc
        dimmer: 'dimmer'
    },
    
    // attributes to be used to pull item options and data out of a DOM element
    attributes: {
        title: 'title',
        source: 'href',
        maxWidth: 'data-laboite-maxWidth',
        maxHeight: 'data-laboite-maxHeight',
        minWidth: 'data-laboite-minWidth',
        minHeight: 'data-laboite-minHeight',
        link: 'data-laboite-link',
        linkTarget: 'data-laboite-linkTarget',
        description: 'data-laboite-description'
    }
};
