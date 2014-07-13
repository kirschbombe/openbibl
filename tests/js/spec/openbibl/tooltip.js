var Saxon, Saxonce;
var onSaxonLoad = function() {
    Saxon = window.Saxon;
    Saxonce = window.Saxonce;
};
var saxonTimeout = 10000; // total timeout (ms)
var saxonInterval = 1000; // interval to check for process success
var timeout_count = 10;   // max setTimeout()'s

define(
  ['module', 'jquery', 'jasmine-jquery', 'obp', 'obpev', 'obpstate', 'obpconfig', 'tooltip', 'saxon', 'saxonce', 'bootstrap']
, function(module, $, jj,obp,obpev,obpstate,obpconfig,tooltip,obpsaxon) {

    describe(module.id, function(){

        describe('load/initialization', function() {
            it('load', function(){
                expect(tooltip).toBeDefined();
            }); // it
        }); // describe

        describe('tooltip events', function(){
            var originalTimeout;

            beforeEach(function(done){
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = saxonTimeout;

                loadFixtures('otherEurope.full.html');
                obpev.init();
                obpconfig.saxonLogLevel = 'SEVERE';

                timeout_count = 10;
                var testSaxon;
                testSaxon = function() {
                    if (Saxon !== undefined) {
                        obpsaxon.onSaxonLoad(Saxon);
                        
                        timeout_count = 10;
                        var check_require = function() {
                            if (obpstate.bibliographies.count === 9) {
                                done();
                            } else if (--timeout_count > 0) {
                                setTimeout(check_require,saxonInterval);
                            } else {
                                done();
                            }
                        };
                        check_require();
                        
                    } else if (--timeout_count > 0) {
                        setTimeout(testSaxon, 500);
                    }
                };
                testSaxon();
                
            }); // beforeEach

            it('tooltip enabled on obp:bibliography-added event', function(){
                tooltip.init();
                var methods =  [
                      'enable_tooltips'
                ];
                var spys = methods.map(function(method){
                    return spyOn(tooltip,method);
                });
                obpev.raise('obp:bibliography-added');
                spys.forEach(function(spy){
                    expect(spy).toHaveBeenCalled();
                });
            }); // it
            it('tooltip enabled on obp:filter-complete event', function(){
                tooltip.init();
                var methods =  [
                      'enable_tooltips'
                ];
                var spys = methods.map(function(method){
                    return spyOn(tooltip,method);
                });
                obpev.raise('obp:filter-complete');
                spys.forEach(function(spy){
                    expect(spy).toHaveBeenCalled();
                });
            }); // it

            it('default onclick event prevented for tooltip <a> click', function(done) {
                timeout_count = 10;
                var testSaxon;
                testSaxon = function() {
                    if (Saxon !== undefined) {
                        obpsaxon.onSaxonLoad(Saxon);
                        tooltip.init();
                        var saxon_error = false;
                        obpsaxon.SaxonErrorHandler = function() {
                            saxon_error = true;  
                        };
                        tooltip.request_data();
                        obpev.raise('obp:bibliography-added');
                        var selector = 'a[data-toggle="tooltip"]:first';
                        timeout_count = 10;
                        var expecter = function() {
                            var elt = $(selector)[0];
                            if (--timeout_count > 0 && elt === undefined) {
                                setTimeout(expecter, saxonInterval);
                            } else if (!saxon_error && elt !== undefined) {
                                var callback = jasmine.createSpy('callback');
                                elt.onclick = callback;
                                var event = new MouseEvent('click', {
                                    'view': window,
                                    'bubbles': true,
                                    'cancelable': true
                                });
                                elt.dispatchEvent(event);
                                expect(event.defaultPrevented).toBe(true);
                                done();
                            } else {
                                expect(saxon_error).not.toEqual(true);
                                done();
                            }
                        }
                        expecter();
                    } else if (--timeout_count > 0) {
                        setTimeout(testSaxon, saxonInterval);
                    }
                };
                testSaxon();
            }); // it

            it('tooltip hover event adds tooltip text', function(done){
                obpconfig.async = false;
                tooltip.init();
                var tt_text = 'Also known as Albert the Great and Albert of Cologne. Catholic saint and German philosopher and theologian of the Middle Ages. The Catholic Church honours him as a Doctor of the Church, one of only 35 so honoured.';
                
                // override the injected script callback that installs the tooltip title
                // for tracking here
                var a_called = {};
                // this method is required to be attached to the tooltip object, because
                // otherwise the call to register_title() will have its 'this' object
                // pointing to window
                tooltip.orig_register_title = tooltip.register_title;
                var new_register_title = function(a_id,script_id,tt_id) {
                    a_called[a_id] = '';
                    tooltip.orig_register_title(a_id,script_id,tt_id);
                };
                tooltip.register_title = new_register_title;
                
                var success = function() {
                    timeout_count = 10;
                    var do_test = function(){

                        var selector = 'a[data-toggle="tooltip"]:first';
                        var $elt = $(selector);
                        
                        if (   --timeout_count > 0 
                            && $elt !== undefined 
                            && a_called.hasOwnProperty($elt.attr('id'))
                        ) {
                            obpev.raise('obp:bibliography-added');
                            $elt.trigger('mouseover');
                            // tooltip <div> is present and visible
                            expect($elt.find('div.tooltip.fade.top.in').length).toEqual(1);
                            // tooltip <div> has expected text
                            expect($elt.find('div.tooltip.fade.top.in').find('.tooltip-inner').text())
                                .toEqual(tt_text);
                            done();
                        } else if (--timeout_count > 0) {
                            setTimeout(do_test, saxonInterval);
                        } else {
                            done();
                        }
                    };
                    do_test();
                };
                tooltip.request_data({success : success});
            }); // it

            afterEach(function(){
                jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            });
        }); // describe
    });
});
