define(
  ['module', 'jquery', 'jasmine-jquery', 'obpev', 'sort']
, function(module, $, jj, obpev, sort) {

    describe(module.id, function(){

        describe('load/initialization', function() {
            it('load', function(){
                expect(sort).toBeDefined();
            }); // it
        }); // describe

        describe('sort events', function(){
            it('Sort routine called on obp:filter-complete event', function(){
                obpev.init();
                spyOn(sort,'sort_entries');
                sort.init();
                obpev.raise('obp:filter-complete', module.id);
                expect(sort.sort_entries).toHaveBeenCalled();
            }); // it
            it('Sort routine called on nav click', function(){
                loadFixtures('otherEurope.sort.html');
                sort.init();
                spyOn(sort,'sort_entries');
                $('.obp-sort-input').first().click();
                expect(sort.sort_entries).toHaveBeenCalled();
            }); // it
        }); // describe
        
        describe('sort accuracy', function(){
            beforeEach(function(){
                loadFixtures('otherEurope.sort.html');
                sort.init();
            });
            it('sort order by @data-src-index', function(){
                var sources = $('div.entry').map(function(i,elt){
                    return parseInt($(elt).attr('data-src-index'));
                });
                expect(sources).toEqual([0,1,2,3,4,5,6,7,8]);
            }); // it
            it('sort order by date', function(){
                var key = 'data-date';
                var sorted = [
                      "1484-10-16"
                    , "1488-08-01"
                    , "1489-11-14"
                    , "1535-01-01"
                    , "1577-01-01"
                    , "1579-01-01"
                    , "1581-01-01"
                    , "1647-01-01"
                    , "1691-01-01"
                ];
                $('input[data-sort-key="' + key + '"]').click();
                var current = $('div.entry').map(function(i,elt){
                    return $(elt).attr(key);
                });
                expect(sorted).toEqual(current);
            }); // it
            it('sort order by author', function(){
                var key = 'data-author';
                var sorted = [
                      ""
                    , "\t"
                    , " "
                    , "_" // sic
                    , "0" // sic
                    , "a"
                    , "b"
                    , "c"
                    , "\u03B1" // alpha
                ];
                $('input[data-sort-key="' + key + '"]').click();
                var current = $('div.entry').map(function(i,elt){
                    return $(elt).attr(key);
                });
                expect(sorted).toEqual(current);
            }); // it

        }); // describe
        
    });
});


