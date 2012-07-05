/*global window, jQuery, DebugOutputWindow */
var ArticleScrollManager = function( wrapperEl, articles ) {
	this.$wrapperEl = jQuery( wrapperEl );
	this.articles = articles;
	
	this.$window = jQuery( window );
	
	
	this.$wrapperEl.css( 'height', jQuery( window ).height() );
	
	var wrapperScrollHeight = 0;
	for( var i = 0, len = articles.length; i < len; i++ ) {
		//console.log( 'Article ' + i + '  height: ', articles[ i ].getHeight(), '  scroll height: ', articles[ i ].getScrollHeight() );
		wrapperScrollHeight += Math.max( articles[ i ].getHeight(), articles[ i ].getScrollHeight() ); 
	}
	
	//console.log( 'setting wrapper scroll height to: ', wrapperScrollHeight );
	this.$wrapperEl.css( 'height', wrapperScrollHeight + 'px' );
	
	
	//this.$wrapperEl.on( 'scroll', jQuery.proxy( this.onWrapperScroll, this ) );  -- this one is not working... the window scroll is being used instead. need to figure out
	jQuery( window ).on( 'scroll', jQuery.proxy( this.onWrapperScroll, this ) );
	
	//this.setScrollTop( this.$window.scrollTop() );  -- done from outside the class now
};


ArticleScrollManager.prototype = {
	constructor : ArticleScrollManager,
	
	
	onWrapperScroll : function( evt ) {
		this.setScrollTop( this.$window.scrollTop() );
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