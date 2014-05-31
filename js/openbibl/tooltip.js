/*
* Openbibl Framework v0.1.0
* Copyright 2014, Dawn Childress
* Contact: https://github.com/kirschbombe/openbibl
* License: GNU AGPL v3 (https://github.com/kirschbombe/openbibl/LICENSE)
*/
/*jslint white: true, todo: true, nomen: true */
/*global define: true */
/**
 * Controller for Bootstrap tooltip event integration.
 *
 * @module openbibl/tooltip
 */
define(
  [ 'module', 'jquery', 'obpev' ]
, function(module,$,obpev) {
    'use strict';
    return {
        /**
         * Initialize tooltip by registering callbacks for Openbibl
         * framework events.
         * @method
         * @public
         * @instance
         */
        init : function() {
            var tooltip = this;
            obpev.subscribe("obp:bibliography-added", module.id, function() {
                tooltip.enable_tooltips();
            });
            obpev.subscribe("obp:filter-complete", module.id, function() {
                tooltip.enable_tooltips();
            });
        },
        /**
         * Register DOM events on tooltip-able elements, which may have just
         * re-appeared in the DOM.
         * @method
         * @public
         * @instance
         */
        enable_tooltips : function() {
            $('[data-toggle="tooltip"]').click(function(e){
                e.preventDefault();
            });
            $('[data-toggle="tooltip"]').tooltip({
                  placement : "top"
                , trigger   : "hover"
            });
        }
    };
});
