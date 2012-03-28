/*! github.com/gillescochez/laboite */

;(function($) {

// caching few global elements
var $win = $(window),
	$doc = $(document);

// plugin declaration
$.laboite = function(root) {
	
	// instance self reference and variables
	var laboite = this,
		options, layouts, effects, languages, 
		cache = [], 
		loaded = [], 
		indom = false, 
		layout = null, 
		animate = false,
		currentIndex, data;
	
	// extend
	$.extend(laboite, {

		// plugin name
		name: 'laboite',
		
		// version number
		version: '2.0',
		
		// initialize functions
		init: function(customOptions, customLayouts, customEffects, customLanguages) {
		
			// sort instance options
			options = $.extend({}, $.laboite.defaults, customOptions);
			
			// sort instance layouts
			layouts = $.extend({}, $.laboite.layouts, customLayouts);
			
			// sort instance languages
			effects = $.extend({}, $.laboite.effects, customEffects);
			
			// sort instance languages
			languages = $.extend({}, $.laboite.languages, customLanguages);
			
			// keep track of the index for the current displayed element
			currentIndex = options.defaultIndex;
			
			// first before anything we need to get some data
			if (!options.data) laboite.call('getData');
			else laboite.call('run');
		},
		
		// run!
		run: function() {

			// run only if we have data of course
			if (options.data) {
			
				// reset the items count
				laboite.call('resetCount');
				
				// build the UI
				laboite.call('buildUI');
				
				if (laboite.inject && laboite.injectType == 'replace') laboite.call('goToId', animate);					
				else {
				
					// bind our element
					root.live(options.onEvent, function(ev) {
					
						// prevent default behaviour
						ev.preventDefault();
						
						// trigger opening (or showing if we inject the UI into the page itself)
						if (options.inject) laboite.call('goToId', $(this).index());
						else laboite.call('open', this);
					});
				};
			};
		},
		
		// build the user interface
		buildUI: function() {
		
			// grab the layout template
			layout = laboite.call('getLayout', options.layout);
			
			//extract plugin specific element and cache them (easier to access later and we are already in the layout context)
			$('[class^="' + options.css.prefix + '"]', layout).each(function(k) {
				
				// grab all the classes, split them and store the count
				var classes = this.className,
					bits = classes.split(' '),
					nb = classes.length - 1;
				
				// make sure we at least have one class before we continue
				if (nb) {
				
					// loop through the different classes
					for (var i = 0; i < nb; i++) {
					
						// make sure it is a aboite sepecific classes 
						if (bits[i] && bits[i].indexOf(options.css.prefix) !== -1) {
							
							// we build an internal identifier for our element by removing the prefix part (faster access and few lines down it would be clearer why)
							var id = bits[i].replace(options.css.prefix, '');
							
							// cache our element (we strip out the prefix for easier access
							cache[id] = $(this);

							// now let's see if there is a function that can be bind to that element
							// the plugin is build so that the defaults CSS name matches (tiny footprint)
							if ($.isFunction(laboite[id])) {
							
								// bind the element
								cache[id].click(function(ev) {
								
									// prevent default behaviour
									ev.preventDefault();
									
									// do the method call
									laboite.call(id);
								});
							};
						};
					};
				};
			});
			
			// if the slideshow is off we hide useless button
			if (!options.slideshow) {
			
				// loop through slideshow only action and hide them away
				$.each(['play', 'pause', 'stop'], function(k, v) {
					cache[v] && cache[v].hide();
				});
				
				// we add a class for the disabled state for more styling flexibility
				layout.addClass(options.css.prefix+options.css.slideshowDisabled);
			};
			
			// do we need to inject then UI into the page?
			if (options.inject) {
			
				// grab the target to be injected
				var $target = $(options.injectTarget);
				
				// inject the UI based on the configuration settings
				if ('append' == options.injectType || 'prepend' == options.injectType) $target[options.injectType](layout);
				else if ('replace' == options.injectType) $target.html(layout);
				else {
					laboite.error('invalid injectType');
					return false;
				};
				
				// mark as in
				indom = true;
				
				// load default index image
				laboite.call('goToId', options.defaultIndex);
			
			} else {
				
				// set the opacity of the layout to 0
				layout.css('opacity', 0);
				
				// sort out the dimmer element if needed
				if (options.dimmer) {
				
					// we cache it, apply some styling and bind it here too
					cache['dimmer'] = $('<div class="' + options.css.prefix + options.css.dimmer + '" />')
					.hide().bind('click', function() {
						laboite.call('close');
					}).appendTo('body:eq(0)');
				};
			};
		},
		
		// go to the element of the given index
		goToId: function(index) {

			// make sure out index is within our data set 
			if (index >= 0 && index <= options.__count - 1) laboite.call('load', index);
			else {
			
				// if continuous browsing is enabled we fix the new index
				if (options.continuous) {
				
					// if inferior to 0 we moved to the end of the set, if not at the beginning
					if (index < 0) var newIndex = options.__count - 1;
					else var newIndex = 0;

					// load the new index
					laboite.call('load', newIndex);
				};
			};
		},
		
		// open the UI (modal/popup boxes)
		open: function(trigger) {
			
			// sort dimmer element
			laboite.call('openDimmer');
			
			// if the UI is not in the dom yet, not injected, we need to put the markup into the page first
			if (!indom) {
				
				// add in the dom and fade it in
				layout.appendTo('body:eq(0)').fadeTo(options.dimmerFadeDuration, 1);
				
				// center the UI
				laboite.call('positionUI');
				
				// mark the UI as in the dom now
				indom = true;
			}
			
			// if it's already in the dom we just fade it in
			else layout.fadeTo(options.dimmerFadeDuration, 1);
								
			// bind the window on resize
			laboite.call('modalBind');
			
			// go to the requested item
			laboite.call('goToId', $(trigger).index());
		},
		
		
		// close the interface
		close: function() {
			
			// request dimmer to be close
			laboite.call('closeDimmer');
			
			// fade out the UI
			layout.fadeTo(options.dimmerFadeDuration, 0, function() {
			
				// display:none on the UI
				layout.hide();
			});
			
			// bind the window on resize
			laboite.call('modalUnbind');
		},
		
		// start the slideshow process
		play: function() {
			laboite.t = setInterval(function() {
				laboite.call('next');
			}, options.slideshowDelay);
		},
		
		// pause the slideshow process
		pause: function() {
			clearInterval(laboite.t);
		},
		
		// stop the slideshow process
		stop: function() {
			laboite.call('pause');
			laboite.call('goToId', 0);
		},
		
		// go to the next item 
		next: function() {
			laboite.call('goToId', animate + 1);
		},
		
		// go to the previous item
		previous: function() {
			laboite.call('goToId', animate - 1);
		},
		
		// switch the view of an item (does hideItem and showItem basically)
		switchItem: function(index) {
				
			// call the hide item method
			laboite.call('hideItem', function() {

				// when animation is completed we switch content
				cache['content'].children().hide();
				$(loaded[animate]).show();
				
				// and show the item
				laboite.call('showItem');
			});
		},
		
		// handle the transition out of an item
		hideItem: function(fn) {

			// grab effect configuration object
			var fx = effects[options.effect || 'none'].hide,
			
			// sort out our config element
			config = {};
			
			// callback to handle?
			if (fn) config.complete = fn;
			
			// extend our config element with the effect config settings
			$.extend(config, fx.config);
			
			// hide the current item and do the callback on complete if any set
			cache['content'].css(fx.init || {}).animate(fx.css, config);
		},
		
		// handle the tranbsition in of an item
		showItem: function(fn) {
			
			// grab effect configuration object
			var fx = effects[options.effect || 'none'].show,
			
			// sort out our config element
			config = {};
			
			// callback to handle?
			if (fn) config.complete = fn;
			
			// extend our config element with the effect config settings
			$.extend(config, fx.config);
			
			// hide the current item and do the callback on complete if any set
			cache['content'].css(fx.init || {}).animate(fx.css, config);
		},
		
		// hide the loader element
		hideLoader: function() {
			if (cache.loader) cache.loader.hide();
		},
		
		// show the loader element
		showLoader: function() {
			if (cache.loader) cache.loader.show();
		},
		
		// load a requested content
		load: function(index) {
			
			// update currentItem (also mauybe be worth doing even later in case the content doesn't load)
			animate = index;
			
			// item already loaded & cached?
			if (loaded[index]) {

				// hide the current item
				laboite.call('switchItem', index);

			} else {
				
				// show the loader element (not cached so expecting loading time)
				laboite.call('showLoader');
				
				// hide the item away
				laboite.call('hideItem', function() {
			
					// type detection
					var type = laboite.call('getType', index);
					
					// load the requested type (loadIframe is used if there is not special method for the requested type)
					if (laboite['load' + type]) laboite.call('load' + type, index);
					else laboite.call('loadIframe', index);
				});
			};
		},
		
		// detect the type of content based on it's request url
		getType: function(index) {
			
			// set default type
			var type = 'Image';
			
			// only proceed if the plugin is not set to threat all requests as images
			if (!options.loadAsImage) {
				
				// type specific set for the item?
				if (options.data.items[index].type) type = data.items[index].type;
				else {
					
					/*
						TO DO - DETECT REQUESTS TYPE				
					*/
					var source = options.data.items[index].source,
						bits = source.split('.'),
						extension = bits[bits.length - 1];
					
					// handle flash movies
					if (extension === 'swf') type = 'Swf';

					// if not an image we load the content inside an iframe
					else if (!/jpg|jpeg|png|gif|bmp|tiff|svg/.test(extension)) type = 'Iframe';
				};
			};
			
			// return the type value
			return type;
		},
		
		// load image requests
		loadImage: function(index) {
		
			// create a new image object
			var img = new Image(),
				src = options.data.items[index]['source'] || false,
				title = options.data.items[index]['title'] || '';
			
			// if no valid source error out and terminate here
			if (!src) {
				laboite.error('source not found for index "' + index + '"');
				return false;
			};
			
			img.onload = function() {
				
				// cache the image element
				loaded[index] = img;
				
				// update the content element
				cache['content'].children().hide().end().append(loaded[index]);
				cache['container'].css({
					height: $(loaded[index]).height(),
					width: $(loaded[index]).width()
				});
				
				// if not injected we make sure to position the interface again once the content 
				// has been loaded into the container
				if (!options.inject) laboite.call('positionUI');
				
				// show the item
				laboite.call('showItem');
			};
			img.src = src;
			img.title = title;
		},
		
		// handle element requests
		loadElement: function(index) {},
		
		// handle flash requests
		loadSwf: function(index) {
		
			// create a new image object
			var cur = $('#' + laboite.name + 'Swf' + index).size() ? $('#' + laboite.name + 'Swf' + index) : false,
				div = cur || $('<div />').attr('id', laboite.name + 'Swf' + index),
				src = options.data.items[index]['source'] || false,
				title = options.data.items[index]['title'] || '',
				embed = function() {
					// update the content element
					cache['content'].children().hide().end().append(div);
					swfobject.embedSWF(src, laboite.name + 'Swf' + index, '400', '400', '9.0.0');
				},
				script;
		
			if (window.swfobject) embed();
			else $.getScript(options.SWFObject, embed);
		},
		
		// handle iframe requests
		loadIframe: function(index) {},
		
		// sort out the UI positioning
		positionUI: function() {
		
			// do we have a target
			if (options.modalTarget) {
			
				// if so grab it as well as it's top and left position
				var $target = $(options.modalTarget),
					pos = $target.offset();
				
				// make sure we have some data (error output?)
				if (pos != null) {
					
					// position the layout
					layout.css({
						top:pos.top + options.modalOffsetTop,
						left:pos.left + options.modalOffsetLeft
					});
				};
			} else {
			
				// center in the view port
				laboite.call('centerUI');
			};	
		},
		
		// center the modal UI into the viewport
		centerUI: function() {
			
			// layout dimensions
			var box = {
				w: layout.width(),
				h: layout.height()
			},
			
			// window dimension
			win = {
				w: $win.width(),
				h: $win.height()
			},
			
			// caculate new top and left values
			newTop = parseInt((win.h - box.h) / 2),
			newLeft = parseInt((win.w - box.w) / 2);
			
			// make sure the values are within the viewable area
			if (newTop < 0) newTop = 0;
			if (newLeft < 0) newLeft = 0;

			// position the layout
			layout.css({
				top: newTop,
				left: newLeft
			});
		},
		
		// get the layout ready
		getLayout: function() {
		
			var templ;
		
			// if the layout doesn't exists error out and stop here
			if (!layouts[options.layout]) {
				laboite.error(options.layout + ' layout not found!');
				return false;
			};
			
			// if language strings are not available we stop here
			if (!languages[options.lang]) {
				laboite.error(options.lang + ' language not found!');
				return false;
			};
			
			// grab the layout template
			templ = layouts[options.layout]();
			
			// replace language string inside the layouts
			$.each(languages[options.lang], function(k, v) {
				templ = templ.replace(new RegExp('\\${' + k + '}', 'g'), v);
			});
			
			// grab the layout template
			return $(templ);
		},
		
		// open the dimmer element if needed
		openDimmer: function() {
		
			// is it needed?
			if (options.dimmer && cache['dimmer']) {
			
				// do we need to style it? We do it on every call so it allows for dynamic background 
				// (performance? optional? watch properties?)
				if (options.dimmerMatchBackground) {
					
					// variables
					var 
						// grab the body element
						body = $('body:eq(0)'),
						bg = 'background-',
						
						// CSS properties to copy over
						css = [
							bg + 'color',
							bg + 'image',
							bg + 'repeat',
							bg + 'position'
						];
					
					// loop through css properties and copy if present
					$.each(css, function(k, v) {
						var prop = body.css(v);
						if (prop != '') cache['dimmer'].css(v, prop);
					});
				};
				
				// we put it in place
				cache['dimmer'].css({
					position: 'absolute',
					height: $doc.height(),
					width: $doc.width(),
					left: 0,
					top: 0
				})
				
				// and we fade it in
				.fadeTo(options.dimmerFadeDuration, options.dimmerOpacity);
			};
		},
		
		// sort out the binding around the modal box
		modalBind: function() {
				
			// bind the window on resize
			$win.bind('resize', function() {
				
				// adjust the dimension of the dimmer element
				cache['dimmer'].css({
					height: $doc.height(),
					width: $doc.width()
				});
			});
			
			if (options.modalKeepAtCenter) {
				$doc.bind('scroll', function() {
					laboite.call('centerUI');
				});
			};
		},
		
		// unbind the events around the modal box
		modalUnbind: function() {
			$win.unbind('resize.' + laboite.name + ' scroll.' + laboite.name);
			$doc.unbind('scroll.' + laboite.name);
		},
		
		// close the dimmer element
		closeDimmer: function() {
		
			// fade the dimmer out
			cache['dimmer'].fadeTo(options.dimmerFadeDuration, 0, function() {
				
				// hide it
				cache['dimmer'].hide();
				
				// unbind window
				$win.unbind('resize.' + laboite.name);
			});
		},
		
		// API to add effects to the current laboite instance (global one can be added via $.laboite.effects[name] = object)
		addEffect: function(name, fx, overwrite) {
			if (effects[name] && !overwritte) laboite.error(name + 'already exists!');
			else effects[name] = fx;
		},
		
		// function that reset totals (used whe an item is added or delete from the data set)
		resetCount: function() {

			// reset the internal count
			options.__count = options.data.items.length;
		},
		
		// collect data
		getData: function() {
			
			// if we have a data URL set this take priroity over the element
			if (options.dataUrl) {
				
				// ajax call
				$.ajax({
				
					// assign URL
					url: options.dataUrl,
					
					// handle both json and jsonp requests (e.g. cross-domain requests)
					dataType: options.jsonp ? 'jsonp' : 'json',
					
					// error handling
					error: function() {
					
						// basic error reporting (can be improved to return more useful information about why the error occured)
						laboite.error(options.dataUrl + ' not found');
					},
					
					// success handling
					success: function(data) {
					
						// make sure the items array is present
						if (data.items) {
						
							// assign the data
							options.data = data;
							
							// run the plugin
							laboite.call('run');
						};
					}
				});	
			}
			
			// otherwise we just build our data based on the dom
			else laboite.call('getDataFromDom');
		},
		
		// get the data from the DOM
		getDataFromDom: function() {
			
			// object to hold out data (best to keep seperate from the global one until the process is finished)
			var items = [];
			
			// make sure out data variable is an object (if we come to hear it means it is false so far and it must be an object for us to attach the items to it later on)
			options.data = {};
			
			// loop through each element and build our data object
			root.each(function(i) {
				
				// cache the current elements
				var $this = $(this);
				
				// start an empty object to hold this item data
				items[i] = {};
				
				// loop through our attributes selectors
				$.each(options.attributes, function(k, v) {
				
					// attempt to grab attribute data (attr = false if attribute not present)
					var attr = $this.attr(v);
					
					// check for the attributes presence and add if it is there
					if (attr) items[i][k] = attr;
				});
			});

			// assign the data
			options.data.items = items;
			
			// run!
			laboite.call('run');
		},
		
		// internal call function (handle callbacks dynamically)
		call: function(method) {
		
			// any before method callback? 
			if (options.callbacks[method + 'Before']) options.callbacks[method + 'Before']();

			// log our method calls
			laboite.log(method + '(' + Array.prototype.slice.call(arguments, 1) + ')');

			// call method
			var res = laboite[method].apply(null, Array.prototype.slice.call(arguments, 1));
			
			// any after method callback?
			if (options.callbacks[method + 'After']) options.callbacks[method + 'After']();
			
			// return true or the result if any
			return res || laboite;
		},
		
		// return the value of the requested k in the current instance option
		// if the key is not set the all option object is passed
		get: function(k) {
			
			// no key requested so just return the object
			if (!k) return options;
			
			// if our key exists return its value, if not output an error
			if (options[k]) return options[k];
			else laboite.error('get(' + k + ') ' + notfound);
		},
		
		// set / update a value in the instance options object for the requested key
		set: function(k, v) {
			
			// we must have a key and a value
			if (!k && !v) {
				laboite.error('set() missing arguments');
				return false;
			} else options[k] = v;
		},
		
		// error reporting function
		error: function(msg) {
		
			// are we in debug mode?
			if (options.debug) {
				
				// build our message
				msg = laboite.name + ': ' + msg;
				
				// output it in the console if present otherwise use alert()
				if (console.error) console.error(msg);
				else alert(msg);
			};
		},
		
		// logging function
		log: function(msg) {
			
			// if logging enable and console log available log away
			if (options.log && console.log) {
				msg = laboite.name + ': ' + msg;
				console.log(msg);
			};
		}
	});
};
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
	
	// slideshow options
	slideshow: false, // enable | disable slideshow functionality
	slideshowDelay:5000, // delay between transition
	
	// iFramme options
	iFrameWidth: 640,
	iFrameHeight: 480,
	
	// Flash option
	flashWidth:640,
	flashHeight:480,
	SWFObject: 'https://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js',
	
	// dimmer options (for modal effect)
	dimmer: true, // enable | disable the usage of a dimmer element for modal display
	dimmerOpacity: 0.5, // amount of opacity of the dimmer element
	dimmerBindToClose: true, // enable | disable binding of the dimmer element so clicking it close the UI
	dimmerFadeDuration: 200, // duration in miliseconds of the duration of the fading effect (0 = no fade effect)
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
		// NOT IN USE YET (MIGHT TAKE THEM OUT LATER)
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
// language strings object
$.laboite.languages = {
	
	// english
	'en': {
		close: 'Close',
		previous: 'Previous',
		next: 'Next',
		play: 'Play',
		pause: 'Pause',
		stop: 'Stop',
		stats: '${current} out of ${total}'
	},
	
	// french
	'fr': {
		close: 'Fermer',
		previous: 'Precedent',
		next: 'Suivant',
		play: 'Commencer',
		pause: 'Pauser',
		stop: 'Arreter',
		stats: '${current} de ${total}'
	}
};
/*
	Minimum layout required by laboite
	
	<div class="laboite-wrap">
		<div class="laboite-container">
			<div class="laboite-content"></div>
		</div>
	</div>
	
*/	
	
	// plugin default layouts
	$.laboite.layouts = {
	
		modal: function() {
		
			var layout = '<div class="laboite-wrap laboite-modal">';
					layout += '<a href="#close" class="laboite-close"><span>${close}</span></a>';
					layout += '<div class="laboite-container"><div class="laboite-content"></div></div>';
					layout += '<div class="laboite-controls">';
						layout += '<a href="#previous" class="laboite-button laboite-previous"><span>${previous}</span></a>';
						layout += '<a href="#next" class="laboite-button laboite-next"><span>${next}</span></a>';
						layout += '<a href="#play" class="laboite-button laboite-play"><span>${play}</span></a>';
						layout += '<a href="#pause" class="laboite-button laboite-pause"><span>${pause}</span></a>';
						layout += '<a href="#stop" class="laboite-button laboite-stop"><span>${stop}</span></a>';
						layout += '<span class="laboite-stats"></span>';
					layout += '</div>';
				layout += '</div>';
				
			return layout;
		},
		inline: function() {
		
			var layout = '<div class="laboite-wrap laboite-inline">';
					layout += '<div class="laboite-controls">';
						layout += '<a href="#previous" class="laboite-button laboite-previous"><span>${previous}</span></a>';
						layout += '<a href="#next" class="laboite-button laboite-next"><span>${next}</span></a>';
						layout += '<a href="#play" class="laboite-button laboite-play"><span>${play}</span></a>';
						layout += '<a href="#pause" class="laboite-button laboite-pause"><span>${pause}</span></a>';
						layout += '<a href="#stop" class="laboite-button laboite-stop"><span>${stop}</span></a>';
						layout += '<span class="laboite-stats"></span>';
					layout += '</div>';
					layout += '<div class="laboite-container"><div class="laboite-content"></div></div>';
				layout += '</div>';
				
			return layout;
		}
	};
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
})(jQuery);
