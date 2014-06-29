/*
* Openbibl Framework v0.1.0
* Copyright 2014, Dawn Childress
* Contact: https://github.com/kirschbombe/openbibl
* License: GNU AGPL v3 (https://github.com/kirschbombe/openbibl/LICENSE)
*/
/*jslint white: true, todo: true, nomen: true */
/*global define: true, document: true */
/**
 * Wrapper for Saxon-CE processor for Openbibl application.
 *
 * @module openbibl/saxon
 */
define(
  [ 'obpconfig', 'jquery' ]
, function(obpconfig,$) {
    'use strict';
    return {
        /**
         * Reference to the global Saxon-CE object.
         * @property
         * @private
         */
        Saxon : null,
        /**
         * Calback to be triggered once the global Saxon object is available
         * for use.
         * @param {object} Saxon the global Saxon object
         * @method
         * @public
         * @instance
         */
        onSaxonLoad : function(Saxon) {
            this.Saxon = Saxon;
            this.Saxon.setLogLevel(obpconfig.saxonLogLevel);
        },
        /**
         * Method to set up a transformation using the Saxon-CE processor. Properties listed here are
         * from documentation at http://www.saxonica.com/ce/user-doc/1.1/index.html#!api/command. They
         * are passed into requestTransform() as an object.
         * @param errorHandler {function} The callback function for handling processing errors.
         * @param initialMode {string} The initial mode for the transform
         * @param initialTemplate {string} The initial template for the transform
         * @param logLevel {string} Sets the error and event logging threshold.
         * @param method {string} The transform method to use [Default: updateHTMLDocument]
         * @param parameters {object} XSLT parameters are set from the matching values of properties of the parameters object.
         * @param source {String|Document} The XML document source for the transform
         * @param stylesheet {String|Document} Sets the stylesheet for the transform
         * @param success {Function} The success callback function - called after a transform.
         * @todo improve user notification for error handling
         * @method
         * @private
         * @instance
         */
        requestTransform : function(options) {
            if (!options.hasOwnProperty('errorHandler')) {
                options.errorHandler = this.SaxonErrorHandler;
            }
            if (!obpconfig.async) {
                try {
                    if (typeof options.source !== 'object') {
                        options.source = this.synchronousRetrieval(options.source);
                    }
                    if (typeof options.stylesheet !== 'object') {
                        options.stylesheet = this.synchronousRetrieval(options.stylesheet);
                    }
                } catch(e) {
                    throw e.toString();
                }
            }
            this.Saxon.run(options);
        },
        /**
         * Have the Saxon-CE processor create an Async XML object for the provided
         * URL to be used in a transform.
         * @param {string} url for resource (e.g., xml or xsl file)
         * @param {array} array to populate with any caught errors
         * @returns {document} XMLDocument retrieved
         * @throws Parse exception and GET exception
         * @method
         * @private
         * @instance
         */
        synchronousRetrieval : function(url) {
            var saxon = this
              , xml, att;
            /*jslint unparam: true*/
            $.ajax({
                  url       : url
                , dataType  : 'text'
                , async     : false
                , type      : 'GET'
                , success   : function(data) {
                    // NOTE: when xml is passed in as a string, it the parsed
                    // XML document has a null baseURI property, which causes
                    // a failure during the transform for an xsl stylesheet
                    // containing imports. So an @xml:base attribute is added
                    // here, using (possibly imprecisely) the (directory of the)
                    // baseURI of the global Document, plus the relative path of
                    // the XML/XSL file passed in
                    try {
                        /*jslint regexp: true */
                        xml = saxon.Saxon.parseXML(data);
                        att = xml.createAttribute('xml:base');
                        att.nodeValue = url;
                        xml.documentElement.setAttributeNode(att);
                    } catch(e) {
                        throw "Error parsing or modifying file '" + url + "': " + e.toString();
                    }
                 }
                 , "error" : function(jqXHR, textStatus, errorThrown) {
                    throw "Error retrieving '" + url + "': " + errorThrown;
                }
            });
            return xml;
        },
        /**
         * Openbibl global and generic error handler to be passed to the XSLT processor
         * for a transformation.
         * @todo notify user of transformation error
         * @param {object} Saxon error object
         * @method
         * @private
         * @instance
         */
        SaxonErrorHandler : function(saxonError) {
            if (obpconfig.debug) {
                obpconfig.console.log("SaxonErrorHandler (" + saxonError.level + "): " + saxonError.message);
            }
        }
    };
});
