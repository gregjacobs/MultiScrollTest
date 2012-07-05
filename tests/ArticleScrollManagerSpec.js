/*global describe, beforeEach, it, expect, JsMockito, spyOn, Article, ArticleScrollManager */
/*jslint forin: true */
describe( 'ArticleScrollManager', function() {
	var articleScrollManager,
	    articles;
	
	
	beforeEach( function() {
		articles = [];
		
		var setMarginTop = function( val ) {
			this.marginTop = val;
		};
		var getMarginTop = function() {
			return this.marginTop;
		};
		var setScrollTop = function( val ) {
			this.scrollTop = val;
		};
		var getScrollTop = function() {
			return this.scrollTop;
		};
		
		for( var i = 0; i < 3; i++ ) {
			articles[ i ] = JsMockito.mock( Article );
			
			JsMockito.when( articles[ i ] ).getHeight().thenReturn( 100 );
			JsMockito.when( articles[ i ] ).getScrollHeight().thenReturn( 150 );
			JsMockito.when( articles[ i ] ).setMarginTop().then( setMarginTop );
			JsMockito.when( articles[ i ] ).getMarginTop().then( getMarginTop );
			JsMockito.when( articles[ i ] ).setScrollTop().then( setScrollTop );
			JsMockito.when( articles[ i ] ).getScrollTop().then( getScrollTop );
		}
		
		articleScrollManager = new ArticleScrollManager( document.createElement( 'div' ), articles );
	} );
	
	
	
	describe( "with equal scroll areas", function() {
		
		beforeEach( function() {
			for( var i = 0, len = articles.length; i < len; i++ ) {
				JsMockito.when( articles[ i ] ).getHeight().thenReturn( 100 );
				JsMockito.when( articles[ i ] ).getScrollHeight().thenReturn( 150 );
			}
		} );
		
		
		// The keys of this hashmap are the scroll values. Then inside those, the map's keys are the article index
		var expected = {
			0 : {
				0 : { marginTop: 0, innerScroll: 0 },
				1 : { marginTop: 100, innerScroll: 0 },
				2 : { marginTop: 200, innerScroll: 0 }
			},
			
			25 : {
				0 : { marginTop: 0, innerScroll: 25 },
				1 : { marginTop: 100, innerScroll: 0 },
				2 : { marginTop: 200, innerScroll: 0 }
			},
			
			50 : {
				0 : { marginTop: 0, innerScroll: 50 },
				1 : { marginTop: 100, innerScroll: 0 },
				2 : { marginTop: 200, innerScroll: 0 }
			},
			
			75 : {
				0 : { marginTop: -25, innerScroll: 50 },
				1 : { marginTop: 75, innerScroll: 0 },
				2 : { marginTop: 175, innerScroll: 0 }
			},
			
			100 : {
				0 : { marginTop: -50, innerScroll: 50 },
				1 : { marginTop: 50, innerScroll: 0 },
				2 : { marginTop: 150, innerScroll: 0 }
			},
			
			125 : {
				0 : { marginTop: -75, innerScroll: 50 },
				1 : { marginTop: 25, innerScroll: 0 },
				2 : { marginTop: 125, innerScroll: 0 }
			},
			
			150 : {
				0 : { marginTop: -100, innerScroll: 50 },
				1 : { marginTop: 0, innerScroll: 0 },
				2 : { marginTop: 100, innerScroll: 0 }
			},
			
			175 : {
				0 : { marginTop: -125, innerScroll: 50 },
				1 : { marginTop: 0, innerScroll: 25 },
				2 : { marginTop: 100, innerScroll: 0 }
			},
			
			200 : {
				0 : { marginTop: -150, innerScroll: 50 },
				1 : { marginTop: 0, innerScroll: 50 },
				2 : { marginTop: 100, innerScroll: 0 }
			},
			
			225 : {
				0 : { marginTop: -175, innerScroll: 50 },
				1 : { marginTop: -25, innerScroll: 50 },
				2 : { marginTop: 75, innerScroll: 0 }
			},
			
			250 : {
				0 : { marginTop: -200, innerScroll: 50 },
				1 : { marginTop: -50, innerScroll: 50 },
				2 : { marginTop: 50, innerScroll: 0 }
			},
			
			275 : {
				0 : { marginTop: -225, innerScroll: 50 },
				1 : { marginTop: -75, innerScroll: 50 },
				2 : { marginTop: 25, innerScroll: 0 }
			},
			
			300 : {
				0 : { marginTop: -250, innerScroll: 50 },
				1 : { marginTop: -100, innerScroll: 50 },
				2 : { marginTop: 0, innerScroll: 0 }
			},
			
			325 : {
				0 : { marginTop: -275, innerScroll: 50 },
				1 : { marginTop: -125, innerScroll: 50 },
				2 : { marginTop: 0, innerScroll: 25 }
			},
			
			350 : {
				0 : { marginTop: -300, innerScroll: 50 },
				1 : { marginTop: -150, innerScroll: 50 },
				2 : { marginTop: 0, innerScroll: 50 }
			}
		};
		
		// Create Tests from the expected values
		function createTest( scrollValue ) {
			describe( "when at " + scrollValue + " user scroll", function() {
				
				beforeEach( function() {
					articleScrollManager.setScrollTop( scrollValue );
				} );
				
				it( "should set the first article to the correct inner scroll and top margin", function() {
					expect( articles[ 0 ].getMarginTop() ).toBe( expected[ scrollValue ][ 0 ].marginTop );
					expect( articles[ 0 ].getScrollTop() ).toBe( expected[ scrollValue ][ 0 ].innerScroll );
				} );
				
				it( "should set the second article to the correct inner scroll and top margin", function() {
					expect( articles[ 1 ].getMarginTop() ).toBe( expected[ scrollValue ][ 1 ].marginTop );
					expect( articles[ 1 ].getScrollTop() ).toBe( expected[ scrollValue ][ 1 ].innerScroll );
				} );
				
				it( "should set the third article to the correct inner scroll and top margin", function() {
					expect( articles[ 2 ].getMarginTop() ).toBe( expected[ scrollValue ][ 2 ].marginTop );
					expect( articles[ 2 ].getScrollTop() ).toBe( expected[ scrollValue ][ 2 ].innerScroll );
				} );
			} );
		}
		
		for( var scrollValue in expected ) {
			createTest( scrollValue );
		}
	} );
	
	
	
	describe( "with random scroll areas", function() {
		
		beforeEach( function() {
			JsMockito.when( articles[ 0 ] ).getHeight().thenReturn( 100 );
			JsMockito.when( articles[ 0 ] ).getScrollHeight().thenReturn( 50 );
			
			JsMockito.when( articles[ 1 ] ).getHeight().thenReturn( 50 );
			JsMockito.when( articles[ 1 ] ).getScrollHeight().thenReturn( 100 );
			
			JsMockito.when( articles[ 2 ] ).getHeight().thenReturn( 100 );
			JsMockito.when( articles[ 2 ] ).getScrollHeight().thenReturn( 150 );
		} );
		
		
		// The keys of this hashmap are the scroll values. Then inside those, the map's keys are the article index
		var expected = {
			0 : {
				0 : { marginTop: 0, innerScroll: 0 },
				1 : { marginTop: 100, innerScroll: 0 },
				2 : { marginTop: 150, innerScroll: 0 }
			},
			
			25 : {
				0 : { marginTop: -25, innerScroll: 0 },
				1 : { marginTop: 75, innerScroll: 0 },
				2 : { marginTop: 125, innerScroll: 0 }
			},
			
			50 : {
				0 : { marginTop: -50, innerScroll: 0 },
				1 : { marginTop: 50, innerScroll: 0 },
				2 : { marginTop: 100, innerScroll: 0 }
			},
			
			75 : {
				0 : { marginTop: -75, innerScroll: 0 },
				1 : { marginTop: 25, innerScroll: 0 },
				2 : { marginTop: 75, innerScroll: 0 }
			},
			
			100 : {
				0 : { marginTop: -100, innerScroll: 0 },
				1 : { marginTop: 0, innerScroll: 0 },
				2 : { marginTop: 50, innerScroll: 0 }
			},
			
			125 : {
				0 : { marginTop: -125, innerScroll: 0 },
				1 : { marginTop: 0, innerScroll: 25 },
				2 : { marginTop: 50, innerScroll: 0 }
			},
			
			150 : {
				0 : { marginTop: -150, innerScroll: 0 },
				1 : { marginTop: 0, innerScroll: 50 },
				2 : { marginTop: 50, innerScroll: 0 }
			},
			
			175 : {
				0 : { marginTop: -175, innerScroll: 0 },
				1 : { marginTop: -25, innerScroll: 50 },
				2 : { marginTop: 25, innerScroll: 0 }
			},
			
			200 : {
				0 : { marginTop: -200, innerScroll: 0 },
				1 : { marginTop: -50, innerScroll: 50 },
				2 : { marginTop: 0, innerScroll: 0 }
			},
			
			225 : {
				0 : { marginTop: -225, innerScroll: 0 },
				1 : { marginTop: -75, innerScroll: 50 },
				2 : { marginTop: 0, innerScroll: 25 }
			},
			
			250 : {
				0 : { marginTop: -250, innerScroll: 0 },
				1 : { marginTop: -100, innerScroll: 50 },
				2 : { marginTop: 0, innerScroll: 50 }
			}
		};
		
		// Create Tests from the expected values
		function createTest( scrollValue ) {
			describe( "when at " + scrollValue + " user scroll", function() {
				
				beforeEach( function() {
					articleScrollManager.setScrollTop( scrollValue );
				} );
				
				it( "should set the first article to the correct inner scroll and top margin", function() {
					expect( articles[ 0 ].getMarginTop() ).toBe( expected[ scrollValue ][ 0 ].marginTop );
					expect( articles[ 0 ].getScrollTop() ).toBe( expected[ scrollValue ][ 0 ].innerScroll );
				} );
				
				it( "should set the second article to the correct inner scroll and top margin", function() {
					expect( articles[ 1 ].getMarginTop() ).toBe( expected[ scrollValue ][ 1 ].marginTop );
					expect( articles[ 1 ].getScrollTop() ).toBe( expected[ scrollValue ][ 1 ].innerScroll );
				} );
				
				it( "should set the third article to the correct inner scroll and top margin", function() {
					expect( articles[ 2 ].getMarginTop() ).toBe( expected[ scrollValue ][ 2 ].marginTop );
					expect( articles[ 2 ].getScrollTop() ).toBe( expected[ scrollValue ][ 2 ].innerScroll );
				} );
			} );
		}
		
		for( var scrollValue in expected ) {
			createTest( scrollValue );
		}
	} );
	
} );