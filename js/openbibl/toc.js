/*
* Openbibl Framework v0.1.0
* Copyright 2014, Dawn Childress
* Contact: https://github.com/kirschbombe/openbibl
* License: GNU AGPL v3 (https://github.com/kirschbombe/openbibl/LICENSE)
*/
/*jslint white: true, todo: true, nomen: true */
/*global define: true */
/**
 * Controller for TOC functionality.
 *
 * @module openbibl/toc
 */
define(
  [ 'module', 'jquery', 'obpev', 'obpconfig' ]
, function(module,$,obpev,obpconfig) {
    'use strict';
    return {
        /**
         * Initialize TOC controller by subscribing to Openbibl
         * framework events.
         * @method
         * @public
         * @instance
         */
        init : function() {
            var toc = this;
            obpev.subscribe("obp:filter-complete", module.id, function() {
                toc.update_toc();
                toc.enable_click();
            });
            obpev.subscribe("obp:bibliography-added", module.id, function() {
                toc.update_toc();
                toc.enable_click();
            });
            toc.enable_click();
        },
        /**
         * Register click-handler callbacks on the TOC entries, which may
         * have just re-appeared in the DOM.
         * @method
         * @public
         * @instance
         */
        enable_click : function() {
            $('a.toc-click').click(function(e) {
                var $target = $('div[data-src-index="' + $(e.target).attr('data-src-index') + '"]');
                if ($target.length === 0) {
                    return;
                }
                $('html,body').animate({
                    scrollTop: ($target.offset().top - $('#bibliographies').offset().top)
                    }, obpconfig.scroll_speed
                );
            });
        },
        /**
         * Update which TOC entries are visible based on which bibliography
         * entries are visible.
         * @method
         * @public
         * @instance
         */
        update_toc : function () {
            var $wrapper = $('#bibliographies'),
            src_sequence = $.map($wrapper.children('div.entry:visible'), function(elt) {
               return $(elt).attr('data-src-index');
            }),
            $toc = $('#toc'),
            $toc_entries = $toc.children('li.toc').remove(),
            aInd,bInd;
            $toc_entries.sort(function(a,b){
                aInd = src_sequence.indexOf(a.getAttribute('data-src-index'));
                bInd = src_sequence.indexOf(b.getAttribute('data-src-index'));
                return aInd < bInd
                    ? -1
                    : aInd === bInd
                        ? 0
                        : 1;
            });
            /*jslint unparam: true*/
            $toc_entries.each(function(i,elt){
                $(elt).show();
                if (src_sequence.indexOf(elt.getAttribute('data-src-index')) === -1) {
                    $(elt).hide();
                }
            });
            $toc.append($toc_entries);
        }
    };
});
