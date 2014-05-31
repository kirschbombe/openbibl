/*
* Openbibl Framework v0.1.0
* Copyright 2014, Dawn Childress
* Contact: https://github.com/kirschbombe/openbibl
* License: GNU AGPL v3 (https://github.com/kirschbombe/openbibl/LICENSE)
*/
/*jslint white: true, todo: true, nomen: true, plusplus: true */
/*global define: true */
/**
 * Openbibl event controller, a simple application synchronization
 * mechanism. Application events are raised by controllers or raised
 * in DOM-event callbacks to signal that some aspect of the application
 * state has changed which
 *
 * <p>For example, the "obp:filter-change" event is raised when a filter
 * item (search term or browse term) is added/removed, which would
 * impact the visibility of bibliography entries. Consequently, the table
 * of contents entries require a recalculation, and this recalculation
 * is triggered by means of the obp:filter-change event, to which the
 * TOC controller subscribes.</p>
 *
 * <p>These events are called without any assurance of ordering. The callbacks
 * fired for a given event are done functionally at random (although in practice
 * according to the alphabetical sort order of the registered object names).</p>
 *
 * @module openbibl/event
 */
define(
  [ 'obpconfig' ]
, function(obpconfig) {
    'use strict';
    /**
     * Event obp:filter-change. Raised by browse and search controllers
     * when user input there changes members of the active search/browse
     * items; triggers recalculation of visible bibliography entries.
     * @constant {string} obp:filter-change
     */
    var obp_filter_change = "obp:filter-change",
    /**
     * Event obp:filter-mode-change. Raised in callback triggered
     * by DOM onchange event for .obp-filter-mode, and by window resize;
     * triggers recalculation of visible bibliography entries.
     * @constant {string} obp:filter-mode-change
     */
    obp_filter_mode_change = "obp:filter-mode-change",
    /**
     * Event obp:filter-complete. Raised by the openbibl/filter controller
     * once the visible bibliographies have been filtered; triggers
     * recalculation in modules controlling sort-order, TOC, and
     * tooltip visibility.
     * @constant {string} obp:filter-complete
     */
    obp_filter_complete = "obp:filter-complete",
    /**
     * Event obp:bibliography-added. Raised by the openbibl/filter
     * and openbibl/sort controllers to signal a change in the visibility
     * or ordering of bibliography entries; triggers recalculation and/or
     * re-initialization in the highlight, TOC, and tooltip modules.
     * Re-initialization would be required due to a change in the Document
     * requiring re-setting DOM event handlers.
     * @constant {string} obp:bibliography-added
     */
    obp_bibliography_added = "obp:bibliography-added",
    /**
     * Event obp:search-term-change. Raised in the openbibl/search
     * controller to signal change (addition or removal) of active
     * search terms; triggers update of the search term view.
     * @constant {string} obp:search-term-change
     */
    obp_search_term_change = "obp:search-term-change",
    /**
     * Event obp:browse-term-change. Raised by the openbibl/browse
     * controller to signal change (addition or removal) of active
     * browse items; triggers update of the browse views.
     * @constant {string} obp:browse-term-change
     */
    obp_browse_term_change = "obp:browse-term-change",

    supported_events = [
          obp_bibliography_added, obp_browse_term_change, obp_filter_change
        , obp_filter_complete,    obp_filter_mode_change, obp_search_term_change
    ];
    return {
        /**
         * Initialize the event controller.
         * @method
         * @public
         * @instance
         */
        init : function() {
            var obpev = this;
            supported_events.forEach(function(event) {
                obpev.events[event] = {};
            });
        },
        /**
         * Event table mapping events to registered callbacks.
         * @property
         * @public
         * @instance
         */
        events: {},
        /**
         * Method enabling subscription to an event.
         * @param {string} event name
         * @param {string} name of object subscribing to event
         * @param {function} callback to fire on event
         * @throws exception when unsupported event is subscribed to
         * @method
         * @public
         * @instance
         */
        subscribe : function(ev,obj,cb) {
            if (obpconfig.debug) { obpconfig.console.log(obj + ' subscribed ' + ev); }
            if (this.events.hasOwnProperty(ev)) {
                this.events[ev][obj] = cb;
            } else {
                throw "Unsupported event subscription for '"
                 + ev + "' from object '" + obj + "'";
            }
        },
        /**
         * Method enabling unsubscription from an event.
         * @param {string} event name
         * @param {string} name of object unsubscribing to event
         * @throws exception when unsupported event is unsubscribed from
         * @method
         * @public
         * @instance
         */
        unsubscribe : function(ev,obj) {
            if (this.events.hasOwnProperty(ev)) {
                delete this.events[ev][obj];
            } else {
               throw "Unsupported event subscription for '"
                     + ev + "' from object '" + obj + "'";
            }
       },
       /**
        * Method used to raise an event in the application.
        * @param {string} event to raise
        * @param {string} name of object raising event
        * @throws exception when unsupported event is raised
        * @method
        * @public
        * @instance
        */
       raise : function(ev,obj) {
            var subscribers;
            if (obpconfig.debug) { obpconfig.console.log(obj + ' raised ' + ev); }
            if (this.events.hasOwnProperty(ev)) {
                subscribers = this.events[ev] || {};
                Object.keys(subscribers).forEach(function(key) {
                    subscribers[key].call();
                });
            } else {
               throw "Unsupported event subscription for '"
                     + ev + "' from object '" + obj + "'";
            }
        }
    };
});
