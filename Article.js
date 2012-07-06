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
	
	
	setMarginTop : function( topVal ) {
		this.$el.css( 'margin-top', topVal );
	},
	
	getMarginTop : function( topVal ) {
		return this.$el.css( 'margin-top' );
	},
	
	
	setScrollTop : function( scrollTop ) {
		this.$el.scrollTop( scrollTop );
	},
	
	getScrollTop : function( scrollTop ) {
		this.$el.scrollTop();
	}
	
};
