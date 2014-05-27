define(
  ['module', 'jquery', 'jasmine-jquery', 'obpev', 'filter']
, function(module, $, jj, obpev, filter) {

    describe(module.id, function(){

        describe('load/initialization', function() {
            it('load', function(){
                expect(filter).toBeDefined();
            }); // it
            it('initialized state', function() {
                var sources = filter.sources;
                expect(sources).toEqual([]);
            }); // it
        }); // describe

/*        describe();
obpev.subscribe("obp:filter-change", module.id, function() {
*/

        describe('', function(){
            beforeEach(function() {
                loadFixtures('otherEurope.full.html');
                browse.init();
                spyOn(obpev, 'raise');
            });

        });


    });
});
