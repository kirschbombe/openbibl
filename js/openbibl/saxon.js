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
  [ 'obpconfig' ]
, function(obpconfig) {
    'use strict';
    return {
        /**
         *
         */
        Saxon : null,
        /**
         *
         */
        onSaxonLoad : function(Saxon) {
            this.Saxon = Saxon;
            this.Saxon.setLogLevel(obpconfig.saxonLogLevel);
        },
        /**
         * @todo notify user of error
         */
        requestInitialTransform : function(xsl_url, xml_url, parameters, handler) {
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
            proc.updateHTMLDocument(xml);
        },
        /**
         *
         */
        requestQueryTransform : function(xsl_url, xml_url, parameters, handler) {
            var errors = []
              , xsl = this.SaxonRequestXMLHandler(xsl_url,errors)   // asyncURI obj
              , xml = this.SaxonRequestXMLHandler(xml_url,errors)   // asyncURI obj
              , proc;
            if (errors.length > 0) {
                if (this.debug) { this.console.log("Failed to load XML resource(s): " + errors.toString()); }
                // TODO: display error message to user
                return;
            }
            proc = this.Saxon.newXSLT20Processor(xsl);
            parameters.forEach(function(plist){
                proc.setParameter(plist[0], plist[1], plist[2]);
            });
            proc.setSuccess(handler);
            this.Saxon.setErrorHandler(this.SaxonErrorHandler);
            /*global document: true */
            proc.transformToFragment(xml,document);
        },
        /**
         *
         */
        SaxonRequestXMLHandler : function(url,errors) {
            var xml;
            try { xml = this.Saxon.requestXML(url); } catch (e) {
                if (this.debug) { this.console.log("Error requesting XML resource: " + e.toString()); }
                errors.push("Failed to load resource '" + url + "'");
            }
            return xml;
        },
        /**
         * @todo notify user of transformation error
         */
        SaxonErrorHandler : function(saxonError) {
            if (obpconfig.debug) {
                obpconfig.console.log("SaxonErrorHandler (" + saxonError.level + "): " + saxonError.message);
            }
        }
    };
});
