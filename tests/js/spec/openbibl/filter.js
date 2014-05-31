define(
  ['module', 'jquery', 'jasmine-jquery', 'obpev', 'filter']
, function(module, $, jj, obpev, filter) {

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
            beforeEach(function() {
                // loadFixtures('otherEurope.full.html');
                obpev.init();
            });
            it('Subscribed source filter_indices() method called on obp:filter-change event', function(){
                var source = {
                    filter_indices : function() { return []; }
                };
                spyOn(source,'filter_indices');
                filter.init([source]);
                obpev.raise('obp:filter-change', module.id);
                expect(source.filter_indices).toHaveBeenCalled();
            }); // it
/*            it('requested filter operation occurred', function(){

            }); // it
*/
        }); // describe
    });
});
