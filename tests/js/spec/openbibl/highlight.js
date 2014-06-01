define(
  ['module', 'jquery', 'jasmine-jquery', 'obpev', 'highlight']
, function(module, $, jj, obpev, highlight) {

    describe(module.id, function(){

        describe('load/initialization', function() {
            beforeEach(function() {
                highlight.init();
            });
            it('load', function(){
                expect(highlight).toBeDefined();
            }); // it
        }); // describe

        describe('highlight events', function(){
        
            beforeEach(function(){
                loadFixtures('otherEurope.full.html');
                obpev.init();
            });
        
            it('highlight events called on obp:bibliography-added event', function(){
                highlight.init();
                var methods =  [
                      'unhighlight_filter_items'
                    , 'highlight_filter_items'
                    , 'unhide_filter_items'
                ];
                var spys = methods.map(function(method){
                    return spyOn(highlight,method);
                });
                obpev.raise('obp:bibliography-added');
                spys.forEach(function(spy){
                    expect(spy).toHaveBeenCalled();
                });
            }); // it
                
            it('expected term is highlighted', function(){
                var term = 'buildings';
                var source = {
                    highlight_items : function(){
                        return { term : term } 
                    }
                };
                highlight.init([source]);
                obpev.raise('obp:bibliography-added');
                var selector = '.' + highlight.match_class;
                expect($(selector).first().text()).toEqual(term);
            }); // it

            it('missing term is not highlighted', function(){
                var term = 'foo';
                var source = {
                    highlight_items : function(){
                        return { term : term } 
                    }
                };
                highlight.init([source]);
                obpev.raise('obp:bibliography-added');
                var selector = '.' + highlight.match_class;
                expect($(selector).length).toEqual(0);
            }); // it

            it('expected element is highlighted', function(){
                var selectors = ['[data-ed-ref="winterberg"]'];
                var source = {
                    highlight_items : function(){
                        return { element : selectors } 
                    }
                };
                highlight.init([source]);
                obpev.raise('obp:bibliography-added');
                selectors.forEach(function(selector){
                    expect($('.' + highlight.match_class).text())
                        .toEqual($(selector).text());
                });
            }); // it
            
            it('expected element is unhighlighted', function(){
                var selectors = ['[data-ed-ref="winterberg"]'];
                var source = {
                    highlight_items : function(){
                        return { element : selectors } 
                    }
                };
                highlight.init([source]);
                obpev.raise('obp:bibliography-added');
                selectors.forEach(function(selector){
                    expect($('.' + highlight.match_class).text())
                        .toEqual($(selector).text());
                });
                selectors = [];
                obpev.raise('obp:bibliography-added');
                expect($('.' + highlight.match_class).length)
                    .toEqual(0);                
            }); // it

        }); // describe
    });
});
