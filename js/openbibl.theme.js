(function() {
"use strict";
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
