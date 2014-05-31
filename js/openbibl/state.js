/*
* Openbibl Framework v0.1.0
* Copyright 2014, Dawn Childress
* Contact: https://github.com/kirschbombe/openbibl
* License: GNU AGPL v3 (https://github.com/kirschbombe/openbibl/LICENSE)
*/
/*jslint white: true, todo: true, nomen: true */
/*global define: true, window: true */
/**
 * Object representing current application state for Javascript
 * code in framework.
 *
 * @module openbibl/state
 */
define([]
, function() {
    'use strict';
    // The xsl->js handoff is done by means of an 'obp' property
    // attached to the global window object
    // TODO: handle better
    var global_bib_data = window.hasOwnProperty('obp')
        ? window.obp
        :   { bibliographies : {
                  xml : ''
                , xsl : ''
            }
    },
    /**
     * Flags for which items are serialized when an XML-based rendering is serialized to HTML.
     * @private
     * @constant
     */
    serialize = {
        bibliographies  : true
        , saxonInterval : false
        , query         : true
        , rebase        : true
        , stringify     : true
    };
    return {
        /**
         * Data on the XML and XSL files used to produce displayed bibliography entries.
         * "xml" : xml document path
         * "xsl" : xslt 2.0 stylesheet path
         * "count" : number of bibliography entries displayed
         * @property
         * @public
         */
        bibliographies : {
              count         : 0
            , xml           : global_bib_data.bibliographies.xml
            , xsl           : global_bib_data.bibliographies.xsl
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
                    state[key] = obj[key];
                } else {
                    throw "Unsupported config key in obp.config.rebase: " + key;
                }
            });
        }
    };
});
