// GWT's global callback function, used here to set a reference to
// the Saxon object for use in transformations below
var Saxon;
var onSaxonLoad = function() {
    Saxon = window.Saxon;
};

// Jasmine will timeout after this number of miliseconds
// of waiting on Saxon object to be initialized plus the
// query processing time in the async test below
var saxonTimeout = 10000;

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
            obpconfig.async = false;
            var file = 'otherEurope.query.json';
            var subscriber = {
                handle_query_data : function() {}
            };
            var spy = spyOn(subscriber,'handle_query_data');
            query.init([subscriber]);
            var query_data_file = jasmine.getFixtures().fixturesPath
                                + '/'
                                + file;
            var query_data;
            var cb = function(data){
                query_data = data;
            };
            query.request_query_data(query_data_file,cb);
            var fixture_json = JSON.parse(readFixtures(file));

            it('subscribers notified for static file', function(){
                expect(spy).toHaveBeenCalled();
            });
            it('retrieved data applied to state', function(){
                expect(query_data).toEqual(fixture_json);
            });
        });

        describe('request file data asynchronously', function(){
            var originalTimeout;

            beforeEach(function(){
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = saxonTimeout;
            });

            it('generate query data using Saxon', function(done){
                var testSaxon;
                testSaxon = function() {
                    if (Saxon !== undefined) {
                        var file = 'otherEurope.first.json';
                        var fixture_json = JSON.parse(readFixtures(file));
                        obpsaxon.onSaxonLoad(Saxon);
                        obpstate.query.data = {};
                        // baseURI is set to that of the SpecRunner.html
                        obpconfig.paths.query_xsl = '../../' + obpconfig.paths.query_xsl;
                        obpstate.bibliographies.xml = jasmine.getFixtures().fixturesPath
                                                    + '/'
                                                    + 'otherEurope.first.xml';
                        var query_data;
                        var cb = function(data){
                            query_data = data;
                        };
                        query.request_saxon_query(cb);
                        expect(query_data).toEqual(fixture_json);
                        done();
                    } else {
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
