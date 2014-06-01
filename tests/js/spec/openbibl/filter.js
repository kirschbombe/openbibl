define(
  ['module', 'jquery', 'jasmine-jquery', 'obpev', 'filter', 'browse']
, function(module, $, jj, obpev, filter, browse) {

    describe(module.id, function(){

        describe('load/initialization', function() {
            beforeEach(function() {
                filter.init();
            });
            it('load', function(){
                expect(filter).toBeDefined();
            }); // it
            it('initialized state', function() {
                var sources = filter.sources;
                expect(sources).toEqual([]);
            }); // it
        }); // describe

        describe('subscribed sources', function(){
            it('Subscribed source filter_indices() method called on obp:filter-change event', function(){
                obpev.init();
                var source = {
                    filter_indices : function() { return []; }
                };
                spyOn(source,'filter_indices');
                filter.init([source]);
                obpev.raise('obp:filter-change', module.id);
                expect(source.filter_indices).toHaveBeenCalled();
            }); // it
            it('Click event triggered expected filter query', function(){
                loadFixtures('otherEurope.full.html');
                browse.init();
                var source = {
                    filter_indices : function() {}
                };
                spyOn(source,'filter_indices');
                filter.init([source]);
                $('.obp-browse-checkbox').first().click();
                expect(source.filter_indices).toHaveBeenCalled();
            }); // it
            it('Click event results in expected number/index of entries', function(){
                var obpstate = require('obpstate');
                obpstate.rebase(window.obp.obpstate);
                loadFixtures('otherEurope.full.html');
                browse.init();
                var indices = [0];
                var source = {
                    filter_indices : function() {
                        return indices;
                    }
                };
                filter.init([source]);
                $('.obp-browse-checkbox').first().click();
                // make sure we have the same number of div.entry
                // elements as indicated in 'indices' above
                expect($('.entry:visible').length).toEqual(indices.length);
                // make sure we have the entries with the indices given above
                indices.forEach(function(ind){
                    var selector = '.entry:visible'
                                 + '[data-src-index='
                                 + ind.toString()
                                 + ']';
                    expect($(selector)).not.toBe([]);
                });
            });

        }); // describe
    });
});
