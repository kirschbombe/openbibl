/*
* Openbibl Framework v0.1.0
* Copyright 2014, Dawn Childress
* Contact: https://github.com/kirschbombe/openbibl
* License: GNU AGPL v3 (https://github.com/kirschbombe/openbibl/LICENSE)
*/
/*jslint white: true, nomen: true, plusplus: true */
/*global define: true */
/**
 * UI view for index-based browse functionality.
 *
 * @module openbibl/browse/view
 */
define(
[ 'module', 'jquery', 'obpev', './model' ]
, function(module, $, obpev, model) {
    'use strict';
    var browse;
    return {
        /**
         * Initializer for openbibl/browse/view object. Used to subscribe
         * the browse object to DOM events for browse UI widgets as well as to
         * Openbibl framework events.
         * @method
         * @public
         * @instance
         */
        init : function(b) {
            var view = this;
            browse = b; // required for circular dependency?
            obpev.subscribe("obp:browse-term-change", module.id, function() {
                view.browse_term_change();
            });
            $('.obp-filter-mode').on('change', function(event) {
                view.filter_mode_change(event);
            });
            $('.obp-browse-checkbox').click(function(event){
                view.browse_checkbox_click(event);
            });
            $('.obp-browse-clear').click(function(event){
                view.browse_clear_click(event);
                event.preventDefault();
            });
        },
        /**
         * Callback to handle user click on a browse-item checkbox.
         * @callback
         * @private
         * @instance
         */
        browse_checkbox_click : function(event) {
            var $target = $(event.target),
                $list = $target.closest('.obp-browse-list');
            browse.toggle_term(
                  $list.attr('data-ed-list')
                , event.target.getAttribute('data-browse-item')
                , $list.find('.obp-filter-mode:checked').val()
            );
        },
        /**
         * Callback to handle user click on the clear-all browse-item button.
         * @callback
         * @private
         * @instance
         */
        browse_clear_click : function(event) {
            var $list = $(event.target).closest('.obp-browse-list');
            browse.remove_terms(
                  $list.attr('data-ed-list')
                , $list.find('.obp-filter-mode:checked').val()
            );
        },
        /**
         * Callback for hooking the browse object to the obp:browse-term-change
         * event.
         * @callback
         * @private
         * @instance
         */
        browse_term_change : function() {
            var i, j, terms;
            // clear UI checkboxes
            $('.obp-browse-checkbox:checked').prop('checked', '');
            // re-sync UI checkboxes with this datamodel
            for (i = 0; i < model.browse_lists.length; i++) {
                terms = model.browse_lists[i].terms || [];
                for (j = 0; j < terms.length; j++) {
                    $('.obp-browse-checkbox[data-browse-item="' + terms[j] + '"]').prop('checked', 'checked');
                }
            }
        },
        /**
         * Callback for hooking the browse object to the click() event for a change
         * in a browse-list's filter mode.
         * @callback
         * @private
         * @instance
         */
        filter_mode_change : function(event) {
            var $this = $(event.target),
                list_type = $this.closest('.obp-browse-list').attr('data-ed-list'),
                browse_mode;
            if (list_type !== undefined) {
                browse_mode = $this.val();
                browse.filter_mode_change(list_type,browse_mode);
            }
        }
    };
});