/*global window, jQuery */
var Article = function( el ) {
	this.$el = jQuery( el );

	this.$contentContainerEl = this.$el.find( '*[data-elem="contentContainer"]' );
	this.$contentEl = this.$contentContainerEl.find( '*[data-elem="content"]' );
};

Article.prototype = {
	constructor : Article,
	
	
	/**
	 * @protected
	 * @property {jQuery} $el
	 * 
	 * The Article's element itself. 
	 */
	
	/**
	 * @protected
	 * @property {jQuery} $contentContainerEl
	 * 
	 * The element which holds the scrollable content, and bounds it to a specific size. Its first (and only) 
	 * child element should be the {@link #$contentEl}.
	 */
	
	/**
	 * @protected
	 * @property {jQuery} $contentEl
	 * 
	 * The element which holds the actual content of the Article. This element is scrolled by the
	 * {@link #$contentContainerEl}. 
	 */
	
	
	// ------------------------------
	
	
	/**
	  * Retrieves the height of the Article element.
	  * 
	  * @method getHeight
	  * @return {Number}
	  */
	getHeight : function() {
		return this.$el.height();
	},
	
	
	/**
	 * Retrieves the height of the {@link #$contentContainerEl}, which bounds the content
	 * to a specific size, and scrolls the content held by the {@link #$contentEl}.
	 * 
	 * @method getContentContainerHeight
	 * @return {Number}
	 */
	getContentContainerHeight : function() {
		return this.$contentContainerEl.height();
	},
	
	
	/**
	 * Retrieves the height of the {@link #$contentEl}, which holds the content
	 * itself. This will be the exact height of the content.
	 * 
	 * @getContentHeight
	 * @return {Number}
	 */
	getContentHeight : function() {
		return this.$contentEl.height();
	},
	
	
	/**
	 * Retrieves the scrollable height of the {@link #$contentEl content} inside the 
	 * {@link #$contentContainerEl content container}. 
	 * 
	 * This method returns how many pixels are actually scrollable inside the 
	 * {@link #$contentContainerEl content container}. 
	 * 
	 * - If the {@link #$contentEl content} is taller than the {@link #$contentContainerEl content container},
	 *   then the difference between the height of the content and the content container will be returned.
	 *   Example: 150 content height with a 100 content container height will cause this method to return 50.
	 * - If the {@link #$contentEl content} is shorter than the {@link #$contentContainerEl content container}, 
	 *   then this method will return 0. 
	 * 
	 * @method getContentScrollableHeight
	 * @return {Number}
	 */
	getContentScrollableHeight : function() {
		return Math.max( this.getContentHeight() - this.getContentContainerHeight(), 0 );
	},
	
	
	// ------------------------------
	
	
	/**
	 * Sets the CSS `top` value of the Article's element.
	 * 
	 * @method setTop
	 * @param {Number} topVal
	 */
	setTop : function( topVal ) {
		this.$el.css( 'top', topVal );
	},
	
	
	/**
	 * Retrieves the CSS `top` value of the Article's element, converted to a number (i.e. the 'px' is stripped off).
	 * 
	 * @method setTop
	 * @return {Number}
	 */
	getTop : function( topVal ) {
		return parseInt( this.$el.css( 'top' ), 10 );
	},
	
	
	// ------------------------------
	
	
	/**
	 * Sets the scrollTop value of the {@link #$contentContainerEl}.
	 * 
	 * @method setScrollTop
	 * @param {Number} scrollTop
	 */
	setScrollTop : function( scrollTop ) {
		this.$contentContainerEl.scrollTop( scrollTop );
	},
	
	
	/**
	 * Retrieves the current scrollTop value of the {@link #$contentContainerEl}.
	 * 
	 * @method getScrollTop
	 * @return {Number}
	 */
	getScrollTop : function( scrollTop ) {
		this.$contentContainerEl.scrollTop();
	}
	
};
