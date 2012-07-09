/*global window, jQuery, Utils, DebugOutputWindow */
/*jslint plusplus:true, undef:false, vars:true */
var ArticleScrollManager = function( $containerEl, $scrollerEl, $scrollerHeightEl, articles ) {
	this.$containerEl = $containerEl;
	this.$scrollerEl = $scrollerEl;
	this.$scrollerHeightEl = $scrollerHeightEl;
	this.articles = articles;
	
	
	// The full scroller height should be the height of each article, plus the excess scroll height inside each
	var scrollerHeight = 0,
	    i, len;
	
	for( i = 0, len = articles.length; i < len; i++ ) {
		scrollerHeight += articles[ i ].getHeight() + articles[ i ].getContentScrollableHeight(); 
	}
	this.$scrollerHeightEl.css( 'height', scrollerHeight + 'px' );
	
	
	// Set up the scroll handler on the "virtual scroller" element, so that we can manually "scroll"
	// the outer/inner area of the articles and their content
	this.$scrollerEl.on( 'scroll', jQuery.proxy( this.onScroll, this ) );
	
	// Set the scroller element to start scrolling when the user mousewheels (done through the $containerEl)
	this.$containerEl.on( 'mousewheel', jQuery.proxy( this.onMouseWheel, this ) );
	
	// Handle mousemove to re-enable pointer events for the scrollbar on Firefox
	this.$containerEl.on( 'mousemove', jQuery.proxy( this.onMouseMove, this ) );
};


