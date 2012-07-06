/*global window, jQuery, Article, ArticleScrollManager, DebugOutputWindow */
jQuery( document ).ready( function() {
	
	DebugOutputWindow.init();
	
	var $containerEl = jQuery( '#container' ),
	    $scrollerEl = jQuery( '#scroller' ),
	    $scrollerHeightEl = jQuery( '#scrollerHeightEl' ),
	    containerElWidth = $containerEl.width(),
	    containerElHeight = $containerEl.height(),
	    articles = [],
	    scrollManager;
	    
	jQuery( '.article' ).each( function( idx, el ) {
		// Size each article to the size of the container element
		jQuery( el ).css( {
			width : containerElWidth + 'px',
			height : containerElHeight + 'px'
		} );
		
		articles.push( new Article( el ) );
	} );
	
	scrollManager = new ArticleScrollManager( $scrollerEl, $scrollerHeightEl, articles );
	scrollManager.setScrollTop( $scrollerEl.scrollTop() );
} );
