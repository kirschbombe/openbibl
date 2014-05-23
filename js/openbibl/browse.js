define(
[ 'module', 'jquery', 'obpev', './browse/model', './browse/view' ]
, function(module, $, obpev, model, view) {
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
    obpev.subscribe("obp:browse-term-change", module.id, function() {
        view.browse_term_change();
    });
    obpev.subscribe("obp:filter-mode-change", module.id, function() {
        model.filter_mode_change(event);
    });    
    return {
        filter_indices : function() {
            return model.filter_indices();
        }
        , highlight_items : function() {
            return model.highlight_items();
        }
        , handle_query_data : function() {
            model.handle_query_data();
        }
        , highlight_items : function() {
            var items = [];
            var lists = model.browse_lists;
            for (var i = 0; i < lists.length; i++) {
                var checked_items = lists[i]["terms"] || [];
                for (var j = 0; j < checked_items.length; j++) {
                    items.push(
                          "[data-ed-ref='"
                        + checked_items[j]
                        + "']"
                    );
                }
            }
            return { "element" : items };
        }
    };
});
