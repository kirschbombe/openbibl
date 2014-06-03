define(
  ['module', 'jquery', 'jasmine-jquery', 'obpconfig']
, function(module, $, jj, config) {
    describe(module.id, function() {

        describe('load/init', function(){

            it('load', function(){
                expect(config).toBeDefined();
            }); // it
            it('config properties', function() {
                var props = [ 'debug', 'console', 'saxonLogLevel', 'saxonPollInterval',
                              'paths', 'scroll_speed', 'query', 'templates', 'template_pattern',
                              'typeahead', 'rebase' ];
                for (var i = 0; i < props.length; i++) {
                    expect(config.hasOwnProperty(props[i])).toBe(true);
                }
            }); // it
        }); // describe

        describe('rebase', function() {
            it('config.rebase() is varargs', function() {
                expect(function() {
                    config.rebase();
                }).not.toThrow();
                expect(function() {
                    config.rebase({},false);
                }).not.toThrow();
            }); // it
            it('config.rebase() requires a supported key', function() {
                expect(function() {
                    config.rebase({ _unsupported_ : '' });
                }).toThrow();
            }); // it
            it('get/set of value', function(){
                var res = config.debug;
                expect(res).toBe(false);
                config.rebase({debug : true});
                res = config.debug;
                expect(res).toBe(true);
            }); // it
      }); // describe
  }); // describe
});
