// GWT's global callback function, used here to set a reference to
// the Saxon object for use in transformations below
var Saxon;
var onSaxonLoad = function() {
    Saxon = window.Saxon;
};
var timeout_override = 10000;

// Jasmine will timeout after this number of miliseconds
// of waiting on Saxon object to be initialized plus the
// query processing time in the async test below
var saxonTimeout = 10000;
var timeout_count = 10;

define(
  ['module', 'jquery', 'jasmine-jquery', 'obpev', 'obpstate', 'obpconfig', 'query', 'saxon', 'saxonce']
, function(module, $, jj, obpev, obpstate, obpconfig, query, obpsaxon) {

    describe(module.id, function() {

        describe('load/initialization', function() {
            it('load', function(){
                expect(query).toBeDefined();
            }); // it
        }); // describe

        describe('request file data synchronously', function(){
        
            var originalTimeout, spy, query_data, fixture_json;

            beforeEach(function(done){
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = timeout_override;

                loadFixtures('otherEurope.full.html');
                var timeout_count = 10;
                var check_require = function() {
                    if (Saxon !== undefined && obpstate.bibliographies.count === 9) {
                        obpsaxon.onSaxonLoad(Saxon);
                        obpev.init();
                        
                        obpconfig.async = false;
                        var file = 'otherEurope.query.json';
                        var subscriber = {
                            handle_query_data : function() {}
                        };
                        spy = spyOn(subscriber,'handle_query_data');
                        query.init({ subscribers : [subscriber] });
                        query_data_file = jasmine.getFixtures().fixturesPath
                                            + '/'
                                            + file;
                        query.request_query_data();
                        fixture_json = JSON.parse(readFixtures(file));

                        done();
                    } else if (--timeout_count > 0) {
                        setTimeout(check_require,1000);
                    } else {
                        done();
                    }
                };
                check_require();
            }); // beforeEach

            it('subscribers notified for static file', function(){
                expect(spy).toHaveBeenCalled();
            });
            it('retrieved data applied to state', function(){
                expect(obpstate.query.data.search.length).toEqual(fixture_json.search.length);
                expect(obpstate.query.data.browse).toEqual(fixture_json.browse);
            });
            
            afterEach(function(){
                jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            });
            
        });

        describe('request file data asynchronously', function(){
            var originalTimeout;

            beforeEach(function(done){
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = timeout_override;

                loadFixtures('otherEurope.full.html');
                var timeout_count = 10;
                var check_require = function() {
                    if (obpstate.bibliographies.count === 9) {
                        obpev.init();
                        done();
                    } else if (--timeout_count > 0) {
                        setTimeout(check_require,1000);
                    } else {
                        done();
                    }
                };
                check_require();
            }); // beforeEach

            it('generate query data using Saxon', function(done){
                var testSaxon;
                testSaxon = function() {
                    if (Saxon !== undefined) {
                        var fixture_json = JSON.parse(readFixtures('otherEurope.first.json'));
                        obpconfig.async = false;
                        obpsaxon.onSaxonLoad(Saxon);
                        obpstate.query.data = {};
                        // baseURI is set to that of the SpecRunner.html
                        obpstate.paths.root = '../../';
                        obpstate.bibliographies.xml = jasmine.getFixtures().fixturesPath
                                                    + '/'
                                                    + 'otherEurope.first.xml';
                        // override saxon error handler
                        var errorCalled = false;
                        obpsaxon.SaxonErrorHandler = function(saxonError) {
                            errorCalled = true;
                            console.log("SaxonErrorHandler (" + saxonError.level + "): " + saxonError.message);
                        }
                        query.request_saxon_query();
                        expect(obpstate.query.data).toEqual(fixture_json);
                        expect(errorCalled).toEqual(false);
                        done();
                    } else if (--timeout_count > 0) {
                        setTimeout(testSaxon, 500);
                    }
                };
                testSaxon();
            }); // it

            afterEach(function(){
                jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            });

        }); // describe

    });
});
