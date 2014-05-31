/*
* Openbibl Framework v0.1.0
* Copyright 2014, Dawn Childress
* Contact: https://github.com/kirschbombe/openbibl
* License: GNU AGPL v3 (https://github.com/kirschbombe/openbibl/LICENSE)
*/
/*jslint white: true, nomen: true*/
/*global define: true */
/**
 * Controller for search term functionality.
 *
 * @module openbibl/search
 */
define(
  [ 'module', 'search/model', 'search/view', 'obpstate', 'obpev' ]
, function(module,model,view,obpstate,obpev) {
    'use strict';
    return {
        /**
         * Initializer for search term controller. Initializes view.
         * @method
         * @public
         * @instance
         */
        init : function() {
            view.init(this);
        },
        /**
         * Value to use for @class attribute of a search term item.
         * @constant {stirng}
         * @public
         */
        term_list_item_class : 'obp-search-item',
        /**
         * Returns a list of bibliography entry indices (@data-src-index values)
         * considered active/visible based on active search terms.
         * @return {array} possibly empty list of integer indices
         * @method
         * @instance
         * @public
         */
        filter_indices : function() {
            return model.filter_indices();
        },
        /**
         * Returns a list of search term values to use by the highlighting
         * module.
         * @return {object} list of terms to highlight
         * @method
         * @instance
         * @public
         */
        highlight_items : function() {
            return model.highlight_items();
        },
        /**
         * Method called once search term data has been generated
         * from the source document.
         * @method
         * @public
         * @instance
         */
        handle_query_data : function() {
            model.handle_query_data(obpstate.query.data);
        },
        /**
         * Method called when one or all search terms have been
         * removed.
         * @method
         * @public
         * @instance
         */
        remove_terms : function(terms) {
            model.remove_terms(terms);
            obpev.raise("obp:search-term-change",module.id);
            obpev.raise("obp:filter-change",module.id);
        },
        /**
         * Method called when the a filter mode button has been clicked,
         * for synchronization.
         * @param {string} new search filter mode
         * @method
         * @public
         * @instance
         */
        filter_mode_change : function(val) {
            view.filter_mode_change(val);
            model.current_search_mode = view.current_search_mode;
        },
        /**
         * Returns list of currently active search terms.
         * @method
         * @public
         * @instance
         */
        active_search_terms : function() {
            return model.active_search_terms;
        },
        /**
         * Add a new search term to the list.
         * @param {string} value of term to add
         * @method
         * @public
         * @instance
         */
        add_term : function(term) {
            model.add_term(term);
            obpev.raise("obp:search-term-change",module.id);
            obpev.raise("obp:filter-change",module.id);
        }
    };
});
