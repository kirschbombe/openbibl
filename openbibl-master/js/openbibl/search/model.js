/*
* Openbibl Framework v0.1.0
* Copyright 2014, Dawn Childress
* Contact: https://github.com/kirschbombe/openbibl
* License: GNU AGPL v3 (https://github.com/kirschbombe/openbibl/LICENSE)
*/
/*jslint white: true, nomen: true, plusplus: true, todo: true */
/*global define: true */
/**
 * Data model for search-term functionality.
 *
 * @module openbibl/search/model
 */
define(
  [ 'underscore', '../filter' ]
, function(_,filter) {
    'use strict';
    return {
        /**
         * Mapping of search terms to the bibliography entry indices (@data-src-index value),
         * used by filtering.
         * @property
         * @private
         */
        document_data : {},
        /**
         * Terms currently active in the search field.
         * @property
         * @private
         */
        active_search_terms : [],
        /**
         * Current mode for search term filtering.
         * @property
         * @private
         */
        current_search_mode : filter.filter_mode_default,
        /**
         * Callback used to receive and populate the search-term-list and
         * occurrence-index data used by the search term filter.
         * @param {object} listing of search term data, in the format:
         *                 \{ search : [ "foo", [0,3], "bar", [1,3], ... ] \}
         * @callback
         * @public
         * @instance
         */
        handle_query_data : function(data) {
            var i, j,
                termmap = {},
                len = data.search.length;
            for (i = 0; i < len; i+=2) {
                for (j = 0; j < data.search[i].length; j++) {
                    termmap[data.search[i][j]] = data.search[i+1];
                }
            }
            this.document_data = termmap;
        },
        /**
         * Method to add a new term to the list of active search terms.
         * @param {string} value of term
         * @method
         * @public
         * @instance
         */
        add_term : function(term) {
            if (_.indexOf(this.active_search_terms,term) === -1) {
                this.active_search_terms.push(term);
            }
        },
        /**
         * Clear the list of active search terms.
         * @method
         * @public
         * @instance
         */
        clear_terms : function() {
            this.active_search_terms = [];
        },
        /**
         * Remove provided search terms from the active term list.
         * @param {array} list of terms to remove
         * @method
         * @public
         * @instance
         */
        remove_terms : function(terms) {
            this.active_search_terms = _.difference(
                  _.toArray(this.active_search_terms)
                , _.toArray(terms)
            );
        },
        /**
         * Return list of bibliography entry indices (based on @data-src-index value)
         * reflecting the current list of active terms, given the search mode.
         * @todo Make search case-insensitive
         * @public
         * @method
         * @instance
         */
        filter_indices : function() {
            var search_data     = this.document_data
              , result_indices  = filter.all_filter_indices()
              , mode            = this.current_search_mode
              , terms           = this.active_search_terms
              , list_indices, item_indices, i;
            if (terms.length > 0) {
                list_indices = null;
                for (i = 0; i < terms.length; i++) {
                    item_indices = search_data[terms[i]];
                    list_indices = list_indices || item_indices;
                    if (mode === filter.filter_mode_union) {
                        list_indices = _.union(list_indices,item_indices);
                    } else {
                        list_indices = _.intersection(list_indices,item_indices);
                    }
                }
                result_indices = _.intersection(result_indices, list_indices);
            }
            return result_indices;
        },
        /**
         * Return list of terms to be highlighted (active search terms).
         * @method
         * @public
         * @instance
         */
        highlight_items : function() {
            return { "term" : this.active_search_terms };
        }
    };
});
