/*
* Openbibl Framework v0.1.0
* Copyright 2014, Dawn Childress
* Contact: https://github.com/kirschbombe/openbibl
* License: GNU AGPL v3 (https://github.com/kirschbombe/openbibl/LICENSE)
*/
/*jslint white: true, nomen: true, plusplus: true, todo: true */
/*global define: true */
/**
 * UI view for search-term functionality.
 *
 * @module openbibl/search/view
 */
define(
  [ 'module', 'obpconfig', 'jquery', 'obpev', 'domReady', 'underscore', './model', '../filter', 'saxon', 'typeahead' ]
, function(module,obpconfig,$,obpev,domReady,_,model,filter,saxon) {
    'use strict';
    var search;
    return {
        init : function(s) {
            search = s;
            var view = this;
            obpev.subscribe("obp:search-term-change", module.id, function() {
                view.search_change();
            });
            domReady(function(){
                $('.obp-search-clear').click(function(event){
                    search.clear_terms();
                    event.preventDefault();
                });
                $('.obp-filter-mode').change(function(event){
                    search.filter_mode_change($(event.target).val());
                });
                // set focus for search <input> when made visible
                $('.obp-search-panel').bind('shown.bs.collapse', function() {
                    $(this).find('.obp-search-panel-input').focus();
                });
                $('.obp-search-form').on('submit', function(event) {
                    // prevent the search field from causing a page
                    // reload when a typeahead suggestion is unavailable
                    event.preventDefault();
                });
                $('.search-input').typeahead({
                      "items"   : obpconfig.typeahead.list_len
                    , "matcher" : view.matcher
                    , "source"  : view.source
                    , "updater" : view.updater
                });
            });
        },
        /**
         * The current filter mode of the search control.
         * @property
         * @public
         */
        current_search_mode : filter.filter_mode_default,
        /**
         * Method called when the search filter-mode has been changed by the user.
         * @param {string} new value for the filter mode
         * @method
         * @public
         * @instance
         */
        filter_mode_change : function(val) {
            this.current_search_mode = val;
        },
        /**
         * Callback to return a list of possible search terms, produced by removing currently active
         * search terms from all search terms.
         * @todo don't inspect model's data directly
         * @callback
         * @private
         * @instance
         */
        source : function() {
            return _.without(
                Object.keys(model.document_data),
                search.active_search_terms()
            );
        },
        /**
         * Callback for typeahead search field item matching. Called by
         * Typeahead object, and 'this' is that object.
         * @param {string} one search term value loaded into search field
         * @todo parameterize case-insensitivity
         * @callback
         * @private
         * @instance
         */
        matcher : function(item) {
            return new RegExp("^" + this.query, "i").test(item);
        },
        /**
         * Callback on user selection of tyepahead search term. Called
         * by Typeahead object, and 'this' is that object.
         * @callback
         * @private
         * @instance
         */
        updater : function(selection) {
            $('.typeahead').val('');
            search.add_term(selection);
        },
        /**
         * Callback to update currently displayed search terms.
         * @callback
         * @private
         * @instance
         */
        search_change : function() {
            /*jslint unparam: true */
            var active_search_terms = search.active_search_terms()
              , term, path, success;
            $('.' + search.term_list_item_class ).parent().remove();
            success = function() {
                $('.' + search.term_list_item_class).click(function(e) {
                    term = e.target.parentElement.getAttribute('data-selection');
                    if (term) {
                        search.remove_terms([term]);
                    }
                });
            };
            active_search_terms.forEach(function(term){
                /*jslint unparam: true */
                $('.obp-search-results-list').each(function(i,elt) {
                    // xpath to match the the current search term list
                    // Saxon appends to the first xpath match, so we need to
                    // call the transform once for each list
                    path = '(//ul[contains(./@class,"obp-search-results-list")])[' + (i + 1) + ']';
                    saxon.requestTransform({
                          initialTemplate   : 'main'
                        , method            : 'updateHTMLDocument'
                        , parameters        : {   class     : search.term_list_item_class
                                                , term      : term
                                                , "list-path" :  path
                                            }
                        , stylesheet        : obpconfig.path('search_xsl')
                        , success           : success
                    });
                });
            });
        }
    };
});
