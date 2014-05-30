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
define( []
, function() {
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
        , templates         : false
        , template_pattern  : true
        , typeahead         : true
        , rebase            : false
        , stringify         : false
    },
    /**
     * Method to stringify Openbibl configuration data as JSON for serialization.
     * @todo factor this and openbibl/state stringify to single instance
     * @method
     * @public
     * @instance
     */
    stringify = function() {
        var ret = {};
        Object.keys(this).map(function(key) {
            if (serialize[key]) {
                ret[key] = this[key];
            }
        });
        return JSON.stringify(ret);
    },
    /**
     * Method to re-base configuration values, used when JSON data is re-hydrated
     * from window.obp serialization for an HTML-based view of a bibliography
     * during main.js initialization.
     * @method
     * @public
     * @instance
     */
    rebase = function(obj) {
        var config = this;
        if (typeof obj !== "object") {
            throw "obp.config.rebase() requires an object";
        }
        Object.keys(obj).map(function(key){
            if (config.hasOwnProperty(key)) {
                config[key] = obj[key];
            } else {
                throw "Unsupported config key in obp.config.rebase: " + key;
            }
        });
    };
    return {
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
         * File-system paths for resources referenced in the Openbibl JS code.
         * The values in this file are relative to the Openbibl root directory, and
         * made absolute at runtime.
         * @property
         * @public
         * @constant
         */
        paths : {
              obp_root        : ''
            , template_dir    : 'js/templates'
            , query_xsl       : 'xsl/openbibl.query.xsl'
        },
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
         * Runtime cache of HTML partial-view templates.
         * @property
         * @public
         */
        templates : {},
        /**
         * String to use as RegExp pattern for the Underscore partial-view templating. This
         * regex enables Handlebars-style templates.
         * @default "\\{\\{(.+?)\\}\\}"
         * @property
         * @public
         * @constant
         */
        template_pattern : "\\{\\{(.+?)\\}\\}",
        /**
         * Configuration for the Bootstrap/Typeahead auto-suggestion used in the search-term field.
         * "list_len" : maximum number of items to use for suggestions
         * @default 20 list items
         * @public
         * @property
         */
        typeahead : {
            list_len: 20
        }
        , rebase    : rebase
        , stringify : stringify
    };
});
