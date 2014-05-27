define(
  ['module', 'jquery', 'jasmine-jquery', 'obpev']
, function(module, $, jj, obpev) {

    describe(module.id, function(){

         beforeEach(function() {
            obpev.init();
        });

        describe('load/initialization', function() {
            it('load', function(){
                expect(obpev).toBeDefined();
            }); // it
            var events = obpev.events;
            it('initialized state', function() {
                expect(events).toEqual({
                     "obp:filter-start"          : {}
                   , "obp:filter-change"         : {}
                   , "obp:filter-mode-change"    : {}
                   , "obp:filter-complete"       : {}
                   , "obp:bibliography-added"    : {}
                   , "obp:search-term-change"    : {}
                   , "obp:browse-term-change"    : {}
               });
            }); // it
        }); // describe

        describe('un/supported event', function(){
            it('unsupported event throws exception', function() {
                expect(function() {
                    obpev.subscribe('obp:__not_existing', module.id, function(){});
                }).toThrow();
            }); // it
            it('supported event does not throw exception', function() {
                expect(function() {
                    obpev.subscribe('obp:filter-start', module.id, function(){});
                }).not.toThrow();
            });
        }); // describe

        describe('registered callback handling', function() {
            it('subscribed callback fired', function(){
                var event = 'obp:filter-start';
                var callback = jasmine.createSpy('callback');
                obpev.subscribe(event, module.id, callback);
                obpev.raise(event, module.id);
                expect(callback).toHaveBeenCalled();
            });
            it('unsubscribed callback not fired', function(){
                var event = 'obp:filter-start';
                var callback = jasmine.createSpy('callback');
                obpev.subscribe(event, module.id, callback);
                obpev.unsubscribe(event, module.id);
                obpev.raise(event, module.id);
                expect(callback).not.toHaveBeenCalled();
            });
        }); // describe

    });
});
