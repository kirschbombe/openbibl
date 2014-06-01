define(
  ['module', 'jquery', 'jasmine-jquery', 'obpev', 'toc', 'filter']
, function(module, $, jj, obpev, toc, filter) {

    describe(module.id, function(){

        describe('load/initialization', function() {
            it('load', function(){
                expect(toc).toBeDefined();
            }); // it
        }); // describe

        describe('toc contents', function(){

            beforeEach(function(){
                var obpstate = require('obpstate');
                obpev.init();
                loadFixtures('otherEurope.full.html');
                obpstate.rebase(window.obp.obpstate);
                toc.init();
            });

            it('toc contents correct on initial display', function(){
                expect($('li.toc:visible').length)
                    .toEqual($('div.entry').length);
            });

            it('toc contents correct after obp:filter-change event', function(){
                var indices = [0];
                var source = {
                    filter_indices : function() {
                        return indices;
                    }
                };
                filter.init([source]);
                obpev.raise('obp:filter-change', module.id);

                // make sure we have the same number of toc entries
                // elements as indicated in 'indices' above
                expect($('li.toc:visible:visible').length).toEqual(indices.length);

                // make sure we have the entries with the indices given above
                indices.forEach(function(ind){
                    var selector = 'li.toc:visible'
                                 + '[data-src-index='
                                 + ind.toString()
                                 + ']';
                    expect($(selector)).not.toBe([]);
                });
            }); // it
        }); // describe

/*      TODO: determine if scroll position can be determined in jasmine
        describe('toc events', function(){
            beforeEach(function(){
                var obpstate = require('obpstate');
                obpev.init();
                loadFixtures('otherEurope.full.html');
                obpstate.rebase(window.obp.obpstate);
                toc.init();
            });
            it('body scrolls to ', function(){
                var $toc_entry = $('li.toc[data-src-index="0"]');
                var target = 'div[data-src-index="0"]';
                var event = 'scrollTop';
                var spy = spyOn(target, event);
                $toc_entry.find('a').click();
                expect(spy).toHaveBeenCalled();
            }); // it
        }); // describe
*/
    }); // describe
});
