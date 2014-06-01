define(
  ['module', 'jquery', 'jasmine-jquery', 'obpev', 'theme', 'cookie']
, function(module, $, jj, obpev, theme) {

    describe(module.id, function(){

        describe('load/initialization', function() {
            beforeEach(function() {
                loadFixtures('otherEurope.boot.html');
                theme.init();
            });
            it('load', function(){
                expect(theme).toBeDefined();
            }); // it
        }); // describe

        describe('change theme', function(){

            beforeEach(function(){
                loadFixtures('otherEurope.boot.html');
                theme.init();
            });

            it('path utility swaps filenames', function() {
                var path = '../../foo';
                var newfile = 'bar';
                var newpath = '../../bar'
                expect(theme.change_filename(path,newfile))
                    .toEqual(newpath);
            });

            it('css stylesheet href changes on click', function(){
                var gethref = function(){
                    return $('#theme-css').attr('href');
                };
                var oldhref = gethref();
                var $input = $('.obp-theme-input').last();
                $input.click();
                var newhref = theme.change_filename(
                      oldhref
                    , $input.attr('data-stylesheet-file')
                );
                expect(gethref()).toEqual(newhref);
            });
        });
    });
});
