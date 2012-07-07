/*global window, jQuery */
var DebugOutputWindow = {
	
	init : function() {
		this.$debugOutputEl = jQuery( '#debugOutput' );
		this.$containerScrollerHeightVal = this.$debugOutputEl.find( '*[data-elem="containerScrollerHeightVal"]' );
		this.$containerScrollValEl = this.$debugOutputEl.find( '*[data-elem="containerScrollVal"]' );
		
		this.$articleHeightValEls = this.$debugOutputEl.find( '*[data-elem="articleHeightVal"]' );
		this.$articleContentContainerHeightValEls = this.$debugOutputEl.find( '*[data-elem="articleContentContainerHeightVal"]' );
		this.$articleContentHeightValEls = this.$debugOutputEl.find( '*[data-elem="articleContentHeightVal"]' );
		this.$articleCssTopValEls = this.$debugOutputEl.find( '*[data-elem="articleCssTopVal"]' );
		this.$articleScrollValEls = this.$debugOutputEl.find( '*[data-elem="articleScrollVal"]' );
		
		// Show the container's scroll value
		this.$containerScrollerEl = jQuery( '#scroller' );
		this.$containerScrollerEl.on( 'scroll', jQuery.proxy( this.onContainerScroll, this ) );
		this.onContainerScroll();
	},
	
	
	setArticles : function( articles ) {
		// Show the static values for the articles
		for( var i = 0, len = articles.length; i < len; i++ ) {
			this.$articleHeightValEls.eq( i ).html( articles[ i ].getHeight() );
			this.$articleContentContainerHeightValEls.eq( i ).html( articles[ i ].getContentContainerHeight() );
			this.$articleContentHeightValEls.eq( i ).html( articles[ i ].getContentHeight() );
		}
	},
	
	setScrollerHeight : function( height ) {
		this.$containerScrollerHeightVal.html( height );
	},
	
	
	onContainerScroll : function() {
		this.$containerScrollValEl.html( this.$containerScrollerEl.scrollTop() );
	},
	
	setArticleMarginTopVal : function( articleNum, val ) {
		this.$articleCssTopValEls.eq( articleNum ).html( val );
	},
	
	setArticleScrollVal : function( articleNum, scrollVal ) {
		this.$articleScrollValEls.eq( articleNum ).html( scrollVal );
	}
	
};