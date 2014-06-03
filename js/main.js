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
require.config({
      paths : {
          'domReady'    : 'lib/domReady-2.0.1'
        , 'jquery'      : 'lib/jquery-2.1.0.min'
        , 'typeahead'   : 'lib/bootstrap-typeahead-2.3.2'
        , 'cookie'      : 'lib/jquery.cookie'
        , 'underscore'  : 'lib/underscore-1.6.0.min'
        , 'filesaver'   : 'lib/FileSaver'

        , 'obpconfig'   : 'openbibl/config'
        , 'obpev'       : 'openbibl/event'
        , 'obpstate'    : 'openbibl/state'
        , 'browse'      : 'openbibl/browse'
        , 'download'    : 'openbibl/download'
        , 'filter'      : 'openbibl/filter'
        , 'highlight'   : 'openbibl/highlight'
        , 'query'       : 'openbibl/query'
        , 'saxon'       : 'openbibl/saxon'
        , 'search'      : 'openbibl/search'
        , 'sort'        : 'openbibl/sort'
        , 'theme'       : 'openbibl/theme'
        , 'toc'         : 'openbibl/toc'
        , 'tooltip'     : 'openbibl/tooltip'
    }
    , shim : {
          'typeahead' : { deps: ['jquery'] }
    }
});
/**
 * Main entry point for the Openbibl framework.
 *
 * This module is loaded according to the RequireJS @data-main attribute and performs:
 * <ul>
 * <li>setting of configuration options for RequireJS and for the Openbibl framework modules</li>
 * <li>initialization of Openbibl framework modules requiring initialization (e.g., to bind to DOM events or to Openbibl events)</li>
 * <li>binding of global Openbibl events to DOM events</li>
 * <li>binding of DOM events that for behavior is not specific to a particular module</li>
 * <li>request for bibliography content and index data loading</li>
 * </ul>
 * @module main
 */
define(
  [  'module', 'domReady', 'jquery', 'underscore',
     'obpconfig', 'obpev', 'obpstate',
     'filter', 'browse', 'search', 'query', 'highlight',
     'saxon', 'sort', 'theme', 'toc', 'tooltip',
     'download'
  ]
, function(module, domReady, $, _, obpconfig, obpev, obpstate,
           filter, browse, search, query, highlight, saxon, sort,
           theme, toc, tooltip
) {
    "use strict";
    // determine whether this is an XML or HTML file load based on href
    var html_load = !window.obp.xsl_load;
    if (html_load) {
        obpconfig.rebase(window.obp.obpconfig);
        obpstate.rebase(window.obp.obpstate);
    } else {
        obpstate.bibliographies.count = 0;
        obpconfig.paths.obp_root = window.obp.appdir;
        obpconfig.rebase({},true);
    }
    obpev.init();
    module.exports.register_query_data = function() {
        // request query data
        var dir = obpstate.bibliographies.xml.replace(/[^\/\\]+$/,'')
          , query_data_file = dir + obpconfig.query.file
          , cb;
        query.init([search, browse]);
        // have data for browse/search functionality fetched/generated
        // TODO: evaluate whether this data should be stored globally
        // since it can be weighty
        cb = function(data) {
            obpstate.query.data = data;
        };
        query.request_query_data(query_data_file, cb);
    };
    // If XML file is requested in browser, have the bibliography entries
    // transformed to HTML for injection into the page using the Saxon-CE
    // processor. The processor is loaded asynchronously (as is this module),
    // so we need a way to poll for it having successfully loaded. This is
    // done using a window.setInterval() call to check for a true value
    // assigned to the 'window.obp.saxonLoaded' global, which is set to true
    // by the onSaxonLoad() callback. See the 'openbibl/xsl/openbibl.boot.xsl'
    // file for the JS call.
    // TODO: set timeout for the polling.
    if (!html_load) {
        module.exports.onSaxonLoad = function() {
            saxon.onSaxonLoad(window.Saxon);
            var success = function() {
                // request transform of bibl entries
                obpstate.bibliographies.count = $('div.entry').length;
                obpev.raise("obp:bibliography-added", module.id);
                module.exports.register_query_data();
            };
            saxon.requestInitialTransform(
                obpstate.bibliographies.xsl,    // openbibl.xsl stylesheet path
                obpstate.bibliographies.xml,    // TEI XML document path
                [],
                success
            );
        };
        module.exports.saxonLoadedCB = function() {
            if (window.obp.saxonLoaded) {
                if (obpstate.saxonInterval !== null) {
                    window.clearInterval(obpstate.saxonInterval);
                    obpstate.saxonInterval = null;
                }
                module.exports.onSaxonLoad();
            } else {
                if (obpstate.saxonInterval === null) {
                    obpstate.saxonInterval = window.setInterval(
                        function() {
                            module.exports.saxonLoadedCB();
                        }, obpconfig.saxonPollInterval
                    );
                }
            }
        };
        module.exports.saxonLoadedCB();
    }
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
        if (obpconfig.query.data === undefined) {
            module.exports.register_query_data();
        }
    });
});
