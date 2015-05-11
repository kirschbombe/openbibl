/*
* Openbibl Framework v0.1.0
* Copyright 2014, Dawn Childress
* Contact: https://github.com/kirschbombe/openbibl
* License: GNU AGPL v3 (https://github.com/kirschbombe/openbibl/LICENSE)
*/
/*jslint white: true, todo: true, nomen: true, plusplus: true */
/*global define: true */
/**
 * Bibliography entry filter controller.
 *
 * @module openbibl/filter
 */
define(
  [ 'module', 'underscore', 'obpstate', 'jquery', 'obpev' ]
, function(module,_,obpstate,$,obpev) {
    'use strict';
    return {
        /**
         * Initialize the filter controller.
         * @sources {array} sources of bibliography entry index lists, e.g., the openbibl/browse controller
         * @method
         * @public
         * @instance
         */
        init : function(sources) {
            var filter = this;
            if (sources instanceof Array) {
                this.sources = sources;
            } else if (typeof sources === 'string') {
                this.sources = [sources];
            } else {
                this.sources = [];
            }
            obpev.subscribe("obp:filter-change", module.id, function() {
                filter.filter_entries();
            });
        },
        /**
         * Array of sources (e.g., openbibl/browse controller object) providing
         * filter data for a filter operation. A filter source implements a method
         * 'filter_indices()' that is called whenever a filtering operation occurs,
         * which provides the indices reflecting the current subset for that provider.
         * @property
         * @private
         */
        sources : [],
        /**
         * Name of the filtering mode for a set-union operation. Used both in
         * JS code and in the xsl/openbibl.boot.xsl stylesheet.
         * @constant
         * @public
         */
        filter_mode_union         : 'obp-filter-union',
        /**
         * Name of the filtering mode for a set-intersection operation. Used both in
         * JS code and in the xsl/openbibl.boot.xsl stylesheet.
         * @constant
         * @public
         */
        filter_mode_intersection  : 'obp-filter-intersection',
        /**
         * Name of the default filtering mode.
         * @constant
         * @public
         */
        filter_mode_default       : 'obp-filter-intersection',
        /**
         * Method to return an array of values of the div[class="entry"]/@data-src-index
         * attributes for all bibliography entries in the bibliography. Used as a
         * starting point for set operations in the filter-source providers.
         * @returns {array} list of integers corresponding to all entries
         * @method
         * @public
         * @instance
         */
        all_filter_indices : function() {
            var max = obpstate.bibliographies.count - 1
              , ret = []
              , i;
            for(i = 0; i <= max; i++) {
                ret.push(i);
            }
            return ret;
        },
        /**
         * Method invoked on the 'obp:filter-change' event. Results in each of the
         * providers of filtering data being queried for their current bibliography
         * entries to be considered "active" according to their (browse/search)
         * functionality. Performs updates to the HTML view.
         * @method
         * @public
         * @instance
         */
        filter_entries : function() {
            var i = 0
              , result_indices = []    // indices that should be displayed
              , all_indices = []       // just a list of all bibl entries
              , current_indices, store_indices, $div;
            // restore all hidden entries
            /*jslint unparam: true*/
            $('#bibliographies').find('div.entry').each(function(i,elt) {
                $(elt).show();
            });
            obpev.raise("obp:bibliography-added", module.id);
            all_indices = result_indices = this.all_filter_indices();
            for (i = 0; i < this.sources.length; i++) {
                current_indices = this.sources[i].filter_indices();
                result_indices = _.intersection(result_indices, current_indices);
            }
            store_indices = _.difference(all_indices,result_indices);
            // entries to be moved from the #bibliographies to storage
            for (i = 0; i < store_indices.length; i++) {
                $div = $('div[data-src-index="' + store_indices[i] + '"]');
                if ($div.length > 0) {
                    $div.hide();
                }
            }
            obpev.raise("obp:filter-complete", module.id);
        }
    };
});
