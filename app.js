/*global window, jQuery, Article, ArticleScrollManager, DebugOutputWindow */
jQuery( document ).ready( function() {
	
	DebugOutputWindow.init();
	
	var articles = [];
	jQuery( '.article' ).each( function( idx, el ) {
		articles.push( new Article( el ) );
	} );
	
	var scrollManager = new ArticleScrollManager( jQuery( '#wrapper' ), articles );
	scrollManager.setScrollTop( jQuery( window ).scrollTop() );
} );
