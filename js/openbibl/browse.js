define(
[ 'module', 'jquery', 'obpev', 'obpstate', 'browse/model', 'browse/view' ]
, function(module, $, obpev, obpstate, model, view) {
    return {
          init : function() {
            model.init();
            view.init();
            $('.obp-browse-checkbox').click(function(event){
                var $target = $(event.target);
                var $list = $target.closest('.obp-browse-list')
                var item = {
                    term : event.target.getAttribute('data-browse-item'),
                    list : $list.attr('data-ed-list'),
                    mode : $list.find('.obp-filter-mode:checked').val()
                };
                model.toggle_term(item);
                obpev.raise("obp:browse-term-change",module.id)
                obpev.raise("obp:filter-change",module.id);
            });
            $('.obp-browse-clear').click(function(event){
                var $list = $(event.target).closest('.obp-browse-list');
                var list_type = $list.attr('data-ed-list');
                var list_mode = $list.find('.obp-filter-mode:checked').val();
                model.remove_terms({
                    list: list_type,
                    mode: list_mode
                });
                obpev.raise("obp:browse-term-change",module.id)
                obpev.raise("obp:filter-change",module.id);
                event.preventDefault();
            });
          }
        , filter_indices : function() {
            return model.filter_indices();
        }
        , highlight_items : function() {
            return model.highlight_items();
        }
        , handle_query_data : function() {
            model.handle_query_data(obpstate.query.data.browse);
        }
    };
});
