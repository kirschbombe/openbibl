define(
  ['module', 'jquery', 'jasmine-jquery', 'filesaver']
, function(module, $, jj, filesaver) {

    describe(module.id, function(){

        describe('click events', function() {
            beforeEach(function() {
                loadFixtures('otherEurope.boot.html');
            });

            it('.obp-download-page click', function() {
                 var spyEvent = spyOnEvent('.obp-download-page', 'click');
                 $('.obp-download-page').first().click();
                 expect('click').toHaveBeenTriggeredOn('.obp-download-page');
                 expect(spyEvent).toHaveBeenTriggered();
            }); // it

            /*
            TODO: determine how to determine whether FileSaver.js has downloaded a file
            it('data-url download click', function(){
            }); // it
            */
        }); // describe

    }); // describe
});
