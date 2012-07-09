/*global window, jQuery */
var Utils = new function() {
	
	var uA = window.navigator.userAgent.toLowerCase();
	this.isIE = /msie/.test( uA ) && !( /opera/.test( uA ) );
	
	
	/**
	 * Retrieves the sizes of the scrollbars used on the current browser. This can differ
	 * depending on browser, operating system, or even different accessibility settings.
	 * 
	 * @method getScrollbarSizes
	 * @return {Object} An object containing the scrollbar sizes.
	 * @return {Number} return.width The width of the vertical scrollbar.
	 * @return {Number} return.height The height of the vertical scrollbar.
	 */
	this.getScrollbarSizes = (function() {
		var scrollbarSizes;
		
		return function() {
			if( !scrollbarSizes ) {
				var $div = jQuery( '<div style="position:absolute;width:100px;height:100px;overflow:scroll;top:-9999px;" />' ),
				    div = $div[ 0 ];
				
				$div.appendTo( 'body' );  // so we can measure it
				
				scrollbarSizes = {
					width  : div.offsetWidth - div.clientWidth,
					height : div.offsetHeight - div.clientHeight
				};
				
				$div.remove();
			}
				
			return scrollbarSizes;
		};
	})();
	
	
	/**
	 * Retrieves the width of the browser's vertical scrollbar. See {@link #getScrollbarSizes} for 
	 * more details.
	 * 
	 * @method getScrollbarWidth
	 * @return {Number} The width of the browser's vertical scrollbar.
	 */
	this.getScrollbarWidth = function() {
		return this.getScrollbarSizes().width;
	};
	
	
	/**
	 * Retrieves the height of the browser's horizontal scrollbar. See {@link #getScrollbarSizes} for 
	 * more details.
	 * 
	 * @method getScrollbarHeight
	 * @return {Number} The height of the browser's horizontal scrollbar.
	 */
	this.getScrollbarHeight = function() {
		return this.getScrollbarSizes().height;
	};
	
}();