ArticleScrollManager.prototype = {
	constructor : ArticleScrollManager,
	
	
	/**
	 * @protected
	 * @property {jQuery} $containerEl
	 * 
	 * The element that holds all of the Articles. 
	 */
	
	/**
	 * @protected
	 * @property {Article[]} articles
	 * 
	 * The Article instances, one for each article that is to be managed by the scroll manager to
	 * perform the correct "outer/inner" multiscroll of each (handled by {@link #setScrollTop}.
	 */
	
	
	
	/**
	 * Handles when the user mousewheel's over the {@link #$containerEl}. When the user does this, we restore
	 * 'pointer-events' on the overlaying {@link #$scrollerEl}, to allow for the usual scrolling behavior that 
	 * the mousewheel would provide. This allows the user to scroll the content.
	 * 
	 * Then, after a short timeout of no mousewheeling, we remove 'pointer-events' again, to allow the user to 
	 * click through to the underlying content again. This allows them to click links, select the text, etc.
	 * 
	 * @protected
	 * @method onMouseWheel
	 * @param {jQuery.Event} evt
	 */
	onMouseWheel : function( evt ) {
		if( this.pointerEventsResetTimer ) {
			clearTimeout( this.pointerEventsResetTimer );
		}
		
		// On mouse wheel, give pointer events back to the scroller element
		// so that it can scroll
		this.enableScrollerPointerEvents();
		
		
		// Set a timeout to then remove pointer events after a short time, so that the
		// user can click through again.
		this.pointerEventsResetTimer = setTimeout( jQuery.proxy( function() {
			this.disableScrollerPointerEvents();
		}, this ), 150 );
	},
	
	
	/**
	 * Handles a move to the mouse over the {@link #$containerEl}. When the mouse is over the right
	 * side of the container, where the scrollbar is present, we re-enable pointer events so that
	 * the user can actually touch the scrollbar. This is currently only an issue for Firefox.
	 * 
	 * @protected
	 * @method onMouseMove
	 * @param {jQuery.Event} evt
	 */
	onMouseMove : function( evt ) {
		var scrollbarWidth = Utils.getScrollbarWidth(),
		    containerElOffset = this.$containerEl.offset(),
		    containerElWidth = this.$containerEl.width(),
		    withinScrollbarArea = evt.pageX > ( containerElOffset.left + containerElWidth - scrollbarWidth );  // note: we don't have to check the right-side bound because the mouse events will stop if the mouse leaves the element
		
		if( withinScrollbarArea ) {
			this.enableScrollerPointerEvents();
		} else {
			this.disableScrollerPointerEvents();
		}
	},
	
	
	/**
	 * Utility method to enable pointer-events on the {@link #$scrollerEl}.
	 * 
	 * @protected
	 * @method enableScrollerPointerEvents
	 */
	enableScrollerPointerEvents : function() {
		this.$scrollerEl.css( 'pointer-events', 'auto' );
		
		if( Utils.isIE ) {
			// Put in a 1x1 transparent gif for the background image. This makes IE capture pointer events on the element (notably the mousewheel
			// event that we want!) while also leaving the scrollbar in place. If we used opacity:0, or filter:alpha(opacity=0) with an actual
			// background, it would end up hiding the scrollbar.
			this.$scrollerEl.css( 'background-image', 'url(data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==)' );
		}
	},
	
	
	/**
	 * Utility method to disable pointer-events on the {@link #$scrollerEl}.
	 * 
	 * @protected
	 * @method disableScrollerPointerEvents
	 */
	disableScrollerPointerEvents : function() {
		this.$scrollerEl.css( 'pointer-events', 'none' );
		
		if( Utils.isIE ) {
			this.$scrollerEl.css( 'background-image', 'none' );  // Remove the transparent background image
		}
	},
	
	
	// --------------------------------
	
	
	/**
	 * Handles when the user scrolls the content. Calls {@link #setScrollTop} to fix the content with
	 * the new scroll value.
	 * 
	 * @protected
	 * @method onScroll
	 * @param {jQuery.Event} evt
	 */
	onScroll : function( evt ) {
		this.setScrollTop( this.$scrollerEl.scrollTop() );
	},
	
	
	/**
	 * Sets the top scroll value that the ArticleScrollManager should scroll to. This is the method that performs the
	 * actual routine of setting the "outer/inner" scroll on each of the {@link #articles}.
	 * 
	 * The calculations for any given article(n) are as follows:
	 * 
	 *                                        n-1          n-1
	 *     innerScroll = max( min( scrollTop - Σ( |top| ) - Σ( innerScroll ), scrollableHeight ), 0 )
	 *                n                       i=0     i    i=0            i                   n
	 * 
	 *                            n-1           n-1
	 *     top = max( -scrollTop + Σ( height ) + Σ( innerScroll ) + innerScroll, -height )
	 *        n                   i=0       i   i=0            i               n
	 * 
	 * The innerScroll of any Article is bound between 0 and the available scrollable height (which is what
	 *   the max/min calls handle).
	 * The CSS top value of any Article maxes out at its -height. So if it is 100px tall, its
	 *   top value will only ever be set as high as -100px.
	 * 
	 * @method setScrollTop
	 * @param {Number} scrollTop
	 */
	setScrollTop : function( scrollTop ) {
		scrollTop = Math.max( scrollTop, 0 );  // Don't let the scrollTop go negative (for Mac, which will allow you to scroll up past the top)
		
		var articles = this.articles,
		    totalPreviousArticlesTop = 0,
		    totalPreviousArticlesInnerScroll = 0,
		    totalPreviousArticlesHeight = 0,
		    max = Math.max,
		    min = Math.min;
		
		for( var i = 0, len = articles.length; i < len; i++ ) {
			var currentArticle = articles[ i ],
			    articleHeight = currentArticle.getHeight(),
			    articleScrollableHeight = currentArticle.getContentScrollableHeight(),
			    
			    innerScroll = max( min( scrollTop - totalPreviousArticlesTop - totalPreviousArticlesInnerScroll, articleScrollableHeight ), 0 ),
			    top = max( -scrollTop + totalPreviousArticlesHeight + totalPreviousArticlesInnerScroll + innerScroll, -articleHeight );
			
			currentArticle.setScrollTop( innerScroll );
			currentArticle.setTop( top );
			
			// Add the current values to the "previous values" sum (for use in the formulas)
			totalPreviousArticlesTop += Math.abs( top );
			totalPreviousArticlesInnerScroll += innerScroll;
			totalPreviousArticlesHeight += articleHeight;
			
			
			// Debugging Output
			DebugOutputWindow.setArticleScrollVal( i, innerScroll );
			DebugOutputWindow.setArticleMarginTopVal( i, top );
		}
	}
	
};