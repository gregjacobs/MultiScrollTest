/*global window, jQuery */
var Article = function( el ) {
	this.$el = jQuery( el );
	
	jQuery( window ).on( 'resize', jQuery.proxy( this.resize, this ) );
	this.resize();
};

Article.prototype = {
	constructor : Article,
	
	getHeight : function() {
		return this.$el.height();
	},
	
	getScrollHeight : function() {
		return this.$el.find( '.article-inner' ).height();
	},
	
	resize : function() {
		var $window = jQuery( window );
		this.$el.css( {
			width : $window.width() + 'px',
			height : $window.height() + 'px'
		} );
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
