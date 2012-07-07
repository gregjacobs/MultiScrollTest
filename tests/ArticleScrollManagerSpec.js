/*global describe, beforeEach, it, expect, JsMockito, spyOn, Article, ArticleScrollManager */
/*jslint forin: true, vars: true */
describe( 'ArticleScrollManager', function() {
	var articleScrollManager,
	    articles;
	
	
	beforeEach( function() {
		articles = [];
		
		var setTop = function( val ) {
			this.top = val;
		};
		var getTop = function() {
			return this.top;
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
			JsMockito.when( articles[ i ] ).setTop().then( setTop );
			JsMockito.when( articles[ i ] ).getTop().then( getTop );
			JsMockito.when( articles[ i ] ).setScrollTop().then( setScrollTop );
			JsMockito.when( articles[ i ] ).getScrollTop().then( getScrollTop );
		}
		
		articleScrollManager = new ArticleScrollManager( jQuery( '<div />' ), jQuery( '<div />' ), jQuery( '<div />' ), articles );
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
				0 : { top: 0, innerScroll: 0 },
				1 : { top: 100, innerScroll: 0 },
				2 : { top: 200, innerScroll: 0 }
			},
			
			25 : {
				0 : { top: 0, innerScroll: 25 },
				1 : { top: 100, innerScroll: 0 },
				2 : { top: 200, innerScroll: 0 }
			},
			
			50 : {
				0 : { top: 0, innerScroll: 50 },
				1 : { top: 100, innerScroll: 0 },
				2 : { top: 200, innerScroll: 0 }
			},
			
			75 : {
				0 : { top: -25, innerScroll: 50 },
				1 : { top: 75, innerScroll: 0 },
				2 : { top: 175, innerScroll: 0 }
			},
			
			100 : {
				0 : { top: -50, innerScroll: 50 },
				1 : { top: 50, innerScroll: 0 },
				2 : { top: 150, innerScroll: 0 }
			},
			
			125 : {
				0 : { top: -75, innerScroll: 50 },
				1 : { top: 25, innerScroll: 0 },
				2 : { top: 125, innerScroll: 0 }
			},
			
			150 : {
				0 : { top: -100, innerScroll: 50 },
				1 : { top: 0, innerScroll: 0 },
				2 : { top: 100, innerScroll: 0 }
			},
			
			175 : {
				0 : { top: -125, innerScroll: 50 },
				1 : { top: 0, innerScroll: 25 },
				2 : { top: 100, innerScroll: 0 }
			},
			
			200 : {
				0 : { top: -150, innerScroll: 50 },
				1 : { top: 0, innerScroll: 50 },
				2 : { top: 100, innerScroll: 0 }
			},
			
			225 : {
				0 : { top: -175, innerScroll: 50 },
				1 : { top: -25, innerScroll: 50 },
				2 : { top: 75, innerScroll: 0 }
			},
			
			250 : {
				0 : { top: -200, innerScroll: 50 },
				1 : { top: -50, innerScroll: 50 },
				2 : { top: 50, innerScroll: 0 }
			},
			
			275 : {
				0 : { top: -225, innerScroll: 50 },
				1 : { top: -75, innerScroll: 50 },
				2 : { top: 25, innerScroll: 0 }
			},
			
			300 : {
				0 : { top: -250, innerScroll: 50 },
				1 : { top: -100, innerScroll: 50 },
				2 : { top: 0, innerScroll: 0 }
			},
			
			325 : {
				0 : { top: -275, innerScroll: 50 },
				1 : { top: -125, innerScroll: 50 },
				2 : { top: 0, innerScroll: 25 }
			},
			
			350 : {
				0 : { top: -300, innerScroll: 50 },
				1 : { top: -150, innerScroll: 50 },
				2 : { top: 0, innerScroll: 50 }
			}
		};
		
		// Create Tests from the expected values
		function createTest( scrollValue ) {
			describe( "when at " + scrollValue + " user scroll", function() {
				
				beforeEach( function() {
					articleScrollManager.setScrollTop( scrollValue );
				} );
				
				it( "should set the first article to the correct inner scroll and top margin", function() {
					expect( articles[ 0 ].getTop() ).toBe( expected[ scrollValue ][ 0 ].top );
					expect( articles[ 0 ].getScrollTop() ).toBe( expected[ scrollValue ][ 0 ].innerScroll );
				} );
				
				it( "should set the second article to the correct inner scroll and top margin", function() {
					expect( articles[ 1 ].getTop() ).toBe( expected[ scrollValue ][ 1 ].top );
					expect( articles[ 1 ].getScrollTop() ).toBe( expected[ scrollValue ][ 1 ].innerScroll );
				} );
				
				it( "should set the third article to the correct inner scroll and top margin", function() {
					expect( articles[ 2 ].getTop() ).toBe( expected[ scrollValue ][ 2 ].top );
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
				0 : { top: 0, innerScroll: 0 },
				1 : { top: 100, innerScroll: 0 },
				2 : { top: 150, innerScroll: 0 }
			},
			
			25 : {
				0 : { top: -25, innerScroll: 0 },
				1 : { top: 75, innerScroll: 0 },
				2 : { top: 125, innerScroll: 0 }
			},
			
			50 : {
				0 : { top: -50, innerScroll: 0 },
				1 : { top: 50, innerScroll: 0 },
				2 : { top: 100, innerScroll: 0 }
			},
			
			75 : {
				0 : { top: -75, innerScroll: 0 },
				1 : { top: 25, innerScroll: 0 },
				2 : { top: 75, innerScroll: 0 }
			},
			
			100 : {
				0 : { top: -100, innerScroll: 0 },
				1 : { top: 0, innerScroll: 0 },
				2 : { top: 50, innerScroll: 0 }
			},
			
			125 : {
				0 : { top: -125, innerScroll: 0 },
				1 : { top: 0, innerScroll: 25 },
				2 : { top: 50, innerScroll: 0 }
			},
			
			150 : {
				0 : { top: -150, innerScroll: 0 },
				1 : { top: 0, innerScroll: 50 },
				2 : { top: 50, innerScroll: 0 }
			},
			
			175 : {
				0 : { top: -175, innerScroll: 0 },
				1 : { top: -25, innerScroll: 50 },
				2 : { top: 25, innerScroll: 0 }
			},
			
			200 : {
				0 : { top: -200, innerScroll: 0 },
				1 : { top: -50, innerScroll: 50 },
				2 : { top: 0, innerScroll: 0 }
			},
			
			225 : {
				0 : { top: -225, innerScroll: 0 },
				1 : { top: -75, innerScroll: 50 },
				2 : { top: 0, innerScroll: 25 }
			},
			
			250 : {
				0 : { top: -250, innerScroll: 0 },
				1 : { top: -100, innerScroll: 50 },
				2 : { top: 0, innerScroll: 50 }
			}
		};
		
		// Create Tests from the expected values
		function createTest( scrollValue ) {
			describe( "when at " + scrollValue + " user scroll", function() {
				
				beforeEach( function() {
					articleScrollManager.setScrollTop( scrollValue );
				} );
				
				it( "should set the first article to the correct inner scroll and top margin", function() {
					expect( articles[ 0 ].getTop() ).toBe( expected[ scrollValue ][ 0 ].top );
					expect( articles[ 0 ].getScrollTop() ).toBe( expected[ scrollValue ][ 0 ].innerScroll );
				} );
				
				it( "should set the second article to the correct inner scroll and top margin", function() {
					expect( articles[ 1 ].getTop() ).toBe( expected[ scrollValue ][ 1 ].top );
					expect( articles[ 1 ].getScrollTop() ).toBe( expected[ scrollValue ][ 1 ].innerScroll );
				} );
				
				it( "should set the third article to the correct inner scroll and top margin", function() {
					expect( articles[ 2 ].getTop() ).toBe( expected[ scrollValue ][ 2 ].top );
					expect( articles[ 2 ].getScrollTop() ).toBe( expected[ scrollValue ][ 2 ].innerScroll );
				} );
			} );
		}
		
		for( var scrollValue in expected ) {
			createTest( scrollValue );
		}
	} );
	
} );