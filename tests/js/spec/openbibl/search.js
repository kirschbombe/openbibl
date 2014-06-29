
var Saxon;
var onSaxonLoad = function() {
    Saxon = window.Saxon;
};

// Jasmine will timeout after this number of miliseconds
// of waiting on Saxon object to be initialized plus the
// query processing time in the async test below
var saxonTimeout = 10000; // total timeout (ms)
var saxonInterval = 1000; // interval to check for process success

define(
  ['module', 'jquery', 'jasmine-jquery', 'obpev', 'search', 'query', 'search/model', 'search/view', 'obpstate', 'obpconfig', 'saxon', 'saxonce', 'typeahead']
, function(module, $, jj, obpev, search, query, model, view, obpstate, obpconfig, obpsaxon) {

    describe(module.id, function(){

        describe('load/initialization', function() {
            it('load', function(){
                expect(search).toBeDefined();
            }); // it
            it('initialized state', function() {
                obpstate.rebase({
                    bibliographies : {count : 0}
                });
                expect(search.filter_indices()).toEqual([]);
                expect(search.highlight_items()).toEqual(
                    { term : [] }
                );
            }); // it
        }); // describe

        describe('search events', function() {
            var originalTimeout;

            beforeEach(function(done) {
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = saxonTimeout;
                loadFixtures('otherEurope.full.html');

                var timeout_count = 10;
                var check_require = function() {
                    if (Saxon !== undefined && obpstate.bibliographies.count === 9) {
                        obpsaxon.onSaxonLoad(Saxon);
                        obpev.init();

                        // request query data
                        query.init({ subscribers : [search] });
        
                        search.init();
                        search.handle_query_data();

                        done();
                    } else if (--timeout_count > 0) {
                        setTimeout(check_require,1000);
                    } else {
                        done();
                    }
                };
                check_require();
            }); // it

            it('add existing search term', function() {
                var raiseSpy = spyOn(obpev, 'raise');
                var $input = $('.search-input').first(); 
                var term = "ALBERTUS";
                term.split('').map(function(c){
                    $input.val( ($input.val() || "") + c);
                    $input.trigger('keyup', c.charCodeAt(0));
                });
                $input.trigger(jQuery.Event('keyup', { keyCode: 13 })); // enter
                expect(search.active_search_terms()).toEqual([term]);
                expect(raiseSpy).toHaveBeenCalledWith('obp:search-term-change', 'search');
                expect(raiseSpy).toHaveBeenCalledWith('obp:filter-change', 'search');
            }); // it

            it('.obp-search-clear click event', function() {
                 var spyEvent = spyOnEvent('.obp-search-clear', 'click');
                 var spyRaise = spyOn(obpev, 'raise');
                 $('.obp-search-clear').first().click();
                 expect('click').toHaveBeenTriggeredOn('.obp-search-clear');
                 expect(spyEvent).toHaveBeenTriggered();
                 expect(spyRaise).toHaveBeenCalledWith('obp:search-term-change', 'search');
            }); // it
            
            it('default submit event prevented for search form clear', function() {
                var selector = '.obp-search-form:first';
                var elt = $(selector)[0];
                var callback = jasmine.createSpy('callback');
                elt.onsubmit = callback;
                var event = new MouseEvent('submit', {
                    'view': window,
                    'bubbles': true,
                    'cancelable': true
                });
                elt.dispatchEvent(event);
                expect(callback).toHaveBeenCalled();
                // the default onsubmit is prevented
                search.init();
                elt.dispatchEvent(event);
                expect(event.defaultPrevented).toBe(true);
            }); // it

            it('added search term cleared', function() {
                var $input = $('.search-input').first(); 
                var term = "ALBERTUS";
                term.split('').map(function(c){
                    $input.val( ($input.val() || "") + c);
                    $input.trigger('keyup', c.charCodeAt(0));
                });
                $input.trigger(jQuery.Event('keyup', { keyCode: 13 })); // enter
                expect(search.active_search_terms()).toEqual([term]);
                $('.obp-search-clear').first().click();
                expect(search.active_search_terms()).toEqual([]);
            }); // it

            afterEach(function(){
                jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            });

        }); // describe

    }); // describe
});
