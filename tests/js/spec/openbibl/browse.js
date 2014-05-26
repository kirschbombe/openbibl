define(
  ['module', 'jquery', 'jasmine-jquery', 'obpev', 'browse', 'browse/model', 'obpstate']
, function(module, $, jj, obpev, browse, model, obpstate) {

    describe(module.id, function(){

        describe('load/initialization', function() {
            it('load', function(){
                expect(browse).toBeDefined();
            }); // it    
            it('initialized state', function() {
                expect(browse.filter_indices()).toEqual([]);
                expect(browse.highlight_items()).toEqual(
                    { element : [] }
                );
            }); // it
        }); // describe
    
        describe('click events', function() {
            beforeEach(function() {
                loadFixtures('otherEurope.html');
                browse.init();
                spyOn(obpev, 'raise');
            });
            it('.obp-browse-clear', function() {
                 var spyEvent = spyOnEvent('.obp-browse-clear', 'click');
                 $('.obp-browse-clear').first().click();
                 expect('click').toHaveBeenTriggeredOn('.obp-browse-clear');
                 expect(spyEvent).toHaveBeenTriggered();
                 expect(obpev.raise).toHaveBeenCalledWith('obp:browse-term-change', 'browse');
                 expect(obpev.raise).toHaveBeenCalledWith('obp:filter-change', 'browse');
            }); // it
            it('.obp-browse-checkbox', function() { 
                 var spyEvent = spyOnEvent('.obp-browse-checkbox', 'click');
                 $('.obp-browse-checkbox').first().click();
                 expect('click').toHaveBeenTriggeredOn('.obp-browse-checkbox');
                 expect(spyEvent).toHaveBeenTriggered();
                 expect(obpev.raise).toHaveBeenCalledWith('obp:browse-term-change', 'browse');
                 expect(obpev.raise).toHaveBeenCalledWith('obp:filter-change', 'browse');
            }); // it
        }); // describe
        
        describe('model messaging', function(){
            it('model called to update query data', function() {
                browse.init();
                obpstate.query.data = { browse: {} };
                spyOn(model, 'handle_query_data');
                browse.handle_query_data();
                expect(model.handle_query_data).toHaveBeenCalled();
            }); // it
        }); // describe
    
    });
});
