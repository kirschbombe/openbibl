/*
* Openbibl Framework v0.1.0
* Copyright 2014, Dawn Childress
* Contact: https://github.com/kirschbombe/openbibl
* License: GNU AGPL v3 (https://github.com/kirschbombe/openbibl/LICENSE)
*/
/*jslint white: true, nomen: true, todo: true */
/*global define: true */
/**
 * Controller for sorting functionality.
 *
 * @module openbibl/sort
 */
define(
  [ 'module', 'jquery', 'obpev' ]
, function(module,$,obpev) {
    'use strict';
    return {
        /**
         * Initializer for sorting controller. Registers callbacks.
         * @method
         * @public
         * @instance
         */
        init : function() {
            var sort = this;
            obpev.subscribe("obp:filter-complete", module.id, function() {
                sort.sort_entries(sort.current_sort_key);
            });
            $('.obp-sort-input').on('click', function(e) {
                sort.sort_entries(e.target.getAttribute('data-sort-key'));
                $(this).closest('.obp-menu-li').find('a[data-toggle]').click();
                obpev.raise("obp:bibliography-added", module.id);
            });
        },
        /**
         * Default sort key for bibliography entries.
         * @todo make configurable
         * @property
         * @public
         * @instance
         */
        sort_key_default : 'data-src-index',
        /**
         * Current key used to establish sort order (e.g., date or author name).
         * Corresponds to a @data-* attribute applied to a div[class="entry"].
         * @todo should have a third option 'document'
         * @property
         * @public
         * @instance
         */
        current_sort_key : null,
        /**
         * Method causing a re-sort of bibliography entries.
         * @param key {string} sort key to use
         * @method
         * @public
         * @instance
         */
        sort_entries : function (key) {
            var $wrapper, $entries;
            if (key === undefined || key === null) {
                key = this.sort_key_default;
            }
            this.current_sort_key = key;
            $wrapper = $('#bibliographies');
            $entries = $wrapper.children('div.entry').remove();
            $entries.sort(function(a,b) {
                return (a.getAttribute(key)||"").localeCompare(
                        (b.getAttribute(key)||"")
                    );
            });
            $wrapper.append($entries);
        }
    };
});
