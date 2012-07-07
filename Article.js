/*global window, jQuery */
var Article = function( el ) {
	this.$el = jQuery( el );
};

Article.prototype = {
	constructor : Article,
	
	getHeight : function() {
		return this.$el.height();
	},
	
	getScrollHeight : function() {
		return this.$el.find( '.article-inner' ).height();
	},
	
	
	setTop : function( topVal ) {
		this.$el.css( 'top', topVal );
	},
	
	getTop : function( topVal ) {
		return this.$el.css( 'top' );
	},
	
	
	setScrollTop : function( scrollTop ) {
		this.$el.scrollTop( scrollTop );
	},
	
	getScrollTop : function( scrollTop ) {
		this.$el.scrollTop();
	}
	
};
