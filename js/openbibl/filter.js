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
         *
         */
        init : function(sources) {
            var filter = this;
            this.sources = sources;
            obpev.subscribe("obp:filter-change", module.id, function() {
                filter.filter_entries();
            });
        },
        /**
         *
         */
        sources : [],
        /**
         *
         */
        filter_mode_union         : 'obp-filter-union',
        /**
         *
         */
        filter_mode_intersection  : 'obp-filter-intersection',
        /**
         *
         */
        filter_mode_default       : 'obp-filter-intersection',
        /**
         *
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
         *
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
            all_indices = this.all_filter_indices();
            result_indices = all_indices;
            for (i = 0; i < this.sources.length; i++) {
                current_indices = this.sources[i].filter_indices();
                // if (current_indices.length === 0) continue;
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
