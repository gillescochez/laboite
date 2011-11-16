/*
 *  La Boite v.2.0
 *  Copyright 2011, Gilles Cochez
 *  Released under the MIT, BSD, and GPL Licenses.
 */
/*
	TODO
		- Split into multiple files
		- Add build system
		- Change folder structure
		- Change intl handling (simplified object)

*/

// bof closure
(function($) {

	// caching few global elements
	var $win = $(window).
		$doc = $(document),

	// some string as variables for compression
		notfound = 'not found';
		bodySel = 'body:eq(0)';
	
	// plugin declaration
	$.laboite = function(root) {
		
		// cache our object (shorter and avoid clash with other "this" references)
		var pg = this;
		
		// extend
		$.extend(pg, {

			// plugin name
			name: 'laboite',
			
			// version number
			version: '2.0',
			
			// initialize functions
			init: function(options, layouts, languages) {
			
				// sort instance options
				pg.options = $.extend({}, $.laboite.defaults, options);
				
				// sort instance layouts
				pg.layouts = $.extend({}, $.laboite.layouts, layouts);
				
				// sort instance languages
				pg.languages = $.extend({}, $.laboite.languages, languages);
				
				// used internally to cache UI elements
				pg.uicache = [];
				
				// used internally to cache content already loaded (and preloaded content)
				pg.loaded = [];
				
				// track wether the UI is in the dom or not (modal get injected only when requested the first time)
				pg.indom = false;
				
				// used to store the layout (uicache is probably better)
				pg.layout = null;
				
				// track the state of animation
				pg.animate = false;
				
				// keep track of the index for the current displayed element
				pg.currentIndex = pg.options.defaultIndex;
				
				// first before anything we need to get some data
				if (!pg.options.data) pg.call('getData');
				else pg.call('run');
			},
			
			// run!
			run: function() {

				// run only if we have data of course
				if (pg.options.data) {
				
					// reset the items count
					pg.call('resetCount');
					
					// build the UI
					pg.call('buildUI');
					
					if (pg.inject && pg.injectType == 'replace') {
						pg.call('goto', pg.currentIndex);					
					} else {
					
						// bind our element
						root.live(pg.options.onEvent, function(ev) {
						
							// prevent default behaviour
							ev.preventDefault();
							
							// trigger opening (or showing if we inject the UI into the page itself)
							if (pg.options.inject) pg.call('goto', $(this).index());
							else pg.call('open', this);
						});
					};
				};
			},
			
			// build the user interface
			buildUI: function() {
			
				// grab the layout template
				pg.layout = pg.call('getLayout', pg.options.layout);
				
				//extract plugin specific element and cache them (easier to access later and we are already in the layout context)
				$('[class^="'+pg.options.css.prefix+'"]', pg.layout).each(function(k) {
					
					// grab all the classes, split them and store the count
					var classes = this.className,
						bits = classes.split(' '),
						nb = classes.length-1;
					
					// make sure we at least have one class before we continue
					if (nb) {
					
						// loop through the different classes
						for (var i = 0; i < nb; i++) {
						
							// make sure it is a aboite sepecific classes 
							if (bits[i] && bits[i].indexOf(pg.options.css.prefix) !== -1) {
								
								// we build an internal identifier for our element by removing the prefix part (faster access and few lines down it would be clearer why)
								var id = bits[i].replace(pg.options.css.prefix,'');
								
								// cache our element (we strip out the prefix for easier access
								pg.uicache[id] = $(this);
	
								// now let's see if there is a function that can be bind to that element
								// the plugin is build so that the defaults CSS name matches (tiny footprint)
								if ($.isFunction(pg[id])) {
								
									// bind the element
									pg.uicache[id].click(function(ev) {
									
										// prevent default behaviour
										ev.preventDefault();
										
										// do the method call
										pg.call(id);
									});
								};
							};
						};
					};
				});
				
				// if the slideshow is off we hide useless button
				if (!pg.options.slideshow) {
				
					// loop through slideshow only action and hide them away
					$.each(['play','pause','stop'], function(k, v) {
						pg.uicache[v].hide();
					});
					
					// we add a class for the disabled state for more styling flexibility
					pg.layout.addClass(pg.options.css.prefix+pg.options.css.slideshowDisabled);
				};
				
				// do we need to inject then UI into the page?
				if (pg.options.inject) {
				
					// grab the target to be injected
					var $target = $(pg.options.injectTarget);
					
					// inject the UI based on the configuration settings
					if ('append' == pg.options.injectType || 'prepend' == pg.options.injectType) $target[pg.options.injectType](pg.layout);
					else if ('replace' == pg.options.injectType) $target.html(pg.layout);
					else {
						pg.error('invalid injectType');
						return false;
					};
					
					// mark as in
					pg.indom = true;
					
					// load default index image
					pg.call('goto', pg.options.defaultIndex);
				
				} else {
					
					// set the opacity of the layout to 0
					pg.layout.css('opacity', 0);
					
					// sort out the dimmer element if needed
					if (pg.options.dimmer) {
					
						// we cache it, apply some styling and bind it here too
						pg.uicache['dimmer'] = $('<div class="'+pg.options.css.prefix+pg.options.css.dimmer+'" />')
						.hide().bind('click', function() {
							pg.call('close');
						}).appendTo(bodySel);
					};
				};
			},
			
			// go to the element of the given index
			goto: function(index) {

				// make sure out index is within our data set 
				if (index >= 0 && index <= pg.options.__count-1) pg.call('load', index);
				else {
				
					// if continuous browsing is enabled we fix the new index
					if (pg.options.continuous) {
					
						// if inferior to 0 we moved to the end of the set, if not at the beginning
						if (index < 0) var newIndex = pg.options.__count-1;
						else var newIndex = 0;

						// load the new index
						pg.call('load', newIndex);
					};
				};
			},
			
			// open the UI (modal/popup boxes)
			open: function(trigger) {
				
				// sort dimmer element
				pg.call('openDimmer');
				
				// if the UI is not in the dom yet, not injected, we need to put the markup into the page first
				if (!pg.indom) {
					
					// add in the dom and fade it in
					pg.layout.appendTo(bodySel).fadeTo(pg.options.dimmerFadeDuration, 1);
					
					// center the UI
					pg.call('positionUI');
					
					// mark the UI as in the dom now
					pg.indom = true;
				}
				
				// if it's already in the dom we just fade it in
				else pg.layout.fadeTo(pg.options.dimmerFadeDuration, 1);
									
				// bind the window on resize
				pg.call('modalBind');
				
				// go to the requested item
				pg.call('goto', $(trigger).index());
			},
			
			
			// close the interface
			close: function() {
				
				// request dimmer to be close
				pg.call('closeDimmer');
				
				// fade out the UI
				pg.layout.fadeTo(pg.options.dimmerFadeDuration, 0, function() {
				
					// display:none on the UI
					pg.layout.hide();
				});
				
				// bind the window on resize
				pg.call('modalUnbind');
			},
			
			// start the slideshow process
			play: function() {
				pg.t = setInterval(function() {
					pg.call('next');
				}, pg.options.slideshowDelay);
			},
			
			// pause the slideshow process
			pause: function() {
				clearInterval(pg.t);
			},
			
			// stop the slideshow process
			stop: function() {
				pg.call('pause');
				pg.call('goto', 0);
			},
			
			// go to the next item 
			next: function() {
				pg.call('goto', pg.currentIndex + 1);
			},
			
			// go to the previous item
			previous: function() {
				pg.call('goto', pg.currentIndex - 1);
			},
			
			// switch the view of an item (does hideItem and showItem basically)
			switchItem: function(index) {
					
				// call the hide item method
				pg.call('hideItem', function() {
				
					// when animation is completed we switch content
					pg.uicache['content'].html(pg.loaded[pg.currentIndex]);
					
					// and show the item
					pg.call('showItem');
				});
			},
			
			// handle the transition out of an item
			hideItem: function(fn) {
				
				// grab effect configuration object
				var fx = $.laboite.fx[pg.options.effect].hide;
				
				// sort out CSS changes
				var css = fx.css;
				
				// sort out our config element
				var config = {};
				
				// callback to handle?
				if (fn) config.complete = function() { fn(); };
				
				// extend our config element with the effect config settings
				$.extend({}, fx.config, config);
				
				// hide the current item and do the callback on complete if any set
				pg.uicache['content'].animate(css, config);
			},
			
			// handle the tranbsition in of an item
			showItem: function(fn) {
				
				// grab effect configuration object
				var fx = $.laboite.fx[pg.options.effect].show;
				
				// sort out CSS changes
				var css = fx.css;
				
				// sort out our config element
				var config = {};
				
				// callback to handle?
				if (fn) config.complete = function() { fn(); };
				
				// extend our config element with the effect config settings
				$.extend({}, fx.config, config);
				
				// hide the current item and do the callback on complete if any set
				pg.uicache['content'].animate(css, config);
			},
			
			// hide the loader element
			hideLoader: function() {
			
			},
			
			// show the loader element
			showLoader: function() {
			
			},
			
			// load a requested content
			load: function(index) {
				
				// update currentItem (also mauybe be worth doing even later in case the content doesn't load)
				pg.currentIndex = index;
				
				// item already loaded & cached?
				if (pg.loaded[index]) {
	
					// hide the current item
					pg.call('switchItem', index);
	
				} else {
					
					// show the loader element (not cached so expecting loading time)
					pg.call('showLoader');
					
					// hide the item away
					pg.call('hideItem', function() {
				
						// type detection
						var type = pg.call('getType', index);
						
						// load the requested type (loadIframe is used if there is not special method for the requested type)
						if (pg['load'+type]) pg.call('load'+type, index);
						else pg.call('loadIframe', index);
					});
				};
			},
			
			// detect the type of content based on it's request url
			getType: function(index) {
				
				// set default type
				var type = 'Image';
				
				// only process if the plugin is not set to threat all requests as images
				if (!pg.options.loadAsImage) {
					
					// type specific set for the item?
					if (pg.options.data.items[index].type) type = data.items[index].type;
					else {
						
						/*
							TO DO - DETECT REQUESTS TYPE				
						*/
						var source = pg.options.data.items[index].source;
						var bits = source.split('.');
						var extension = bits[bits.length-1];
						
					};
				};
				
				// return the type value
				return type;
			},
			
			// load image requests
			loadImage: function(index) {
			
				// create a new image object
				var img = new Image(),
					src = pg.options.data.items[index]['source'] || false,
					title = pg.options.data.items[index]['title'] || '';
				
				// if no valid source error out and terminate here
				if (!src) {
					pg.error('source not found for index "'+index+'"');
					return false;
				};
				
				// image load event listener
				$(img).bind('load', function() {
	
					// remove the temporary image object
					$(this).remove();
					
					// build an image element to insert into the content element
					var $img = $('<img src="'+src+'" alt="'+title+'" />');
					
					// cache the image element
					pg.loaded[index] = $img;
					
					// update the content element
					pg.uicache['content'].empty().append(pg.loaded[index]);
					
					// show the item
					pg.call('showItem');
					
					// if not injected we make sure to position the interface again once the content 
					// has been loaded into the container
					if (!pg.options.inject) pg.call('positionUI');
				
				// we add the src attribute to start the loading process
				}).attr('src', src);
			},
			
			// handle flash requests
			loadSwf: function(index) {},
			
			// handle iframe requests
			loadIframe: function(index) {},
			
			// sort out the UI positioning
			positionUI: function() {
			
				// do we have a target
				if (pg.options.modalTarget) {
				
					// if so grab it as well as it's top and left position
					var $target = $(pg.options.modalTarget),
						pos = $target.offset();
					
					// make sure we have some data (error output?)
					if (pos != null) {
						
						// position the layout
						pg.layout.css({
							top:pos.top+pg.options.modalOffsetTop,
							left:pos.left+pg.options.modalOffsetLeft
						});
					};
				} else {
				
					// center in the view port
					pg.call('centerUI');
				};	
			},
			
			// center the modal UI into the viewport
			centerUI: function() {
				
				// layout dimensions
				var box = {
					w: pg.layout.width(),
					h: pg.layout.height()
				};
				
				// window dimension
				var win = {
					w:$win.width(),
					h:$win.height()
				};
				
				// caculate new top and left values
				var newTop = parseInt((win.h-box.h)/2);
				var newLeft = parseInt((win.w-box.w)/2);
				
				// make sure the values are within the viewable area
				if (newTop < 0) newTop = 0;
				if (newLeft < 0) newLeft = 0;

				// position the layout
				pg.layout.css({
					top:newTop,
					left:newLeft
				});
			},
			
			// get the layout ready
			getLayout: function() {
			
				// if the layout doesn't exists error out and stop here
				if (!pg.layouts[pg.options.layout]) {
					pg.error(pg.options.layout+' layout '+notfound);
					return false;
				};
				
				// if language strings are not available we stop here
				if (!pg.languages[pg.options.lang]) {
					pg.error(pg.options.lang+' language '+notfound);
					return false;
				};
				
				// grab the layout template
				var templ = pg.layouts[pg.options.layout]();
				
				// replace language string inside the layouts
				$.each(pg.languages[pg.options.lang], function(k, v) {
					templ = templ.replace(new RegExp('\\${'+k+'}','g'), v);
				});
				
				// grab the layout template
				return $(templ);
			},
			
			// open the dimmer element if needed
			openDimmer: function() {
			
				// is it needed?
				if (pg.options.dimmer && pg.uicache['dimmer']) {
				
					// do we need to style it? We do it on every call so it allows for dynamic background
					if (pg.options.dimmerMatchBackground) {
						
						// variables
						var 
							// grab the body element
							body = $(bodySel),
							
							// CSS properties to copy over
							css = [
								'background-color',
								'background-image',
								'background-repeat',
								'background-position'
							];
						
						// loop through css properties and copy if present
						$.each(css, function(k, v) {
							var prop = body.css(v);
							if (prop != '') pg.uicache['dimmer'].css(v, prop);
						});
					};
					
					// we put it in place
					pg.uicache['dimmer'].css({
						position: 'absolute',
						height: $doc.height(),
						width: $doc.width(),
						left: 0,
						top: 0
					})
					
					// and we fade it in
					.fadeTo(pg.options.dimmerFadeDuration, pg.options.dimmerOpacity);
				};
			},
			
			// sort out the binding around the modal box
			modalBind: function() {
					
				// bind the window on resize
				$win.bind('resize', function() {
					
					// adjust the dimension of the dimmer element
					pg.uicache['dimmer'].css({
						height: $doc.height(),
						width: $doc.width()
					});
				});
				
				if (pg.options.modalKeepAtCenter) {
					$doc.bind('scroll', function() {
						pg.call('centerUI');
					});
				};
			},
			
			// unbind the events around the modal box
			modalUnbind: function() {
				$win.unbind('resize.'+pg.name+' scroll.'+pg.name);
				$doc.unbind('scroll.'+pg.name);
			},
			
			// close the dimmer element
			closeDimmer: function() {
			
				// fade the dimmer out
				pg.uicache['dimmer'].fadeTo(pg.options.dimmerFadeDuration, 0, function() {
					
					// hide it
					pg.uicache['dimmer'].hide();
					
					// unbind window
					$win.unbind('resize.'+pg.name);
				});
			},
			
			// function that reset totals (used whe an item is added or delete from the data set)
			resetCount: function() {
	
				// reset the internal count
				pg.options.__count = pg.options.data.items.length;
			},
			
			// collect data
			getData: function() {
				
				// if we have a data URL set this take priroity over the element
				if (pg.options.dataUrl) {
					
					// ajax call
					$.ajax({
					
						// assign URL
						url: pg.options.dataUrl,
						
						// handle both json and jsonp requests (e.g. cross-domain requests)
						dataType: pg.options.jsonp ? 'jsonp' : 'json',
						
						// error handling
						error: function() {
						
							// basic error reporting (can be improved to return more useful information about why the error occured)
							pg.error(pg.options.dataUrl+' '+notfound);
						},
						
						// success handling
						success: function(data) {
						
							// make sure the items array is present
							if (data.items) {
							
								// assign the data
								pg.options.data = data;
								
								// run the plugin
								pg.call('run');
							};
						}
					});	
				}
				
				// otherwise we just build our data based on the dom
				else pg.call('getDataFromDom');
			},
			
			// get the data from the DOM
			getDataFromDom: function() {
				
				// object to hold out data (best to keep seperate from the global one until the process is finished)
				var items = [];
				
				// make sure out data variable is an object (if we come to hear it means it is false so far and it must be an object for us to attach the items to it later on)
				pg.options.data = {};
				
				// loop through each element and build our data object
				root.each(function(i) {
					
					// cache the current elements
					var $this = $(this);
					
					// start an empty object to hold this item data
					items[i] = {};
					
					// loop through our attributes selectors
					$.each(pg.options.attributes, function(k, v) {
					
						// attempt to grab attribute data (attr = false if attribute not present)
						var attr = $this.attr(v);
						
						// check for the attributes presence and add if it is there
						if (attr) items[i][k] = attr;
					});
				});
	
				// assign the data
				pg.options.data.items = items;
				
				// run!
				pg.call('run');
			},
			
			// internal call function (handle callbacks dynamically)
			call: function(method) {
			
				// any before method callback? 
				if (pg.options.callbacks[method+'Before']) pg.options.callbacks[method+'Before']();

				// log our method calls
				pg.log(method+'('+Array.prototype.slice.call(arguments, 1)+')');

				// call method
				var res = pg[method].apply(null, Array.prototype.slice.call(arguments, 1));
				
				// any after method callback?
				if (pg.options.callbacks[method+'After']) pg.options.callbacks[method+'After']();
				
				// return true or the result if any
				return (!res) ? true : res;
			},
			
			// return the value of the requested k in the current instance option
			// if the key is not set the all option object is passed
			get: function(k) {
				
				// no key requested so just return the object
				if (!k) return pg.options;
				
				// if our key exists return its value, if not output an error
				if (pg.options[k]) return pg.options[k];
				else pg.error('get('+k+') '+notfound);
			},
			
			// set / update a value in the instance options object for the requested key
			set: function(k, v) {
				
				// we must have a key and a value
				if (!k && !v) {
					pg.error('set() missing arguments');
					return false;
				} else pg.options[k] = v;
			},
			
			// error reporting function
			error: function(msg) {
			
				// are we in debug mode?
				if (pg.options.debug) {
					
					// build our message
					msg = pg.name+': '+msg;
					
					// output it in the console if present otherwise use alert()
					if (console.error) console.error(msg);
					else alert(msg);
				};
			},
			
			// logging function
			log: function(msg) {
				
				// if logging enable and console log available log away
				if (pg.options.log && console.log) {
					msg = pg.name+': '+msg;
					console.log(msg);
				};
			},
			
			// used for testing, to be deleted later on
			test: function(option) {
				return pg.options[option];
			}
		});
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
				if (typeof arguments[0] == 'string') {
					
					// make sure it is a valid method (the user might not be using call which would check for that)
					if ($(this).data('laboite')[arguments[0]]) {
					
						// handle methods direct method calls as well as via cal method (that line handle both cases)
						var res = $(this).data('laboite')[arguments[0]].apply(null, Array.prototype.slice.call(arguments, 1));
					};
				};
			};
		};
		
		// return the value of a method call (if any) or conserve chainability
		return res || this;
	};
	
	// plugin default settings
	$.laboite.defaults = {
	
		// language setting
		lang: 'en', // set which language strings set to use
		
		// debugging tools
		log: false, // if enabled all method called made using the call method will be logged into the console
		debug: false, // enable | disable error reporting (using console.error() if available otherwise default to alert())
		
		// data options
		data: false, // can be used to pass the data to use when calling the plugin
		dataURL: false, // can be used to pass a URL which can be request via ajax to get the data for the plugin
		jsonp: false, // set wether the ajax call for data should be json or jsonp (cross domain querying)
		
		// layout
		layout: 'modal', // modal | popup | inline (can be extended via $.fn.laboite.layouts to use custom ones)
		
		// Options related to the injected UI
		inject: false, // if true the UI will be inserted into the callee selector 
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
		loadAsImage: false, // can be user to tell the plugin to threat all requests as images requests
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
	
	// plugin default layouts
	$.laboite.layouts = {
		modal: function() {
			var layout = '<div class="laboite-wrap laboite-modal">';
					layout += '<a href="#close" class="laboite-close"><span>${close}</span></a>';
					layout += '<div class="laboite-content"></div>';
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
					layout += '<div class="laboite-content"></div>';
				layout += '</div>';
			return layout;
		},
		popup: function() {
			var layout = '<!DOCTYPE html><html><title></title><body>';
				layout += '<div class="laboite-wqrap  laboite-popup">';
					layout += '<a  href="#close" class="laboite-button laboite-close"><span>Close</span></a>';
					layout += '<div class="laboite-content"></div>';
					layout += '<div class="laboite-controls">';
						layout += '<a href="#previous" class="laboite-button laboite-previous"><span>${previous}</span></a>';
						layout += '<a href="#next" class="laboite-button laboite-next"><span>${next}</span></a>';
						layout += '<a href="#play" class="laboite-button laboite-play"><span>${play}</span></a>';
						layout += '<a href="#pause" class="laboite-button laboite-pause"><span>${pause}</span></a>';
						layout += '<a href="#stop" class="laboite-button laboite-stop"><span>${stop}</span></a>';
						layout += '<span class="laboite-stats"></span>';
					layout += '</div>';
				layout += '</div></body></html>';
			return layout;
		}
	};

// eof closure
})(jQuery);