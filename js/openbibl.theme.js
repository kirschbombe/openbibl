(function() {
"use strict";
    window.obp.theme.init = function() {
        $('.obp-theme-input').on('click', function(e) {
            var stylesheet;
            window.obp.change_theme($(this).attr('data-stylesheet-file'));
            $(this).closest('.obp-menu-li').find('a[data-toggle]').click();
        });
        var stored = window.obp.retrieve_cookie('theme-stylesheet');
        $('.obp-theme-input[data-stylesheet-file="' + stored + '"]').click();
    }
    window.obp.change_theme = function(stylesheet) {
        if (stylesheet === undefined) return;
        var $theme_css = $('#theme-css');
        this.update_cookie('theme-stylesheet',stylesheet);
        var parts = $theme_css.attr('href').split('/');
        parts[parts.length-1] = stylesheet;
        stylesheet = parts.join('/');
        if ($theme_css.attr('href') !== stylesheet)
            $('#theme-css').attr('href', stylesheet);
    }
})();
