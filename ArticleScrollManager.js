/*global window, jQuery, DebugOutputWindow */
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
	
	
	// Pass-through any mouse events on the scroller element overlay to the element under it. They will
	// bubble up to the $containerEl, but really be fired on the $scrollerEl. However, when we hide the
	// $scrollerEl, the $containerEl will still tell us when its mouseleave event happens
	this.$containerEl.on( 'click dblclick mousedown mouseup mouseover mouseout contextmenu mouseenter mouseleave', 
		jQuery.proxy( this.onScrollerMouseEvent, this ) );
	
	this.$containerEl.on( 'mousewheel', jQuery.proxy( this.onMouseWheel, this ) );
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
		this.$scrollerEl.css( 'pointer-events', 'auto' );
		this.$scrollerEl.css( 'background-color', 'white' );  // for IE
		
		// Set a timeout to then remove pointer events after a short time, so that the
		// user can click through again.
		this.pointerEventsResetTimer = setTimeout( jQuery.proxy( function() {
			this.$scrollerEl.css( 'pointer-events', 'none' );
			this.$scrollerEl.css( 'background-color', '' );  // for IE
		}, this ), 150 );
	},
	
	
	
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
	 * @method setScrollTop
	 * @param {Number} scrollTop
	 */
	setScrollTop : function( scrollTop ) {
		scrollTop = Math.max( scrollTop, 0 );  // Don't let the scrollTop go negative (for Mac, which will allow you to scroll up past the top)
		
		var articles = this.articles,
		    totalPreviousArticlesScrollHeight = 0,
		    previousArticleHeight = 0,
		    lastMarginTop = -scrollTop;
		
		for( var i = 0, len = articles.length; i < len; i++ ) {
			var articleHeight = articles[ i ].getHeight(),
			    articleScrollHeight = articles[ i ].getContentHeight(),
			    excessInnerScrollHeight = Math.max( articleScrollHeight - articleHeight, 0 ),   // Don't let this go negative
			    innerScrollTop,
			    top;
			
			// Set the inner Article scroll top value
			if( scrollTop - totalPreviousArticlesScrollHeight < 0 ) {
				innerScrollTop = 0;
			} else if( scrollTop - totalPreviousArticlesScrollHeight > excessInnerScrollHeight ) {
				innerScrollTop = excessInnerScrollHeight;
			} else {
				innerScrollTop = scrollTop - totalPreviousArticlesScrollHeight;
			}
			articles[ i ].setScrollTop( innerScrollTop );
			
			
			// Set the outer Article top value
			top = previousArticleHeight + lastMarginTop + innerScrollTop;
			articles[ i ].setTop( top );
			
			
			// Debugging Output
			DebugOutputWindow.setArticleScrollVal( i, innerScrollTop );
			DebugOutputWindow.setArticleMarginTopVal( i, top );
			
			totalPreviousArticlesScrollHeight += Math.max( articleHeight, articleScrollHeight );
			
			previousArticleHeight = articleHeight;
			lastMarginTop = top;
		}
	}
	
};