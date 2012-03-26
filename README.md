# La Boite 2

La Boite (the box in french) 2 is a jQuery "class" / plugin which aims to lay the ground work 
necessary for building custom lightbox / modal viewer, with some customization you could even 
use it to build drop down menus.

The styling is minimal on purpose to push for customization, too many websites, in my opinion,
have the same lightbox design which doesn't always match the actual website design.

La Boite try to simplify the customization process by providing libraries of effects, layouts
and languages which can be extended very easily. 

## Usage

```javascript

$(function() {

	// Example binging some elements
	$('#items a.item').laboite({
		continuous: true,
		slideshow:true
	}).css({
		fontWeight:'bold'
	});

	// Example binging some elements
	$('#items2 a.item').laboite({
		inject: true,
		injectTarget: '#canvas',
		effect: 'drop',
		layout: 'inline'
	});
});

```

```html
<div id="items">
	<a class="item" href="fireworks.swf" title="Image 1" data-laboite-maxWidth="640" data-laboite-maxHeight="480" data-laboite-description="This is the description">Fireworks</a>
	<a class="item" href="images/image2.jpg" title="Image 2" data-laboite-maxWidth="640" data-laboite-maxHeight="480" data-laboite-description="This is the description">Image 2</a>
	<a class="item" href="images/image3.jpg" title="Image 3" data-laboite-maxWidth="640" data-laboite-maxHeight="480" data-laboite-description="This is the description">Image 3</a>
	<a class="item" href="images/image4.jpg" title="Image 4" data-laboite-maxWidth="640" data-laboite-maxHeight="480" data-laboite-description="This is the description">Image 4</a>
	<a class="item" href="images/image5.jpg" title="Image 5" data-laboite-maxWidth="640" data-laboite-maxHeight="480" data-laboite-description="This is the description">Image 5</a>
	<a class="item" href="images/image6.jpg" title="Image 6" data-laboite-maxWidth="640" data-laboite-maxHeight="480" data-laboite-description="This is the description">Image 6</a>
</div>
<h1>Injected</h1>
<div id="items2">
	<a class="item" href="images/image1.jpg" title="Image 1" data-laboite-maxWidth="640" data-laboite-maxHeight="480" data-laboite-description="This is the description">Image 1</a>
	<a class="item" href="images/image2.jpg" title="Image 2" data-laboite-maxWidth="640" data-laboite-maxHeight="480" data-laboite-description="This is the description">Image 2</a>
	<a class="item" href="images/image3.jpg" title="Image 3" data-laboite-maxWidth="640" data-laboite-maxHeight="480" data-laboite-description="This is the description">Image 3</a>
	<a class="item" href="images/image4.jpg" title="Image 4" data-laboite-maxWidth="640" data-laboite-maxHeight="480" data-laboite-description="This is the description">Image 4</a>
	<a class="item" href="images/image5.jpg" title="Image 5" data-laboite-maxWidth="640" data-laboite-maxHeight="480" data-laboite-description="This is the description">Image 5</a>
	<a class="item" href="images/image6.jpg" title="Image 6" data-laboite-maxWidth="640" data-laboite-maxHeight="480" data-laboite-description="This is the description">Image 6</a>
</div>
<!-- the second gallery will be displayed in this elements - the hyperlinks can still be used to navigate the gallery -->
<div id="canvas"></div>
```

### As a jQuery plugin

### As a jQuery "class"

## API


