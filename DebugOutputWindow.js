/*global window, jQuery */
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