(function() {
"use strict";
    window.obp.browse.init = function() {
        $('.obp-browse-checkbox').click(function(event){
            var $list = $(event.target).closest('.obp-browse-list')
            var item = {
                term : event.target.getAttribute('data-browse-item'),
                list : $list.attr('data-ed-list'),
                mode : $list.find('.obp-filter-mode:checked').val()
            };
            if (event.target.checked === true) {
                window.obp.browse.model.add_term(item)
            } else {
                window.obp.browse.model.remove_term(item)
            }
        });
        $('.obp-browse-clear').click(function(event){
            var $list = $(event.target).closest('.obp-browse-list');
            var list_type = $list.attr('data-ed-list');
            var list_mode = $list.find('.obp-filter-mode:checked').val();
            window.obp.browse.model.remove_term({
                list: list_type,
                mode: list_mode
            });
            $list.find('.obp-browse-checkbox:checked').each(function(i,elt){
                elt.checked = false;
            });
            event.preventDefault();
        });
        window.obp.event["target"].on(obp.event["events"]["obp:browse-term-change"], function() {
            window.obp.browse.view.browse_term_change();
        });
    }
    window.obp.browse.filter_indices = function() {
        return this.model.filter_indices();
    }
    window.obp.browse.highlight_items = function() {
        return this.model.highlight_items();
    }
    window.obp.browse.handle_query_data = function(data) {
        this.model.handle_query_data(data);
    }
    window.obp.browse.filter_mode_change = function(event) {
        window.obp.browse.model.filter_mode_change(event);
    }

    // browse view --------------------------
    window.obp.browse.view = {};
    window.obp.browse.view.browse_term_change = function() {
        var browse = window.obp.browse;
        // clear UI checkboxes
        $('.obp-browse-checkbox').map(function(i,elt) {
            elt.checked = false
        });
        // re-sync UI checkboxes with this datamodel
        for ( var i = 0; i < browse.model.browse_lists.length; i++) {
            var list = browse.model.browse_lists[i]["list"];
            var terms = browse.model.browse_lists[i]["terms"] || [];
            for (var j = 0; j < terms.length; j++) {
                $('.obp-browse-checkbox[data-browse-item="' + terms[j] + '"]').each(function(i,elt){
                    elt.checked = true;
                });
            }
        }
    }

    // browse model --------------------------

    window.obp.browse.model = {};
    window.obp.browse.model.browse_data = null;
    window.obp.browse.model.browse_lists = [];
    window.obp.browse.model.handle_query_data = function(data) {
        window.obp.browse.model.browse_data = data["browse"];
    }
    window.obp.browse.model.filter_mode_change = function(event) {
        var model = this;
        var $this = $(event.target);
        var list_type = $this.closest('.obp-browse-list').attr('data-ed-list');
        if (list_type !== undefined) {
            var browse_mode = $this.val();
            for (var i = 0; i < model.browse_lists.length; i++) {
                if (model.browse_lists[i]["list"] === list_type) {
                    model.browse_lists[i]["mode"] = browse_mode;
                }
            }
        }
    }
    window.obp.browse.model.add_term = function(item) {
        var list = item["list"];
        var term = item["term"];
        var mode = item["mode"];
        var browse_obj;
        for (var i = 0; i < this.browse_lists.length; i++) {
            if (this.browse_lists[i]["list"] === list) {
                browse_obj = this.browse_lists.splice(i,1)[0];
                break;
            }
        }
        if (browse_obj === undefined) {
            browse_obj = {
                terms : [],
                list  : list
            };
        }
        var current_terms = browse_obj["terms"] || [];
        if (_.indexOf(current_terms,term) !== -1) return;
        current_terms.push(term);
        browse_obj["terms"] = current_terms;
        browse_obj["mode"] = mode;
        this.browse_lists.push(browse_obj);
        window.obp.event["target"].trigger(obp.event["events"]["obp:browse-term-change"]);
        window.obp.event["target"].trigger(obp.event["events"]["obp:filter-change"]);
    }
    window.obp.browse.model.remove_term = function(item) {
        var list = item["list"];
        var term = item["term"];
        var mode = item["mode"];
        var browse_obj;
        for (var i = 0; i < this.browse_lists.length; i++) {
            if (this.browse_lists[i]["list"] === list) {
                browse_obj = this.browse_lists.splice(i,1)[0];
                break;
            }
        }
        if (browse_obj === undefined || term === undefined) {
            browse_obj = {
                terms : [],
                list  : list,
                mode  : mode
            };
        }
        if (term !== undefined) {
            var current_terms = browse_obj["terms"] || [];
            browse_obj["terms"] = _.difference(_.toArray(current_terms),term);
            browse_obj["mode"] = mode;
        }
        this.browse_lists.push(browse_obj);
        window.obp.event["target"].trigger(obp.event["events"]["obp:browse-term-change"]);
        window.obp.event["target"].trigger(obp.event["events"]["obp:filter-change"]);
    }
    window.obp.browse.model.filter_indices = function() {
        var filter          = window.obp.filter;
        var result_indices  = filter.all_filter_indices();
        var browse_data     = this.browse_data;
        for (var i = 0; i < this.browse_lists.length; i++) {
            var list_type     = this.browse_lists[i]["list"];
            var mode          = this.browse_lists[i]["mode"];
            var checked_items = this.browse_lists[i]["terms"];
            var list_indices;
            if (checked_items.length > 0) {
                for (var i = 0; i < checked_items.length; i++) {
                    var item_id = checked_items[i];
                    var item_indices = browse_data[list_type][item_id];
                    list_indices = list_indices || item_indices;
                    if (mode === filter.filter_mode_union) {
                        list_indices = _.union(list_indices,item_indices);
                    } else {
                        list_indices = _.intersection(list_indices,item_indices);
                    }
                }
                list_indices = list_indices || [];
                // note: this is always an intersection, regardless of an
                // individual browse-list's mode
                result_indices = _.intersection(result_indices, list_indices);
            }
        }
        return result_indices;
    }
    window.obp.browse.highlight_items = function() {
        var items = [];
        var lists = window.obp.browse.model.browse_lists;
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
})();
