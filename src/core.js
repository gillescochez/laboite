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
			
			// show the loader element (not cached so expecting loading time)
			if (!loaded[index]) laboite.call('showLoader');
			
			// hide the item away
			laboite.call('hideItem', function() {
		
				// type detection
				var type = laboite.call('getType', index);
				
				// load the requested type (loadIframe is used if there is not special method for the requested type)
				if (laboite['load' + type]) laboite.call('load' + type, index);
				else laboite.call('loadIframe', index);
			});
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
					
					else if (source.substr(0, 1) == '#') type = 'Element';

					// if not an image we load the content inside an iframe
					else if (!/jpg|jpeg|png|gif|bmp|tiff|svg/.test(extension)) type = 'Iframe';
				};
			};
			
			// return the type value
			return type;
		},
		
		// load image requests
		loadImage: function(index) {
		
			if (loaded[index]) {
				loaded[index].show();
				laboite.call('resizeContainer', loaded[index].width(), loaded[index].height());
				return;
			}
		
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
				loaded[index] = $(img);
				
				// update the content element
				cache['content'].children().hide().end().append(loaded[index]);
				
				laboite.call('resizeContainer', loaded[index].width(), loaded[index].height());
			};
			
			img.src = src;
			img.title = title;
		},
		
		// handle element requests
		loadElement: function(index) {
		
			if (loaded[index]) {
				loaded[index].show();
				laboite.call('resizeContainer', loaded[index].width(), loaded[index].height());
				return;
			}

			var	src = options.data.items[index]['source'] || false,
				title = options.data.items[index]['title'] || '',
				$el = options.elementClone ? $(src).clone() : $(src);
				
			loaded[index] = $el;
			
			cache['content'].children().hide().end().append($el.show());
			
			laboite.call('resizeContainer', loaded[index].width(), loaded[index].height());
			
			// show the item
			laboite.call('showItem');
		},
		
		// handle flash requests
		loadSwf: function(index) {
		
			if (loaded[index]) {
				loaded[index].show();
				laboite.call('resizeContainer', options.flashWidth, options.flashHeight);
				return;
			}
		
			// create a new image object
			var cur = $('#' + laboite.name + 'Swf' + index).size() ? $('#' + laboite.name + 'Swf' + index) : false,
				$div = cur || $('<div />').attr('id', laboite.name + 'Swf' + index),
				src = options.data.items[index]['source'] || false,
				title = options.data.items[index]['title'] || '',
				embed = function() {
				
					// update the content element
					cache['content'].children().hide().end().append($div);
					swfobject.embedSWF(src, laboite.name + 'Swf' + index, options.flashWidth, options.flashHeight, options.flashVersion);
					laboite.call('resizeContainer', options.flashWidth, options.flashHeight);
					loaded[index] = $('#' + laboite.name + 'Swf' + index);
				},
				script;
		
			if (window.swfobject) embed();
			else $.getScript(options.SWFObject, embed);
		},
		
		// handle iframe requests
		loadIframe: function(index) {
		
			if (loaded[index]) {
				loaded[index].show();
				laboite.call('resizeContainer', options.iFrameWidth, options.iFrameHeight);
				return;
			}
		
			var $frame = $('<iframe />').css({
				width: options.iFrameWidth,
				height: options.iFrameHeight,
				border:'none'
			});
			
			$frame.attr('src', options.data.items[index]['source']);
			$frame.bind('load', function() {
				loaded[index] = $frame;
				laboite.call('resizeContainer', options.iFrameWidth, options.iFrameHeight);
			});
			
			cache['content'].children().hide().end().append($frame);
		},
		
		resizeContainer: function(width, height) {
		
			if (!options.resize) {
				laboite.call('showItem');
				return;
			};
		
			// maximums
			if (options.maxHeight && height > options.maxHeight) height = options.maxHeight;
			if (options.maxWidth && width > options.maxWidth) width = options.maxWidth;
			
			// minimums
			if (options.minHeight && height < options.minHeight) height = options.minHeight;
			if (options.minWidth && width < options.minWidth) width = options.minWidth;
			

			cache['container'].animate({
				height: height,
				width: width
			}, {
				duration: options.resizeDuration,
				easing: options.resizeEasing,
				step: function() {
					laboite.call('positionUI');
				},
				complete: function() {
					laboite.call('showItem');
				}
			});
		},
		
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
			$win.bind('resize.' + laboite.name + ' scroll.' + laboite.name, function() {
				
				// adjust the dimension of the dimmer element
				cache['dimmer'].css({
					height: $doc.height(),
					width: $doc.width()
				});
				laboite.call('centerUI');
			});
			
			if (options.modalKeepAtCenter) {
				$doc.bind('scroll.' + laboite.name, function() {
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
