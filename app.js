/*global window, jQuery, Article, ArticleScrollManager, DebugOutputWindow */
jQuery( document ).ready( function() {
	
	DebugOutputWindow.init();
	
	var $containerEl = jQuery( '#container' ),
	    $scrollerEl = jQuery( '#scroller' ),
	    $scrollerHeightEl = jQuery( '#scrollerHeightEl' ),
	    articles = [],
	    scrollManager;
	    
	jQuery( '*[data-elem="article"]' ).each( function( idx, el ) {
		articles.push( new Article( el, $containerEl ) );
	} );
	
	scrollManager = new ArticleScrollManager( $containerEl, $scrollerEl, $scrollerHeightEl, articles );
	scrollManager.setScrollTop( $scrollerEl.scrollTop() );
	
	// Show debugging output for certain things, after all initialization
	DebugOutputWindow.setArticles( articles );
	DebugOutputWindow.setScrollerHeight( $scrollerHeightEl.height() );
} );
