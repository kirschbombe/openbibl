
define(
  [ 'module', 'jquery', 'cookie', 'domReady' ]
, function(module,$,cookie,domReady) {
    domReady(function() {
        $('.obp-theme-input').on('click', function(e) {
            module.exports.change_theme($(this).attr('data-stylesheet-file'));
            $(this).closest('.obp-menu-li').find('a[data-toggle]').click();
        });
        var stored = $.cookie('theme-stylesheet');
        $('.obp-theme-input[data-stylesheet-file="' + stored + '"]').click();
    });
    module.exports.change_theme = function(stylesheet) {
        if (stylesheet === undefined) return;
        var $theme_css = $('#theme-css');
        $.cookie('theme-stylesheet',stylesheet);
        var parts = $theme_css.attr('href').split('/');
        parts[parts.length-1] = stylesheet;
        stylesheet = parts.join('/');
        if ($theme_css.attr('href') !== stylesheet)
            $theme_css.attr('href', stylesheet);
    }
});
