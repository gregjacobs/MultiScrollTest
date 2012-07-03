/*global window, jQuery, Class */
var DebugOutputWindow = {
	
	init : function() {
		this.$debugOutputEl = jQuery( '#debugOutput' );
		this.$windowScrollValEl = this.$debugOutputEl.find( '.windowScrollVal' );
		this.$articleMarginTopValEls = this.$debugOutputEl.find( '.articleMarginTopVal' );
		this.$articleScrollValEls = this.$debugOutputEl.find( '.articleScrollVal' );
		
		jQuery( window ).on( 'scroll', jQuery.proxy( this.onWindowScroll, this ) );
		this.onWindowScroll();
	},
	
	
	onWindowScroll : function() {
		this.$windowScrollValEl.html( jQuery( window ).scrollTop() );
	},
	
	setArticleMarginTopVal : function( articleNum, val ) {
		this.$articleMarginTopValEls.eq( articleNum ).html( val );
	},
	
	setArticleScrollVal : function( articleNum, scrollVal ) {
		this.$articleScrollValEls.eq( articleNum ).html( scrollVal );
	}
	
};



var Article = Class( {
	
	constructor : function( el ) {
		this.$el = jQuery( el );
		
		jQuery( window ).on( 'resize', jQuery.proxy( this.resize, this ) );
		this.resize();
	},
	
	getHeight : function() {
		return this.$el.height();
	},
	
	getScrollHeight : function() {
		return this.$el.find( '.article-inner' ).height();
	},
	
	resize : function() {
		/*var $window = jQuery( window );
		this.$el.css( {
			width : $window.width() + 'px',
			height : $window.height() + 'px'
		} );*/
	},
	
	setMarginTop : function( topVal ) {
		this.$el.css( 'margin-top', topVal );
	},
	
	setScrollTop : function( scrollTop ) {
		this.$el.scrollTop( scrollTop );
	}
	
} );


var ArticleScrollManager = Class( { 
	
	constructor : function( wrapperEl, articles ) {
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
		
		this.setScrollTop( this.$window.scrollTop() );
	},
	
	
	onWrapperScroll : function( evt ) {
		this.setScrollTop( this.$window.scrollTop() );
	},
	
	
	setScrollTop : function( scrollTop ) {
		scrollTop = Math.max( scrollTop, 0 );  // Don't let the scrollTop go negative (for Mac, which will allow you to scroll up past the top)
		var articles = this.articles,
		    totalPreviousArticlesHeight = 0,
		    totalPreviousArticlesScrollHeight = 0;
		
		for( var i = 0, len = articles.length; i < len; i++ ) {
			var articleHeight = articles[ i ].getHeight(),
			    articleScrollHeight = articles[ i ].getScrollHeight(),
			    innerScrollArea = articleScrollHeight - articleHeight,
			    innerScrollTop;
			
			// Set the inner Article scroll top value
			if( scrollTop - totalPreviousArticlesScrollHeight < 0 ) {
				innerScrollTop = 0;
			} else if( scrollTop - totalPreviousArticlesScrollHeight > innerScrollArea ) {
				innerScrollTop = innerScrollArea;
			} else {
				innerScrollTop = scrollTop - totalPreviousArticlesScrollHeight;
			}
			
			articles[ i ].setScrollTop( innerScrollTop );
			DebugOutputWindow.setArticleScrollVal( i, innerScrollTop );
			
			
			// Set the outer Article margin-top value
			
			var newMarginTop = innerScrollTop - scrollTop + totalPreviousArticlesHeight;
			articles[ i ].setMarginTop( newMarginTop );
			DebugOutputWindow.setArticleMarginTopVal( i, newMarginTop );
			
			totalPreviousArticlesHeight += articles[ i ].getHeight();
			totalPreviousArticlesScrollHeight += articles[ i ].getScrollHeight();
		}
	}
	
} );



jQuery( document ).ready( function() {
	
	DebugOutputWindow.init();
	
	var articles = [];
	jQuery( '.article' ).each( function( idx, el ) {
		articles.push( new Article( el ) );
	} );
	
	var scrollManager = new ArticleScrollManager( jQuery( '#wrapper' ), articles );
	
} );


