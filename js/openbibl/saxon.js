/*
* Openbibl Framework v0.1.0
* Copyright 2014, Dawn Childress
* Contact: https://github.com/kirschbombe/openbibl
* License: GNU AGPL v3 (https://github.com/kirschbombe/openbibl/LICENSE)
*/
/*jslint white: true, todo: true, nomen: true */
/*global define: true */
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
         * Method to set up a transformation using the Saxon-CE processor.
         * @todo improve user notification for error handling
         * @param {string} xsl url for xsl stylesheet
         * @param {string} xml url for xml source file
         * @param {array} parameters array of array of stylesheet parameters of form: [ [ "namespace"/null, "key", "value" ], ... ]
         * @param {function} success transform success callback
         * @param {string} method name of method to call on processor (e.g., "updateHTMLDocument", "transformToFragment")
         * @method
         * @private
         * @instance
         */
        requestTransform : function(xsl_url, xml_url, parameters, handler, process) {
            var errors = []
              , xsl = this.SaxonRequestXMLHandler(xsl_url,errors)   // asyncURI obj
              , xml = this.SaxonRequestXMLHandler(xml_url,errors)   // asyncURI obj
              , proc;
            if (errors.length > 0) {
                if (this.debug) { this.console.log("Failed to load XML resource(s): " + errors.toString()); }
                return;
            }
            proc = this.Saxon.newXSLT20Processor(xsl);
            parameters.forEach(function(plist){
                proc.setParameter(plist[0], plist[1], plist[2]);
            });
            proc.setSuccess(handler);
            this.Saxon.setErrorHandler(this.SaxonErrorHandler);
            /*global document: true */
            // Document object is passed for the "transformToFragment" call, which
            // requires a context
            proc[process](xml, document);
        },
        /**
         * Have the XSLT 2.0 processor perform an "updateHTMLDocument" transformation with
         * the provided parameters. Currently used to initiate the transform used to supply
         * HTML for the TEI bibliography entries. Transform success handler is provided. Errors
         * are handled by an Openbibl global error handler.
         * @param {string} xsl url for xsl stylesheet
         * @param {string} xml url for xml source file
         * @param {array} parameters array of array of stylesheet parameters of form: [ [ "namespace"/null, "key", "value" ], ... ]
         * @param {function} success transform success callback
         * @method
         * @public
         * @instance
         */
        requestInitialTransform : function(xsl_url, xml_url, parameters, handler) {
            this.requestTransform(xsl_url, xml_url, parameters, handler, 'updateHTMLDocument');
        },
        /**
         * Have the XSLT 2.0 processor perform a "transformToFragment" transformation with
         * the provided parameters. Currently used to transform TEI XML bibliography to JSON for use
         * in the browse/search functionality. Transform success handler is provided. Errors
         * are handled by an Openbibl global error handler.
         * @param {string} xsl url for xsl stylesheet
         * @param {string} xml url for xml source file
         * @param {array} parameters array of array of stylesheet parameters of form: [ [ "namespace"/null, "key", "value" ], ... ]
         * @param {function} success transform success callback
         * @method
         * @public
         * @instance
         */
        requestQueryTransform : function(xsl_url, xml_url, parameters, handler) {
            this.requestTransform(xsl_url, xml_url, parameters, handler, 'transformToFragment');
        },
        /**
         * Have the Saxon-CE processor create an Async XML object for the provided
         * URL to be used in a transform.
         * @param {string} url for resource (e.g., xml or xsl file)
         * @param {array} array to populate with any caught errors
         * @method
         * @private
         * @instance
         */
        SaxonRequestXMLHandler : function(url,errors) {
            var saxon = this
              , xml;
            try {
                if (obpconfig.async) {
                    xml = this.Saxon.requestXML(url);
                } else {
                    /*jslint unparam: true*/
                    $.ajax({
                          "url":      url
                        , "dataType": "text"
                        , "async":    false
                        , "type":     "GET"
                        , "success":  function(data) {
                            xml = saxon.Saxon.parseXML(data);
                         }
                         , "error" : function(jqXHR, textStatus, errorThrown) {
                            throw "Error retrieving '" + url + "': " + errorThrown;
                        }
                    });
                }
            } catch (e) {
                if (saxon.debug) { this.console.log("Error requesting XML resource: " + e.toString()); }
                errors.push("Failed to load resource '" + url + "'");
            }
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
