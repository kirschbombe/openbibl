(function() {
"use strict";
    window.obp.filter.sources = [];
    window.obp.filter.filter_mode_union = 'obp-filter-union';
    window.obp.filter.filter_mode_intersection = 'obp-filter-intersection';
    window.obp.filter.filter_mode_default = window.obp.filter.filter_mode_intersection;
    window.obp.filter.init = function(sources) {
        this.sources = sources;
        window.obp.event["target"].on(obp.event["events"]["obp:filter-change"], function() {
            window.obp.filter.filter_entries();
        });
    }
    window.obp.filter.all_filter_indices = function() {
        var all_indices = []
        for (var i = 0; i < obp.bibliographies.count; i++) { all_indices.push(i) }
        return all_indices;
    }
    window.obp.filter.filter_entries = function() {
        var obp = window.obp,
            i = 0, j = 0,
            result_indices = [],    // indices that should be displayed
            all_indices = [];       // just a list of all bibl entries
        // restore all hidden entries
        $('#bibliographies').find('div.entry').each(function(i,elt) {
            $(elt).show();
        });
        window.obp.event["target"].trigger(obp.event["events"]["obp:filter-start"]);
        all_indices = this.all_filter_indices();
        result_indices = all_indices;
        for (i = 0; i < this.sources.length; i++) {
            var current_indices = this.sources[i].filter_indices();
            // if (current_indices.length === 0) continue;
            result_indices = _.intersection(result_indices, current_indices);
        }
        var store_indices = _.difference(all_indices,result_indices);
        // entries to be moved from the #bibliographies to storage
        for (i = 0; i < store_indices.length; i++) {
            var $div = $('div[data-src-index="' + store_indices[i] + '"]');
            if ($div.length > 0)
                $div.hide();
        }
        window.obp.event["target"].trigger(obp.event["events"]["obp:filter-complete"]);
    }
})();
