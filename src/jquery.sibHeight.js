/**
* @license
* jquery.sibHeight.js v0.1.0
* https://github.com/stevenorell/sibHeight
* License: MIT
*/
;(function ( $, window, document, undefined ) {

// Create the defaults once
var pluginName = "sibHeight",
	defaults = {
		breakPoint: 768
	};

// The actual plugin constructor
function Plugin ( element, options ) {
	this.element = element;

	this.options = $.extend( {}, defaults, options );
	this._defaults = defaults;
	this._name = pluginName;
	this.init();
	this.resize();
}

Plugin.prototype = {
	init: function () {

		// set our initial variables
		var $siblings = $(this.element.children);

		// remove the element's height to allow recalculation
		$siblings.css('height', '');

		// set the element's height if bigger than the breakpoint
		if($(window).width() > parseInt(this.options.breakPoint)) {
			$siblings.css('height', this.getMaxHeight(this.element.children));
		}

	},
	getMaxHeight: function(elements) {
		// return the tallest element from the set of given elements
		var maxHeight = 0;

		$(elements).each(function(){
			var $this = $(this),
				elemHeight;

			// check for border-box and get the appropriate height
			// TODO: make this work for a mix of non- and border-box elements
			if($this.css('box-sizing') == 'border-box') {
				elemHeight = $this.outerHeight();
			} else {
				elemHeight = $this.height();
			}

			maxHeight = maxHeight > elemHeight ? maxHeight : elemHeight;
		});

		return maxHeight;
	},
	resize: function() {
		var self = this;
		$(window).resize(function(){
			self.init();
		});
	}
};

$.fn[ pluginName ] = function ( options ) {
	return this.each(function() {
		if ( !$.data( this, "plugin_" + pluginName ) ) {
			$.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
		}
	});
};

})( jQuery, window, document );
