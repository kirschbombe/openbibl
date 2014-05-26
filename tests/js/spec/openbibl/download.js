define(
  ['module', 'jquery', 'jasmine-jquery', 'obpstate']
, function(module, $, jj, obpev, obpstate) {

    describe(module.id, function(){
        describe('click events', function() {
            beforeEach(function() {
                loadFixtures('otherEurope.html');
                browse.init();
                spyOn(obpev, 'raise');
            });
            it('.', function() {
                 var spyEvent = spyOnEvent('.', 'click');
                 $('.').first().click();
                 expect('click').toHaveBeenTriggeredOn('.');
                 expect(spyEvent).toHaveBeenTriggered();
            }); // it
        }); // describe
        
    });
});
