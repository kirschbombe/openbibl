
define(
  [ 'module', 'obpconfig', 'obpstate', 'jquery', 'obpev', '../filter' ]
, function(module,obpconfig,obpstate,$,obpev,filter) {
    return { 
          filter_mode_change : function(event) {
            this.current_search_mode = $(event.target).val();
        }
        , document_data : {}
        , active_search_terms : []
        , current_search_mode : filter.filter_mode_default
        , to_key : function(item) {
            return String(item).toUpperCase();
        }
        , handle_query_data : function() {
            var i, j;
            var termmap = {};
            var data = obpstate.query.data;
            var len = data.search.length;
            var search_data = data.search;
            for (i = 0; i < len; i+=2) {
                for (j = 0; j < search_data[i].length; j++) {
                    termmap[search_data[i][j]] = search_data[i+1];
                }
            }
            this.document_data = termmap;
        }
        , add_term : function(term) {
            var current_terms = this.active_search_terms || [];
            if (_.indexOf(current_terms,term) !== -1) return;
            current_terms.push(term);
            this.active_search_terms = current_terms;
            obpev.raise("obp:search-term-change",module.id);
            obpev.raise("obp:filter-change",module.id);
        }
        , remove_terms : function(remove_terms) {
            var current_terms = this.active_search_terms || [];
            // TODO: why is toArray() necessary?
            var new_terms = _.difference(_.toArray(current_terms), _.toArray(remove_terms));
            if (new_terms.length === current_terms.length) return;
            this.active_search_terms = new_terms;
            obpev.raise("obp:search-term-change",module.id);
            obpev.raise("obp:filter-change",module.id);
        }
        , filter_indices : function() {
            var search_data     = this.document_data;
            var result_indices  = filter.all_filter_indices();
            var mode = this.current_search_mode;
    
            // TODO: make this search case-insensitive
            var terms = this.active_search_terms;
            if (terms.length > 0) {
                var list_indices;
                for (var i = 0; i < terms.length; i++) {
                    var item_indices = search_data[terms[i]];
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
        }
        , highlight_items : function() {
            return { "term" : this.active_search_terms };
        }
    };
});
