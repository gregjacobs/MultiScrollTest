/*global window, jQuery, DebugOutputWindow */
/*jslint plusplus:true, undef:false, vars:true */
var ArticleScrollManager = function( $scrollerEl, $scrollerHeightEl, articles ) {
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
	}
	
};