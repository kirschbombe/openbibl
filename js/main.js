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
          'tyepahead' : { deps: ['jquery'] }
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
    // TODO: do not use file extension
    var html_load = !window.obp.xsl_load;
    if (html_load) {
        obpconfig.rebase(window.obp.obpconfig);
        obpstate.rebase(window.obp.obpstate);
    } else {
        obpstate.bibliographies.count = 0;
        obpconfig.paths.obp_root = window.obp.appdir;
        Object.keys(obpconfig.paths).forEach(function(item){
            if (item !== 'obp_root') {
                obpconfig.paths[item] = obpconfig.paths.obp_root + obpconfig.paths[item];
            }
        });
    }
    obpev.init();
    _.templateSettings = {
        interpolate: (new RegExp(obpconfig.template_pattern))
    };
    module.exports.register_query_data = function() {
        // request query data
        var dir = obpstate.bibliographies.xml.replace(/[^\/\\]+$/,''),
            query_data_file = dir + obpconfig.query.file;
        query.subscribers = [search, browse];
        query.request_query_data(query_data_file);
    };
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
