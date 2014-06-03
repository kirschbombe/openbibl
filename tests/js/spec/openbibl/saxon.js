// GWT's global callback function, used here to set a reference to
// the Saxon object for use in transformations below
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
  ['module', 'jquery', 'jasmine-jquery', 'obpev', 'obpstate', 'obpconfig', 'saxon', 'saxonce']
, function(module, $, jj, obpev, obpstate, obpconfig, obpsaxon) {

    describe(module.id, function() {

        describe('asynchronous tests', function(){
            var originalTimeout;

            beforeEach(function(){
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = saxonTimeout;
                loadFixtures('otherEurope.boot.html');
                // retrieve files synchronously to simplify debugging
                obpconfig.rebase(
                    {     async : false
                        , paths : { obp_root : window.obp.appdir }
                        , saxonLogLevel : 'OFF'
                    }
                    , true
                );
            });

            it('load/init', function(done){
                var testSaxon;
                testSaxon = function() {
                    if (Saxon !== undefined) {
                        expect(obpsaxon).toBeDefined();
                        done();
                    } else {
                        setTimeout(testSaxon, saxonInterval);
                    }
                };
                testSaxon();
            }); // it

            it('generate bibliography entries', function(done){
                var testSaxon;
                testSaxon = function() {
                    if (Saxon !== undefined) {
                        obpsaxon.onSaxonLoad(Saxon);
                        // override Saxon error handler
                        // NB: this will be called for any logging for Saxon log levels
                        // above 'OFF'
                        var errorCalled = false;
                        obpsaxon.SaxonErrorHandler = function(saxonError) {
                            errorCalled = true;
                            console.log("SaxonErrorHandler (" + saxonError.level + "): " + saxonError.message);
                        }
                        var successCalled = false;
                        var success = {
                            cb : function() {
                                successCalled = true;
                            }
                        };
                        var xsl = obpconfig.paths.obp_root + 'xsl/openbibl.xsl';
                        var xml = jasmine.getFixtures().fixturesPath
                                + '/'
                                + 'otherEurope.xml';
                        obpsaxon.requestInitialTransform(xsl,xml,[],success.cb);
                        var saxonCountdown = saxonInterval/saxonTimeout;
                        var intervalID;
                        var timeout = function() {
                            expect($('div.entry').length).toEqual(9);
                            expect(successCalled).toEqual(true);
                            expect(errorCalled).toEqual(false);
                            done();
                            clearInterval(intervalID);
                        };
                        var intervalCB = function(){
                            if (--saxonCountdown > 0 || successCalled) {
                                timeout();
                            } else {
                                timeout();
                            }
                        };
                        intervalID = setInterval(
                              intervalCB
                            , saxonInterval
                        );
                    } else {
                        setTimeout(testSaxon, saxonInterval);
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
