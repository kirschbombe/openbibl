/*
* Openbibl Framework v0.1.0
* Copyright 2014, Dawn Childress
* Contact: https://github.com/kirschbombe/openbibl
* License: GNU AGPL v3 (https://github.com/kirschbombe/openbibl/LICENSE)
*/
/*jslint white: true, todo: true, nomen: true */
/*global define: true*/
/**
 * Object representing current application state for Javascript
 * code in framework.
 *
 * @module openbibl/state
 */
define(['jquery']
, function($) {
    'use strict';
    /**
     * Flags for which items are serialized when an XML-based rendering is serialized to HTML.
     * @private
     * @constant
     */
    var serialize = {
          bibliographies : true
        , paths          : true
        , saxonInterval  : false
        , query          : false
        , rebase         : true
        , stringify      : true
    };
    return {
        /**
         * Data on the XML and XSL files used to produce displayed bibliography entries.
         * "xml" : xml document path
         * "xsl" : xslt 2.0 stylesheet path
         * "count" : number of bibliography entries displayed
         * "xsl_load" : whether the bibliographies were loaded by an XSL transform
         * @property
         * @public
         */
        bibliographies : {
              count         : 0
            , xml           : ''
            , xsl_load      : true
        },
        /**
         * Value of active interval ID from window.setInterval() call used in
         * polling that determines whether the Saxon-CE xslt processor has been
         * loaded and is available.
         * @property
         * @public
         */
        saxonInterval : null,
        /**
         * Data queried from the  TEI XML file and used in user interface code to
         * drive browse and search functionality.
         * @property
         * @public
         */
        query : {
            data : null
        },
        /**
         * Method to stringify Openbibl application state data as JSON for serialization.
         * @todo factor this and openbibl/config stringify to single instance
         * @method
         * @public
         * @instance
         */
        stringify : function() {
            var state = this
              , ret = {};
            Object.keys(this).map(function(key) {
                if (serialize[key]) {
                    ret[key] = state[key];
                }
            });
            return JSON.stringify(ret);
        },
        /**
         * Current application paths.
         * root: URI for the openbibl/ directory
         * @property
         * @public
         */
        paths : {
            root : ''
        },
        /**
         * Method to re-base configuration values, used when JSON data is re-hydrated
         * from window.obp serialization for an HTML-based view of a bibliography
         * during main.js initialization.
         * @method
         * @public
         * @instance
         */
        rebase : function(obj) {
            var state = this;
            if (typeof obj !== "object") {
                throw "obp.obpstate.rebase() requires an object";
            }
            Object.keys(obj).map(function(key){
                if (state.hasOwnProperty(key)) {
                    if (typeof obj === "object") {
                        $.extend(state[key], obj[key]);
                    } else {
                        state[key] = obj[key];
                    }
                } else {
                    throw "Unsupported config key in obp.config.rebase: " + key;
                }
            });
            if (state.paths.root !== undefined && state.paths.root.match(/\/$/)) {
                state.paths.root = state.paths.root.replace(/\/$/, '');
            }
        },
    };
});
