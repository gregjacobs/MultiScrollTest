/*global window, jQuery */
var DebugOutputWindow = {
	
	init : function() {
		this.$debugOutputEl = jQuery( '#debugOutput' );
		this.$containerScrollValEl = this.$debugOutputEl.find( '.containerScrollVal' );
		this.$articleMarginTopValEls = this.$debugOutputEl.find( '.articleMarginTopVal' );
		this.$articleScrollValEls = this.$debugOutputEl.find( '.articleScrollVal' );
		
		this.$containerScrollerEl = jQuery( '#scroller' );
		
		this.$containerScrollerEl.on( 'scroll', jQuery.proxy( this.onContainerScroll, this ) );
		this.onContainerScroll();
	},
	
	
	onContainerScroll : function() {
		this.$containerScrollValEl.html( this.$containerScrollerEl.scrollTop() );
	},
	
	setArticleMarginTopVal : function( articleNum, val ) {
		this.$articleMarginTopValEls.eq( articleNum ).html( val );
	},
	
	setArticleScrollVal : function( articleNum, scrollVal ) {
		this.$articleScrollValEls.eq( articleNum ).html( scrollVal );
	}
	
};