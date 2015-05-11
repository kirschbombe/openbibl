/*
* Openbibl Framework v0.1.0
* Copyright 2014, Dawn Childress
* Contact: https://github.com/kirschbombe/openbibl
* License: GNU AGPL v3 (https://github.com/kirschbombe/openbibl/LICENSE)
*/
/*jslint white: true, todo: true, nomen: true, regexp: true */
/*global require: true, define: true, window: true,
  document: false, clearInterval: true, setInterval: true
*/
/**
 * Primary application controller for openbibl framework.
 *
 * This module is loaded during initial "boot" of the bibliography :
 * <ul>
 * <li>setting of configuration options for RequireJS and for the Openbibl framework modules</li>
 * <li>initialization of Openbibl framework modules requiring initialization (e.g., to bind to DOM events or to Openbibl events)</li>
 * <li>binding of global Openbibl events to DOM events</li>
 * <li>binding of DOM events that for behavior is not specific to a particular module</li>
 * <li>request for bibliography content and index data loading</li>
 * </ul>
 * @module openbibl
 */
define( 'obp',
 [  'module', 'domReady', 'jquery',
     'obpconfig', 'obpev', 'obpstate',
     'filter', 'browse', 'search', 'query', 'highlight',
     'saxon', 'sort', 'theme', 'toc', 'tooltip',
     'download'
  ]
, function(module, domReady, $, obpconfig, obpev, obpstate,
           filter, browse, search, query, highlight, saxon, sort,
           theme, toc, tooltip
) {
    "use strict";
    var globalSaxonLoadedCB;
    return {
        init : function(func) {
            var obp = this;
            globalSaxonLoadedCB = func;
            obpev.init();
            domReady(function() {
                filter.init([browse,search]);
                highlight.init([browse,search]);
                browse.init();
                search.init();
                sort.init();
                theme.init();
                toc.init();
                tooltip.init();
                $('.obp-filter-mode').change(function(){
                    obpev.raise("obp:filter-mode-change",module.id);
                    obpev.raise("obp:filter-change",module.id);
                });
                $(window).resize(function() {
                    obpev.raise("obp:filter-mode-change",module.id);
                    obpev.raise("obp:filter-change",module.id);
                    obpev.raise("obp:search-term-change",module.id);
                    obpev.raise("obp:browse-term-change",module.id);
                });
                // prevent scroll event from bubbling up to ancestors
                $('.obp-menu-panel-checkboxes').bind('scroll mousewheel DOMMouseScroll', function(e) {
                    var $this = $(this),
                        scrollto_position = null;
                    if (e.type === 'mousewheel') {
                        scrollto_position = e.originalEvent.wheelDelta * -1;
                    } else if (e.type === 'DOMMouseScroll') {
                        scrollto_position = 40 * e.originalEvent.detail;
                    }
                    if (scrollto_position !== null) {
                        $this.closest('.obp-menu-panel-checkboxes').scrollTop(scrollto_position + $this.scrollTop());
                    }
                    e.preventDefault();
                });
                obpev.raise("obp:bibliography-added", module.id);
            });
            obp.saxonLoadedCB();
        },
        // callback for successful transformation of bibliographies,
        // or retrieval of additional data in HTML load scenario
        onSaxonSuccess : function() {
            // request transform of bibl entries
            obpstate.bibliographies.count = $('div.entry').length;
            query.init({ subscribers : [search, browse] });
            tooltip.request_data();
            obpev.raise("obp:bibliography-added", module.id);
        },
        // If XML file is requested in browser, have the bibliography entries
        // transformed to HTML for injection into the page using the Saxon-CE
        // processor. The processor is loaded asynchronously (as is this module),
        // so we need a way to poll for it having successfully loaded. This is
        // done using a window.setInterval() call to check for a true value
        // assigned to the 'window.obp.saxonLoaded' global, which is set to true
        // by the onSaxonLoad() callback. See the 'openbibl/xsl/openbibl.boot.xsl'
        // file for the JS call.
        // TODO: set timeout for the polling.
        onSaxonLoad : function() {
            var obp = this;
            saxon.onSaxonLoad(window.Saxon);
            if (obpstate.bibliographies.xsl_load) {
                saxon.requestTransform({
                      method     : 'updateHTMLDocument'
                    , parameters : { 'append-target-id' : '#bibliographies' }
                    , stylesheet : obpconfig.path('entry_xsl')
                    , source     : obpstate.bibliographies.xml
                    , success    : function() { obp.onSaxonSuccess(); } // function required for scope
                });
            } else {
                obp.onSaxonSuccess();
            }
        },
        saxonLoadedCB : function() {
            var obp = this;
            if (globalSaxonLoadedCB()) {
                if (obpstate.saxonInterval !== null) {
                    window.clearInterval(obpstate.saxonInterval);
                    obpstate.saxonInterval = null;
                }
                obp.onSaxonLoad();
            } else {
                if (obpstate.saxonInterval === null) {
                    obpstate.saxonInterval = window.setInterval(
                        function() {
                            obp.saxonLoadedCB();
                        }, obpconfig.saxonPollInterval
                    );
                }
            }
        } 
    };
});
