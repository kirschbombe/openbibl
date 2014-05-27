define(
  [ 'module', 'jquery', 'obpev', 'search/model', 'search/view' ]
, function(module,$,obpev,model,view) {
    // set focus for search <input> when made visible
    $('.obp-search-panel').bind('shown.bs.collapse', function() {
        $(this).find('.obp-search-panel-input').focus();
    });
    $('.obp-search-form').on('submit', function(event) {
        // prevent the search field from causing a page
        // reload when a typeahead suggestion is unavailable
        event.preventDefault();
    });
    return { 
          init : function() {
            var search = this;
            view.init(this);
            $('.obp-search-clear').click(function(event){
                // TODO: handle this better
                var search_terms = $(event.target)
                    .closest('.obp-search-panel')
                    .find('a.obp-search-item')
                    .map(function(elt){
                        return this.getAttribute('data-selection');
                    });
                search.remove_terms(search_terms);
                event.preventDefault();
            });
            $('.obp-filter-mode').change(function(event){
                search.filter_mode_change(event);
            });
          }
        , term_list_item_class : 'obp-search-item'
        , filter_indices : function() {
            return model.filter_indices();
        }
        , highlight_items : function() {
            return model.highlight_items();
        }
        , handle_query_data : function() {
            model.handle_query_data();
        }
        , remove_terms : function(terms) {
            model.remove_terms(terms);
        }
        , filter_mode_change : function(event) {
            model.filter_mode_change(event);
        }
        , active_search_terms : function() {
            return model.active_search_terms;
        }
        , add_term : function(term) {
            model.add_term(term);
        }
        , remove_terms : function(terms) {
            model.remove_terms(terms);
        }
    };
});
