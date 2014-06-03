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
  [ 'module', 'obpconfig', 'jquery', 'obpev', 'domReady', 'underscore', './model', '../filter' , 'typeahead' ]
, function(module,obpconfig,$,obpev,domReady,_,model,filter) {
    'use strict';
    var search;
    return {
        init : function(s) {
            search = s;
            var view = this;
            _.templateSettings = {
                interpolate: (new RegExp(obpconfig.template_pattern))
            };
            obpev.subscribe("obp:search-term-change", module.id, function() {
                view.search_change();
            });
            domReady(function(){
                $('.obp-search-clear').click(function(event){
                    var search_terms = $(event.target)
                        .closest('.obp-search-panel')
                        .find('a.obp-search-item')
                        .map(function(){
                            return this.getAttribute('data-selection');
                        });
                    search.remove_terms(search_terms);
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
                view.retrieve_templates();
                $('.search-input').typeahead({
                      "items"   : obpconfig.typeahead.list_len
                    , "matcher" : view.matcher
                    , "source"  : view.source
                    , "updater" : view.updater
                });
            });
        },
        /**
         * Compiled Underscore partial-view templates used by this view.
         * Maps the name of the template to the function used to produce
         * the final partial view.
         * @property
         * @private
         */
        compiled_templates : {
            'search.term-li.handlebars': null   // string -> function
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
         * Initialization method to retrieve and compile all partial-view
         * templates used in this view module.
         * @method
         * @private
         * @instance
         */
        retrieve_templates : function() {
            var view = this;
            Object.keys(view.compiled_templates).map(function(template) {
                view.retrieve_template(template);
            });
        },
        /**
         * Method to retrieve (via AJAX for XML scenario, or from serialized
         * config in HTML scenario) a named partial-view template.
         * @param {string} name of template to retrieve and compile
         * @todo Disable search or add fallback functionality when template
         *       data cannot be retrieved
         * @method
         * @private
         * @instance
         */
        retrieve_template : function(template) {
            var view = this
              , path;
            if (obpconfig.templates[template] === undefined) {
                /*jslint unparam: true */
                path = obpconfig.paths.template_dir + '/' + template;
                $.ajax({
                      url:        path
                    , async:      obpconfig.async
                    , cache:      false
                    , success:    function(data) {
                        obpconfig.templates[template] = data;
                        view.compiled_templates[template] = _.template(data);
                    }
                    , error : function(jqXHR, textStatus, errorThrown) {
                        if (obpconfig.debug) {
                            obpconfig.console.log("Seach-template AJAX error for template '"+ template + "': " + textStatus);
                        }
                    }
                });
           } else {
                view.compiled_templates[template] = _.template(obpconfig.templates[template]);
            }
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
            var active_search_terms = search.active_search_terms()
              , search_rows, i, new_row, $tbody, term;
            $('.' + search.term_list_item_class ).parent().remove();
            search_rows = [];
            for (i = 0; i < active_search_terms.length; i++) {
                new_row = this.compiled_templates['search.term-li.handlebars']({
                    "cls"   : search.term_list_item_class,
                    "term"  : active_search_terms[i]
                });
                search_rows.push(new_row);
            }
            if (search_rows.length > 0) {
                /*jslint unparam: true */
                $('.obp-search-results-list').each(function(i,elt){
                    $tbody = $(elt);
                    $tbody.append(search_rows);
                });
                $('.' + search.term_list_item_class).click(function(e) {
                    term = e.target.parentElement.getAttribute('data-selection');
                    if (term) {
                        search.remove_terms([term]);
                    }
                });
            }
        }
    };
});
