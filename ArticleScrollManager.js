/*global window, jQuery, DebugOutputWindow */
/*jslint plusplus:true, undef:false, vars:true */
var ArticleScrollManager = function( $containerEl, $scrollerEl, $scrollerHeightEl, articles ) {
	this.$containerEl = $containerEl;
	this.$scrollerEl = $scrollerEl;
	this.$scrollerHeightEl = $scrollerHeightEl;
	this.articles = articles;
	
	var scrollerHeight = 0,
	    i, len;
	    
	for( i = 0, len = articles.length; i < len; i++ ) {
		//console.log( 'Article ' + i + '  height: ', articles[ i ].getHeight(), '  scroll height: ', articles[ i ].getScrollHeight() );
		scrollerHeight += Math.max( articles[ i ].getHeight(), articles[ i ].getScrollHeight() ); 
	}
	
	//console.log( 'setting scroller height element to: ', scrollerHeight );
	this.$scrollerHeightEl.css( 'height', scrollerHeight + 'px' );
	
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
	
	
	onScroll : function( evt ) {
		this.setScrollTop( this.$scrollerEl.scrollTop() );
	},
	
	
	setScrollTop : function( scrollTop ) {
		scrollTop = Math.max( scrollTop, 0 );  // Don't let the scrollTop go negative (for Mac, which will allow you to scroll up past the top)
		var articles = this.articles,
		    totalPreviousArticlesScrollHeight = 0,
		    previousArticleHeight = 0,
		    lastMarginTop = -scrollTop;
		
		for( var i = 0, len = articles.length; i < len; i++ ) {
			var articleHeight = articles[ i ].getHeight(),
			    articleScrollHeight = articles[ i ].getScrollHeight(),
			    excessInnerScrollHeight = Math.max( articleScrollHeight - articleHeight, 0 ),   // Don't let this go negative
			    innerScrollTop,
			    marginTop;
			
			// Set the inner Article scroll top value
			if( scrollTop - totalPreviousArticlesScrollHeight < 0 ) {
				innerScrollTop = 0;
			} else if( scrollTop - totalPreviousArticlesScrollHeight > excessInnerScrollHeight ) {
				innerScrollTop = excessInnerScrollHeight;
			} else {
				innerScrollTop = scrollTop - totalPreviousArticlesScrollHeight;
			}
			articles[ i ].setScrollTop( innerScrollTop );
			
			
			// Set the outer Article margin-top value
			marginTop = previousArticleHeight + lastMarginTop + innerScrollTop;
			articles[ i ].setMarginTop( marginTop );
			
			
			// Debugging Output
			DebugOutputWindow.setArticleScrollVal( i, innerScrollTop );
			DebugOutputWindow.setArticleMarginTopVal( i, marginTop );
			
			totalPreviousArticlesScrollHeight += Math.max( articleHeight, articleScrollHeight );
			
			previousArticleHeight = articleHeight;
			lastMarginTop = marginTop;
		}
	},
	
	
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
	}
	
};