/*
* Openbibl Framework v0.1.0
* Copyright 2014, Dawn Childress
* Contact: https://github.com/kirschbombe/openbibl
* License: GNU AGPL v3 (https://github.com/kirschbombe/openbibl/LICENSE)
*/
/*jslint white: true, todo: true, nomen: true */
/*global define: true */
/**
 * Controller for CSS theme-changer functionality.
 *
 * @module openbibl/theme
 */
define(
  [ 'jquery', 'cookie' ]
, function($) {
    'use strict';
    return {
        /**
         * Initialize theme changer by registering DOM event callbacks.
         * @method
         * @public
         * @instance
         */
        init : function() {
            /*jslint unparam: true*/
            var themer = this;
            $('.obp-theme-input').on('click', function(e) {
                themer.change_theme($(this).attr('data-stylesheet-file'));
                $(this).closest('.obp-menu-li').find('a[data-toggle]').click();
            });
            if ($.cookie('theme-stylesheet') !== undefined) {
                themer.change_theme($.cookie('theme-stylesheet'));
            }
        },
        /**
         * Method to change the current stylesheet @href attribute value,
         * causing a change in CSS styling for the document.
         * @param {string} stylesheet filename
         * @method
         * @public
         * @instance
         */
        change_theme : function(stylesheet) {
            var path, $theme_css;
            if (stylesheet === undefined || stylesheet === '') {
                throw "Undefined or empty stylesheet name in openebibl.theme.change_theme()";
            }
            $('.obp-theme-input[data-stylesheet-file="' + stylesheet + '"]').prop('checked', 'checked');
            $theme_css = $('#theme-css');
            $.cookie('theme-stylesheet',stylesheet);
            path = this.change_filename($theme_css.attr('href'), stylesheet);
            if ($theme_css.attr('href') !== path) {
                $theme_css.attr('href', path);
            }
        },
        /**
         * Utility function to update a path with a new filename.
         * @method
         * @private
         * @instance
         */
        change_filename : function(path,name) {
            var parts = (path !== undefined)
                       ? path.split('/')
                       : [];
            parts[parts.length-1] = name;
            return parts.join('/');
        }
    };
});
