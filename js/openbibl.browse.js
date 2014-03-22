(function() {
"use strict";
    window.obp.browse.browse_data = {};
    window.obp.browse.handle_query_data = function(data) {
        window.obp.browse.browse_data = data["browse"];
    }
    window.obp.browse.clear_browse_items = function(target) {
        var list_elt = $(target).closest('.obp-browse-list');
        $(list_elt).find('.obp-browse-checkbox:checked').map(function(i,elt) {
            $(this).click();
        });        
    }
    window.obp.browse.filter_indices = function() {
        var browse          = window.obp.browse;
        var filter          = window.obp.filter;
        var browse_data     = browse.browse_data;
        var result_indices  = filter.all_filter_indices();
        $('.obp-browse-list').each(function(i,elt) {
            var $list = $(this);
            var list_elt_id = $list.closest('.obp-browse-list')[0].getAttribute('id');
            
            var mode = $list.find('.obp-filter-mode:checked').val();
            var list_indices;
            var checked_items = $list.find('.obp-browse-checkbox:checked');
            if (checked_items.length > 0) {
                $(checked_items).each(function(i,elt) {
                    var $item = $(this);
                    var item_id = $item.attr('data-browse-item');
                    var item_indices = browse_data[list_elt_id][item_id];
                    list_indices = list_indices || item_indices;
                    if (mode === filter.filter_mode_union) {
                        list_indices = _.union(list_indices,item_indices);
                    } else {
                        list_indices = _.intersection(list_indices,item_indices);
                    }
                });
                list_indices = list_indices || [];
                // note: this is always an intersection, regardless of an
                // individual browse-list's mode
                result_indices = _.intersection(result_indices, list_indices);
            }
        });
        return result_indices;
    }
    // TODO: for efficiency, have these filtered down
    window.obp.browse.highlight_items = function() {
        var items = [];
        var checked_items = $('.obp-browse-checkbox:checked');
        if (checked_items.length > 0) {
            $(checked_items).each(function(i,elt) {
                items.push(
                      "[data-ed-ref='" 
                    + $(this).attr('data-browse-item') 
                    + "']"
                );
            });
        }
        return { "element" : items };
    }
})();













