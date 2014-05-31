/*
* Openbibl Framework v0.1.0
* Copyright 2014, Dawn Childress
* Contact: https://github.com/kirschbombe/openbibl
* License: GNU AGPL v3 (https://github.com/kirschbombe/openbibl/LICENSE)
*/
/*jslint white: true, todo: true, nomen: true, plusplus: true */
/*global define: true */
/**
 * Openbibl application event controller.
 *
 * @module openbibl/event
 */
define(
  [ 'obpconfig' ]
, function(obpconfig) {
    'use strict';
    var supported_events = [
        "obp:filter-start",      "obp:filter-change",      "obp:filter-mode-change",
        "obp:filter-complete",   "obp:bibliography-added", "obp:search-term-change",
        "obp:browse-term-change"
    ],
    event_map = {},
    init_events = function(obj) {
        supported_events.forEach(function(event) {
            obj[event] = {};
        });
    };
    init_events(event_map);
    return {
        /**
         *
         */
        init : function() {
            init_events(this.events);
        },

        /**
         *
         */
        events: {},
        /**
         *
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
         *
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
        *
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
