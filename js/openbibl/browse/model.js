define(
  [ 'module', 'obpconfig', 'obpstate', 'jquery', 'obpev', 'underscore', '../filter' ]
, function(module,obpconfig,obpstate,$,obpev,_,filter) {
    return {
          init : function() {}
        , browse_data       : null
        , browse_lists      : []
        , handle_query_data : function() {
            this.browse_data = obpstate.query.data.browse;
        }
        , toggle_term : function(item) {
            var list = item.list;
            var term = item.term;
            var mode = item.mode;
            var browse_obj;
            for (var i = 0; i < this.browse_lists.length; i++) {
                if (this.browse_lists[i]["list"] === list) {
                    browse_obj = this.browse_lists.splice(i,1)[0];
                    break;
                }
            }
            if (browse_obj === undefined) {
                browse_obj = {
                      terms : []
                    , list  : list
                    , mode  : mode
                };
            }
            var current_terms = browse_obj.terms || [];
            if (_.indexOf(current_terms,term) === -1) {
                this.add_term(browse_obj,term,mode,current_terms)
            } else {
                this.remove_term(browse_obj,term,mode,current_terms);
            }
        }
        , add_term : function(browse_obj,term,mode,current_terms) {
            current_terms.push(term);
            browse_obj.terms = current_terms;
            browse_obj.mode = mode;
            this.browse_lists.push(browse_obj);
        }
        , remove_term : function(browse_obj,term,mode,current_terms) {
            browse_obj.terms = _.difference(_.toArray(current_terms),term);
            browse_obj.mode = mode;
            this.browse_lists.push(browse_obj);
        }
        , remove_terms : function(item) {
            var list = item.list;
            var mode = item.mode;
            var browse_obj;
            for (var i = 0; i < this.browse_lists.length; i++) {
                if (this.browse_lists[i]["list"] === list) {
                    browse_obj = this.browse_lists.splice(i,1)[0];
                    break;
                }
            }
            if (browse_obj === undefined) {
                browse_obj = {
                      terms : []
                    , list  : list
                    , mode  : mode
                };
            }
            browse_obj.terms = [];
            browse_obj.mode = mode;
            this.browse_lists.push(browse_obj);
        }

        , filter_indices : function() {
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
        , filter_mode_change : function(list_type,new_mode) {
            for (var i = 0; i < this.browse_lists.length; i++) {
                if( this.browse_lists[i]["list"] === list_type) {
                    this.browse_lists[i]["mode"] = new_mode;
                    break;
                }
            }
        }
    }
});