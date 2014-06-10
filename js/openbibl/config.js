/*
* Openbibl Framework v0.1.0
* Copyright 2014, Dawn Childress
* Contact: https://github.com/kirschbombe/openbibl
* License: GNU AGPL v3 (https://github.com/kirschbombe/openbibl/LICENSE)
*/
/*jslint white: true, todo: true, nomen: true */
/*global define: true */
/**
 * Object representing current configuration values for Javascript
 * code in framework.
 *
 * @module openbibl/config
 */
define( ['obpstate']
, function(obpstate) {
    'use strict';
    /**
     * Flags for which configuration items are serialized when an
     * XML-based rendering is serialized to HTML.
     * @private
     * @constant
     */
    var serialize = {
          debug             : true
        , console           : false
        , saxonLogLevel     : false
        , saxonPollInterval : false
        , paths             : true
        , scroll_speed      : true
        , query             : true
        , typeahead         : true
        , rebase            : false
        , stringify         : false
    },
    /**
     * File-system paths for resources referenced in the Openbibl JS code.
     * The values in this file are relative to the Openbibl root directory, and
     * made absolute at runtime, or by a call to 'rebase()'.
     * @property
     * @private
     * @constant
     */
    project_paths = {
          entry_xsl       : 'xsl/openbibl.entry.xsl'
        , query_xsl       : 'xsl/openbibl.query.xsl'
        , tooltip_xsl     : 'xsl/partials/tooltip.xsl'
        , search_xsl      : 'xsl/partials/search-list.xsl'
    };
    return {
        /**
         * Whether or not to perform async requests.
         * @default true
         * @property
         * @public
         */
        async : false,
        /**
         * Debug state of Openbibl javascript code.
         * @default false
         * @property
         * @public
         */
        debug : false,
        /**
         * Console object for debugging, in case browser doesn't have one.
         * @property
         * @public
         */
        console : (typeof console === 'object')
                  ? console
                  : { log : function(){ return; } },
        /**
         * Logging level for Saxon-CE XSLT processor. Options are
         * SEVERE, OFF, WARINING, INFO, CONFIG, FINE, FINER, FINEST
         * @default OFF
         * @property
         * @public
         * @enum
         */
        saxonLogLevel : 'OFF',
        /**
         * Milisecond polling interval to use in setInterval() call used
         * to determine whether the Saxon-CE XSLT processor has loaded.
         * @default 100ms
         * @property
         * @public
         */
        saxonPollInterval: 100,
        /**
         * Milisecond speed of the scrolling done when a TOC entry is clicked.
         * @default 200 ms
         * @property
         * @pulic
         */
        scroll_speed : 200,
        /**
         * Data file containing serialized browse/search data, which is located relative to the
         * XML file it is generated from.
         * @todo incorporate with 'paths' above
         * @property
         * @public
         */
        query : {
             file  : 'obp.query.json'               // serialized json file
        },
        /**
         * Configuration points for the Bootstrap Tooltips widgetry.
         * @property
         * @public
         */
        tooltip : {
              show      : 500
            , hide      : 100
            , hover     : 500
            , placement : 'top'
        },
        /**
         * Configuration for the Bootstrap/Typeahead auto-suggestion used in the search-term field.
         * "list_len" : maximum number of items to use for suggestions
         * @default 20 list items
         * @public
         * @property
         */
        typeahead : {
            list_len: 20
        },
        /**
         * Method to re-base configuration values, used when JSON data is re-hydrated
         * from window.obp serialization for an HTML-based view of a bibliography
         * during main.js initialization.
         * @param {object} config values to use for rebasing (optional)
         * @param {boolean} flag indicating whether to rebase file paths
         * @method
         * @public
         * @instance
         */
        rebase : function(obj) {
            var config = this;
            if (typeof obj === "object") {
                Object.keys(obj).map(function(key){
                    if (config.hasOwnProperty(key)) {
                        config[key] = obj[key];
                    } else {
                        throw "Unsupported config key in obp.config.rebase: " + key;
                    }
                });
            }
            this.console = (typeof console === 'object')
                  ? console
                  : { log : function(){ return; } };
        },
        /**
         * Method to stringify Openbibl configuration data as JSON for serialization.
         * @todo factor this and openbibl/state stringify to single instance
         * @method
         * @public
         * @instance
         */
        stringify : function() {
            var config = this
              , ret = {};
            Object.keys(this).map(function(entry) {
                if (typeof serialize[entry] === 'boolean') {
                    if (serialize[entry]) {
                        ret[entry] = config[entry];
                    }
                } else if (typeof serialize[entry] === 'object') {
                    ret[entry] = {};
                    Object.keys(serialize[entry]).map(function(key) {
                        if (serialize[entry][key]) {
                            ret[entry][key] = config[entry][key];
                        }
                    });
                }
            });
            return JSON.stringify(ret);
        },
        /**
         * Return path to requested resource.
         * @param {string} item requested
         * @returns {string} URI of requested resource
         * @throws
         * @method
         * @public
         * @instance
         */
        path : function(resource) {
            if (!project_paths.hasOwnProperty(resource)) {
                throw "Unknown resource requested: " + resource;
            }
            return obpstate.paths.root + '/' + project_paths[resource];
        }
    };
});
