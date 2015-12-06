# Stick to top directive
Angular directive that allows divs to stay at the top of their container when scrolling down.
Allows for several containers, each having one or more sticky divs.
Uses Angular expressions to trigger on stick and on unstick callbacks.

## Features

- Container directive and sticky div directive allow for several scrollable areas to be controlled
- CSS focused
- Read position either on directive creation or live (for unknown height content)
- Position offset at which div is considered "out"
- onStick and onUnstick scope bindings with optional $index, $scrollPosition and $event available in the expression

## Sample usage

HTML:

```
  <div sticky-container>
      <p>Some content here</p>
      <div sticky-div>This will stick to top of container</div>
      <p>More content .....</p>
  </div>

```

CSS (available in angular-sticktotop.css):

```
.out-of-view {
  visibility: hidden;
}

.sticky-div-copy {
  display: none;
  position: fixed;
  top: 0px;
}

.sticky-div-original {
  position: relative;
}

.sticky-div-copy.out-of-view {
  visibility: visible;
  display: block;
}

[sticky-container] {
  overflow-y: scroll;
}
```

## Install

Add `angular-sticktotop.js` to your html

## Dependencies
None, although if lodash is available (as window._), it will be used for the throttling of the scroll event

## Examples

Run a http server at the root directory e.g.

```
  python -m SimpleHTTPServer
```
and view examples/......./index.html

## sticky-container
This is the scrollable reference element.
### Options
All options are available as attributes of the directive

- *scrollPeriod*: Number of milliseconds for throttling of scroll event. Defaults to 50ms.

## sticky-div
This directive requires the sticky container directive as one of its parens. The elements whose position is watched and compared to the current scroll value.
### Original and copy
The directive creates a copy of the original element and inserts it into the DOM just after the original element. The original element receives a CSS class 'sticky-div-original' and the copy receives the class 'sticky-div-copy'.
### Options
All options are available as attributes of the directive

- *outOfViewClass* <string>: Class name to be added to both the original and copy elements when original is out of the view. Defaults to 'out-of-view'
- *stickyOffset* <angular expression>: Number of pixels from top of container that will be considered as "out of view". Evaluated as Angular expression, so numbers work (sticky-offset="50") but scope variables or functions are also acceptable (sticky-offset="myOffset()"). Defaults to 0. See the stackheaders example
- *liveOffset* : If set, the position of the sticky div within the container will be evaluated each time the scroll event is triggered. Useful if some content above the sticky div changes in height. But comes at a cost in terms of resources.
- *onStick* <angular expression>: An Angular expression (has to be a function) which will be called when the div becomes stuck at the top. Exposes $index, $scrollPosition and $event as special keywords which will receive respectively the index of the sticky div (within this container), the scroll position (in px from top of this container) and the scroll event object.
- *onUnstick* <angular expression>: see onStick 

