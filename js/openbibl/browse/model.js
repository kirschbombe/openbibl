/*
* Openbibl Framework v0.1.0
* Copyright 2014, Dawn Childress
* Contact: https://github.com/kirschbombe/openbibl
* License: GNU AGPL v3 (https://github.com/kirschbombe/openbibl/LICENSE)
*/
/*jslint white: true, nomen: true, plusplus: true */
/*global define: true */
/**
 * Data model for UI state for editorial-index based browse/filter functionality.
 *
 * @module openbibl/browse/model
 */
define(
  [ 'underscore', 'filter' ]
, function(_,filter) {
    'use strict';
    return {
        /**
         * Filter index data retrieved by openbibl/query module
         * @property
         * @private
         */
        browse_data : {},
        /**
         * Browse list types currently in use (e.g., listPerson, listPlace). A list type corresponds
         * to a //div[@type='editorial'] from the TEI XML file loaded.
         * @property
         * @private
         */
        browse_lists : [],
        /**
         * Setter for data used by browse/filter functionality.
         * @param {object} data returned by openbibl/query module
         * @method
         * @public
         * @instance
         */
        handle_query_data : function(new_query_data) {
            this.browse_data = new_query_data || {};
        },
        /**
         * Set/unset "active" state of browse item.
         * @param {string} list type for toggled term
         * @param {string} value of toggled term
         * @param {string} filter mode of list
         * @method
         * @public
         * @instance
         */
        toggle_term : function(list,term,mode) {
            var browse_obj, i, current_terms;
            for (i = 0; i < this.browse_lists.length; i++) {
                if (this.browse_lists[i].list === list) {
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
            current_terms = browse_obj.terms || [];
            if (_.indexOf(current_terms,term) === -1) {
                this.add_term(browse_obj,term,mode,current_terms);
            } else {
                this.remove_term(browse_obj,term,mode,current_terms);
            }
        },
        /**
         * Add new term to list of "active" browse terms.
         * @param {object} object representing one browse list-type
         * @param {string} term to add
         * @param {string} current browsing mode
         * @param {array} current list of active terms
         * @method
         * @public
         * @instance
         */
        add_term : function(browse_obj,term,mode,current_terms) {
            current_terms.push(term);
            browse_obj.terms = current_terms;
            browse_obj.mode = mode;
            this.browse_lists.push(browse_obj);
        },
        /**
         * Return list of @data-ed-ref attributes to be considered
         * active in the current state of the browse filter.
         * Since "browse" items are tagged content, the list is keyed
         * to "element" for handling by the openbibl/highlight module.
         * @returns {object} map of "element" to a list of indices
         * @method
         * @public
         * @instance
         */
        highlight_items : function() {
            var items = [],
                lists = this.browse_lists,
                i, j, checked_items;
            for (i = 0; i < lists.length; i++) {
                checked_items = lists[i].terms || [];
                for (j = 0; j < checked_items.length; j++) {
                    items.push("[data-ed-ref='" + checked_items[j] + "']");
                }
            }
            return { "element" : items };
        },
        /**
         * De-activate all filter items from the provided list
         * @param {string} list type of terms
         * @param {string} current list mode
         * @method
         * @public
         * @instance
         */
        remove_terms : function(list,mode) {
            var browse_obj, i;
            for (i = 0; i < this.browse_lists.length; i++) {
                if (this.browse_lists[i].list === list) {
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
        },
        /**
         * Remove term from list of "active" browse terms.
         * @param {object} object representing one browse list-type
         * @param {string} term value
         * @param {string} current browse mode
         * @param {array} current active browse terms
         * @method
         * @private
         * @instance
         */
        remove_term : function(browse_obj,term,mode,current_terms) {
            browse_obj.terms = _.difference(_.toArray(current_terms),term);
            browse_obj.mode = mode;
            this.browse_lists.push(browse_obj);
        },
        /**
         * Return the set of indices resulting from doing
         * a set union or set intersection of the "active"
         * filter items.
         * @returns {Array} list of bibliography entry indices
         * @method
         * @public
         * @instance
         */
        filter_indices : function() {
            var result_indices  = filter.all_filter_indices(),
                browse_data     = this.browse_data,
                i, j, list_type, mode, checked_items,
                list_indices, item_id, item_indices;
            for (i = 0; i < this.browse_lists.length; i++) {
                list_type     = this.browse_lists[i].list;
                mode          = this.browse_lists[i].mode;
                checked_items = this.browse_lists[i].terms;
                list_indices  = null;
                if (checked_items.length > 0) {
                    for (j = 0; j < checked_items.length; j++) {
                        item_id = checked_items[j];
                        item_indices = browse_data[list_type][item_id];
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
        },
        /**
         * Set the current filter mode for the given filter list type.
         * @param {string} list type
         * @param {string} filter mode
         * @method
         * @public
         * @instance
         */
        filter_mode_change : function(list_type,new_mode) {
            var i;
            for (i = 0; i < this.browse_lists.length; i++) {
                if( this.browse_lists[i].list === list_type) {
                    this.browse_lists[i].mode = new_mode;
                    break;
                }
            }
        }
    };
});