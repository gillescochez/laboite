# NOTICE

Project still  under development use at your  own risk.

# La Boite 2

La Boite (the box in french) 2 is a jQuery "class" / plugin which aims to lay the ground work 
necessary for building custom lightbox / modal viewer, with some customization you could even 
use it to build drop down menus.

The styling is minimal on purpose to push for customization, too many websites, in my opinion,
have the same lightbox design which doesn't always match the actual website design.

La Boite try to simplify the customization process by providing libraries of effects, layouts
and languages which can be extended very easily. 

## Usage

#### Basic usage as a lightbox

##### JS

```javascript
$(function() {
	$('#items a.item').laboite();
});
```

##### HTML

```html
<div id="items">
	<a class="item" href="fireworks.swf" title="Flash">Flash</a>
	<a class="item" href="images/image1.jpg" title="Image">Image</a>
	<a class="item" href="#lipsum" title="Element">Element</a>
	<a class="item" href="index-src.html" title="Iframe">Iframe</a>
</div>
<div id="lipsum" style="display:none">
	<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed id felis erat. Cras tellus nibh, vulputate eget tristique eget, gravida at nulla. Nulla vel nulla eget nunc facilisis blandit. Duis sagittis, dolor sit amet ultricies sagittis, nibh massa tristique turpis, molestie lacinia lorem ipsum eget odio. Pellentesque tristique nibh est, molestie faucibus lorem. Cras libero nisl, tempus id consequat sed, eleifend ut lectus. Duis mattis fringilla tempus. Vestibulum felis tellus, consectetur sed ultrices vitae, eleifend at turpis. Donec eget neque odio, vel viverra massa. Vivamus in sollicitudin erat. Fusce vitae sapien sit amet enim condimentum accumsan. Aliquam eget eros sit amet nunc euismod consectetur.</p>
	<p>Donec consequat, purus sed imperdiet malesuada, lorem mauris egestas tortor, condimentum luctus erat sapien ut sem. Nulla facilisi. Nam dictum commodo dolor vitae auctor. Suspendisse ultricies nisl a lacus fermentum luctus. In ultricies commodo nulla sit amet lobortis. Ut pulvinar interdum nibh vitae facilisis. Mauris id elit in metus accumsan egestas ac dictum ligula. Cras eleifend sapien metus. Nunc libero mauris, mattis in lacinia id, semper vel elit. Donec et nulla sed libero faucibus ullamcorper. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam ut arcu felis. Quisque faucibus adipiscing tempus. Vestibulum accumsan dapibus cursus.</p>
	<p>Proin adipiscing rhoncus ligula at vulputate. Nam interdum dapibus felis, vel cursus massa condimentum sed. Morbi consectetur enim quis dolor facilisis id varius metus vestibulum. Vestibulum in sapien et nibh porttitor mattis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec faucibus nisl id est imperdiet eget consectetur purus posuere. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Morbi id dolor nec enim sagittis vehicula. Quisque vel nunc vitae risus interdum rutrum volutpat sed turpis. Duis cursus malesuada dapibus. Ut sit amet aliquam augue. In nec lorem et felis accumsan vestibulum eget vitae neque. Vestibulum ut libero sem, nec mattis justo. Nullam ullamcorper convallis lacus sed aliquet. Vestibulum lobortis sollicitudin orci id faucibus. Vivamus vel odio massa.</p>
</div>
```

### Inline gallery example

##### JS

```javascript
$(function() {
	$('#items a.item').laboite({
		inject: true,
		injectTarget: '#canvas',
		effect: 'drop',
		layout: 'inline'
	});
});
```

##### HTML

```html
<div id="items">
	<a class="item" href="images/image1.jpg" title="Image 1">Image 1</a>
	<a class="item" href="images/image2.jpg" title="Image 2">Image 2</a>
	<a class="item" href="images/image3.jpg" title="Image 3">Image 3</a>
	<a class="item" href="images/image4.jpg" title="Image 4">Image 4</a>
	<a class="item" href="images/image5.jpg" title="Image 5">Image 5</a>
	<a class="item" href="images/image6.jpg" title="Image 6">Image 6</a>
</div>
<div id="canvas"></div>
```

## Options

```javascript

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

```

## La Boite version 1
http://laboite.codeserenity.com


