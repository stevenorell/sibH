/**
* @license
* sibHeight.js v0.1.0
* https://github.com/stevenorell/sibHeight
* License: MIT
*/

var SibHeight = function(config) {

  // set up the default configuration
  var config = config || {}
  ,   defaults = {
        selector: '',
        breakPoint: 768
      };

  // extend defaults with config object
  // thanks to http://youmightnotneedjquery.com/
  var deepExtend = function(objs) {
    var objs = objs || {};

    for(var i = 0; i < arguments.length; i++) {
      var obj = arguments[i];

      if(!obj) {
        continue;
      }

      for(var key in obj) {
        if(obj.hasOwnProperty(key)) {
          if(typeof obj[key] === 'object') {
            deepExtend(objs[key], obj[key]);
          } else {
            objs[key] = obj[key];
          }
        }
      }
    }

    return objs;
  }

  // get the true window width (accounting for scrollbars)
  function getWindowDimensions() {
    return {
      width:  window.innerWidth  || document.body.clientWidth,
      height: window.innerHeight || document.body.clientHeight
    };
  }

  // conditional to test if our configuration was passed as an object, or
  // a single value containing the selector
  if(typeof config === 'object') {
    config = deepExtend({}, defaults, config);
  } else {
    var selector = config;
    config = defaults;
    config.selector = selector;
  }

  if(!config.selector) {
    console.warn('SibHeight selector is not defined');
  }

  // get the element by selector
  var elem = document.querySelectorAll(config.selector);

  // initialize the module
  function init() {
    if(getWindowDimensions().width > config.breakPoint) {
      setHeight(elem);
    } else {
      resetHeight(elem);
    }
  }
  init();

  // TODO: set up recalculation on resize

  // set the height on the given element's children
  function setHeight(elems) {
    // loop through all of the selected elements
    for(var i = 0; i < elems.length; i++) {

      // get the max height of the element's children
      var height = getMaxHeight(elems[i]);

      // set the height of the element's children
      for(var j = 0; j < elems[i].children.length; j++) {
        elems[i].children[j].style.height = height + 'px';
      }
    }
  }

  // loop through a given element to get the height of it's tallest child element
  function getMaxHeight(elem) {
    var maxHeight = 0
    ,   children = elem.children;

    // loop through all of the children of the element
    for(var i = 0; i < children.length; i++) {

      children[i].style.height = '';

      var elemHeight = children[i].offsetHeight
      ,   elemStyle = getComputedStyle(children[i]);

      // if box-sizing: border-box is set, don't subtract the padding from
      // the height
      if(elemStyle.boxSizing !== 'border-box') {
        // remove padding top and bottom from the element height
        elemHeight = elemHeight -
          parseInt(elemStyle.paddingTop) -
          parseInt(elemStyle.paddingBottom);
      }

      // set the max height as it gets larger
      maxHeight = maxHeight > elemHeight ? maxHeight : elemHeight;
    }
    return maxHeight;
  }

}
