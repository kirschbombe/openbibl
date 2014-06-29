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
  [ 'module', 'jquery', 'obpev', 'obpconfig', 'obpstate', 'saxon' ]
, function(module,$,obpev,obpconfig,obpstate, saxon) {
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
         * Mapping of <a> element @id values to strings, to be used for
         * popover titles.
         * @property
         * @private
         * @instance
         */
        titles : {},
        /**
         *
         * @property
         * @private
         * @instance
         */
        request_data : function(options) {
            saxon.requestTransform(
                $.extend({
                      stylesheet : obpconfig.path('tooltip_xsl')
                    , source     : obpstate.bibliographies.xml
                }, options));
        },
        /**
         * Method to be used to register a string for a tooltip popover.
         * @method
         * @public
         * @instance
         */
        register_title : function(a_id,script_id,tt_id) {
            $('#' + script_id).remove();
            this.titles[a_id] = $('#' + tt_id).remove().html();
            this.enable_tooltip(a_id);
        },
        /**
         * Register DOM events on tooltip-able elements, which may have just
         * re-appeared in the DOM.
         * @method
         * @public
         * @instance
         */
        enable_tooltips : function() {
            var tooltip = this;
            /*jslint unparam: true */
            $('[data-toggle="tooltip"]').each(function(i,elt){
                tooltip.enable_tooltip(elt.getAttribute('id'));
            });
        },
        /**
         * Register DOM and popover events for a single tooltip item, which
         * may have just re-appeared.
         * @method
         * @private
         * @instance
         */
        enable_tooltip : function(id) {
            /*jslint unparam: true */
            var $elt = $('#' + id)
              , tooltip = this;
            $elt.click(function(e){
                e.preventDefault();
            });
            $elt.tooltip({
                  html      : true
                , container : $elt
                , placement : obpconfig.tooltip.placement
                , trigger   : 'manual'
                , delay     : {
                      show    : obpconfig.tooltip.show
                    , hide    : obpconfig.tooltip.hide
                }
                , title     : function() {
                    return tooltip.titles[id];
                }
            // mouse events are explicitly set to attempt to
            // keep flicker down
            }).mouseenter(function(e) {
                if($elt.find('div.tooltip').length === 0) {
                    $elt.tooltip('show');
                }
            }).mouseleave(function(e) {
                setTimeout(function() {
                    if ($elt.find('div.tooltip').length !== 0) {
                        $elt.tooltip('hide');
                     }
                }, obpconfig.tooltip.hover);
            });
            // enable link in the tooltip, if any
            $elt.on('shown.bs.tooltip', function() {
                $elt.find('a').click(function(e){
                    // TODO: factor this and openbibl/toc code
                    var $target = $('div[data-src-index="' + $(e.target).attr('data-src-index') + '"]');
                    if ($target.length === 0) {
                        return;
                    }
                    $elt.tooltip('hide');
                    $('html,body').animate({
                        scrollTop: ($target.offset().top - $('#bibliographies').offset().top)
                        }, obpconfig.scroll_speed
                    );
                });
            });
        }
    };
});
