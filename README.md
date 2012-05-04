# Menu

* [Introduction](#introduction)
* [Features](#features)
* [Options](#options)
* [Setting callbacks](#setting-callbacks)
* [Custom transitions](#custom-transitions)
* [Custom layouts](#custom-layouts)
* [Custom transitions](#custom-languages)
* [old version](#la-boite-v1)


# Introduction

La Boite (the box in french) 2 is a jQuery "class" / plugin which aims to lay the ground work 
necessary for building custom lightbox / modal viewer, with some customization you could even 
use it to build drop down menus.

The styling is minimal on purpose to push for customization, too many websites, in my opinion,
have the same lightbox design which doesn't always match the actual website design.

La Boite try to simplify the customization process by providing libraries of effects, layouts
and languages which can be extended very easily.

La Boite 2 is not officially released yet as it is still under development, need some polish and
ideally a test suite, but it is usable and good enough to play around with.

Feel free to fork and join in the fun :)

[Menu](#menu)

# Features

* Handle images, flash (using swfobject), element and iframe
* Effects are stored in an object which can be extended
* Markup layouts are stored in an object which can be extended
* Languages strings are stored in an object which can be extended
* Every methods called can have a [callback function](#setting-callbacks)
* Display the interface as a modal or injected on the page
* It can be passed the data, grab it from the DOM or fetch it via ajax
* much more...

[Menu](#menu)

# Usage

### In modal mode

#### JS

```javascript

$(function() {
    $('#items a.item').laboite();
});

```

#### HTML

```html

<div id="items">
    <a class="item" href="fireworks.swf" title="Flash">Flash</a>
    <a class="item" href="images/image1.jpg" title="Image">Image</a>
    <a class="item" href="#lipsum" title="Element">Element</a>
    <a class="item" href="index-src.html" title="Iframe">Iframe</a>
</div>
<div id="lipsum" style="display:none">
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed id felis erat. Cras tellus nibh, vulputate eget tristique eget, gravida at nulla. Nulla vel nulla eget nunc facilisis blandit. Duis sagittis, dolor sit amet ultricies sagittis, nibh massa tristique turpis, molestie lacinia lorem ipsum eget odio.</p>
</div>

```

## In inject mode

#### JS

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

#### HTML

```html

<div id="items">
    <a class="item" href="images/image1.jpg" title="Image 1">Image 1</a>
    <a class="item" href="images/image2.jpg" title="Image 2">Image 2</a>
    <a class="item" href="images/image3.jpg" title="Image 3">Image 3</a>
</div>
<div id="canvas"></div>

```

## Using a data URL

Only JSON supported, considering doing a plugin to support XML too later on.

```javascript

$(function() {
    $('#items a.item').laboite({
        dataURL: 'http://domain.com/data/slides.json'
        // jsonp: true if you are using jsonp
    });
});

```

[Menu](#menu)

# Options

```javascript

// language setting
lang: 'en', // set which language to use

// debugging tools
log: false, // if enabled all method called made using the call method will be logged into the console
debug: false, // enable | disable error reporting (using console.error() if available otherwise default to throw)

// data options
data: false, // can be used to pass the data to use when calling the plugin
dataURL: false, // can be used to pass a URL which can be request via ajax to get the data
jsonp: false, // set wether the ajax call for data should be handled as jsonp

// layout
layout: 'modal', // modal | inline 

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

[Menu](#menu)

# Setting callbacks

In la boite you can attached callbacks to every single methods inside the plugin, this is because laboite use an internal call method, which
well, call methods. This function is also use for logging and as it can look inside the callbacks object for method begining by the same reference 
and ending with Before or After (obviosuly depending on if you want the callback executed before or after the called method).

This allows for a great amount of customization.

```javascript

$('.item').laboite({
    callbacks: {
       closeBefore: function() {

       },
       closeAfter: function() {

       },
       openAfter: function() {

       },
       nextBefore: function() {

       },
       buildUIAfter: function() {

       }
    }
});

```

[Menu](#menu)

# Custom transitions

Laboite uses a public object to store transitions effects in order to facilitate the creation of custom transitions.

Below is an example of a custom effect, drop, the comments will explain the effect of each property.

```javascript

$.extend($.laboite.effects, {

    // name of the effect
    drop: {
    
        // hide transition effect
        hide: {

            // CSS rules for the end state
            css: {
                bottom:'-120%',
                opacity:0
            },

            // configuration for the animation
            config: {
                duration:1000
            }
        },
        
        // show transition effect
        show: { 

            // CSS Rules apply to the element prior the animation starts
            init: {
                bottom:'120%'
            },

            // CSS rules for the end state
            css: {
                bottom:'0%',
                opacity:1
            },

            // configuration for the animation
            config: {
                duration:1000
            }
        }
    }
});

```

[Menu](#menu)

# Custom layouts

Layouts are handled the same way as transitions so custom layouts can easily be added in the same way as transitions effects

```javascript

// this is the minimum markup required for laboite to work
$.extend($.laboite.layouts, {
    minimal: '<div class="laboite-wrap">\
        <div class="laboite-container">\
            <div class="laboite-content"></div>\
        </div>\
    </div>'
});

```

[Menu](#menu)

# Custom languages

And, as you would have guessed by now, languages are handled the same way.

```javascript

$.extend($.laboite.languages, {

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

});

```

[Menu](#menu)

## La Boite V1

The first version was more your expected lightbox plugin. It's not supported anymore and doesn't work with latest jQuery but [here it is anyway](http://laboite.codeserenity.com)
