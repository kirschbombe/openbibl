define(
  [ 'module', 'obpconfig', 'obpstate', 'jquery', 'obpev' ]
, function(module,obpconfig,obpstate,$,obpev) {
    return {
          id : module.id
        , init : function(sources) {
                var filter = this;
                this.sources = sources;
                obpev.subscribe("obp:filter-change", this.id, function() {
                    filter.filter_entries();
                });
        }
        , sources : []
        , filter_mode_union : 'obp-filter-union'
        , filter_mode_intersection : 'obp-filter-intersection'
        , filter_mode_default : 'obp-filter-intersection'
        , all_filter_indices : function() {
            var all_indices = []
            for (var i = 0; i < obpstate.bibliographies.count; i++) { all_indices.push(i) }
            return all_indices;
        }
        , filter_entries : function() {
            var i = 0, j = 0,
                result_indices = [],    // indices that should be displayed
                all_indices = [];       // just a list of all bibl entries
            // restore all hidden entries
            $('#bibliographies').find('div.entry').each(function(i,elt) {
                $(elt).show();
            });
            obpev.raise("obp:filter-start", this.id);
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
            obpev.raise("obp:filter-complete",this.id);
        }
    }
});
