/*
* Openbibl Framework v0.1.0
* Copyright 2014, Dawn Childress
* Contact: https://github.com/kirschbombe/openbibl
* License: GNU AGPL v3 (https://github.com/kirschbombe/openbibl/LICENSE)
*/
/*jslint white: true, todo: true, nomen: true */
/*global define: true */
/**
 * Controller for index-based browse/filter functionality.
 *
 * @module openbibl/browse
 */
define(
[ 'module', 'obpev', 'obpstate', 'browse/model', 'browse/view' ]
, function(module, obpev, obpstate, model, view) {
    'use strict';
    return {
        /**
         * Initializer for browse object controller. Initializes the view.
         * @method
         * @public
         * @instance
         */
        init : function() {
            view.init(this);
        },
        /**
         * Return current set of "active" browse items. Method called
         * by the filter object to which the browse object is subscribed (i.e., is
         * an interface method for an object on which to filter).
         * @returns {Array} indices of "active" browse items (zero to all bibl. entries)
         * @method
         * @public
         * @instance
         */
        filter_indices : function() {
            return model.filter_indices();
        },
        /**
         * Handle a filter-mode change from UI.
         * @param {string} browse list type
         * @param {string} browse list mode
         * @method
         * @public
         * @instance
         */
        filter_mode_change : function(list_type,browse_mode) {
            model.filter_mode_change(list_type,browse_mode);
        },
        /**
         * Return a listing of items to be highlighted. Since browsed items
         * are elements and not free text, the listing is a collection of
         * attributes used to identify the elements to highlight. This method
         * is called by the openbibl/highlight object based on Openbibl event
         * triggers (i.e., is part of a "highlightable object" interface).
         * @method
         * @public
         * @instance
         */
        highlight_items : function() {
            return model.highlight_items();
        },
        /**
         * Callback called when "query data" (browse-term and search-term data)
         * is available.
         * @method
         * @public
         * @instance
         */
        handle_query_data : function() {
            model.handle_query_data(obpstate.query.data.browse);
        },
        /**
         * Clear the current list of browsing terms.
         * @param {string} list type to clear
         * @param {string} current list mode
         * @method
         * @public
         * @instance
         */
        remove_terms : function(type,mode) {
            model.remove_terms(type,mode);
            obpev.raise("obp:browse-term-change",module.id);
            obpev.raise("obp:filter-change",module.id);
        },
        /**
         * Toggle the "active" filter-state of an item in a browse list.
         * @param {string} list type of item
         * @param {string} vale of item
         * @param {string} list filter mode
         * @method
         * @public
         * @instance
         */
        toggle_term : function(list,term,mode) {
            model.toggle_term(list,term,mode);
            obpev.raise("obp:browse-term-change",module.id);
            obpev.raise("obp:filter-change",module.id);
        }
    };
});
