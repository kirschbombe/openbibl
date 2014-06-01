define(
  ['module', 'jquery', 'jasmine-jquery', 'obpev', 'tooltip', 'bootstrap']
, function(module, $, jj, obpev, tooltip) {

    describe(module.id, function(){

        describe('load/initialization', function() {
            beforeEach(function() {
                tooltip.init();
            });
            it('load', function(){
                expect(tooltip).toBeDefined();
            }); // it
        }); // describe

        describe('tooltip events', function(){
            beforeEach(function(){
                loadFixtures('otherEurope.full.html');
                obpev.init();
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
            it('default onclick event prevented for tooltip <a> click', function() {
                var selector = 'a[data-toggle="tooltip"]:first';
                var elt = $(selector)[0];
                var callback = jasmine.createSpy('callback');
                elt.onclick = callback;
                var event = new MouseEvent('click', {
                    'view': window,
                    'bubbles': true,
                    'cancelable': true
                });
                elt.dispatchEvent(event);
                expect(callback).toHaveBeenCalled();
                // the default onclick is overridden by bootstrap-tooltip
                tooltip.init();
                obpev.raise('obp:bibliography-added');
                elt.dispatchEvent(event);
                expect(event.defaultPrevented).toBe(true);
            }); // it
            it('tooltip hover event adds tooltip text', function(){
                tooltip.init();
                var selector = 'a[data-toggle="tooltip"]:first';
                var $elt = $(selector);
                obpev.raise('obp:bibliography-added');
                $elt.trigger('mouseover');
                // tooltip <div> is present and visible
                expect($elt.next().is('.tooltip, .fade, .top, .in')).toBe(true);
                // tooltip <div> has expected text
                expect($elt.next().find('.tooltip-inner').text())
                    .toEqual($elt.attr('data-original-title'));
            }); // it

        }); // describe
    });
});
