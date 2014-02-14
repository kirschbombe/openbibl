"use strict";
(function() {

    // obp object attached to js window global, for access in callbacks
    function Openbibl() {}
    Openbibl.prototype.debug = false;
    Openbibl.prototype.console = (typeof console == 'object') ? console : {};
    Openbibl.prototype.Saxon = null;
    Openbibl.prototype.onSaxonLoad = function(Saxon, xsl_url, xml_url, parameters) {
        this.Saxon = Saxon;
        if (this.debug) this.Saxon.setLogLevel("FINE");
        var errors = [];
        var xsl = this.SaxonRequestXMLHandler(xsl_url,errors);  // asyncURI obj
        var xml = this.SaxonRequestXMLHandler(xml_url,errors);  // asyncURI obj
        if (errors.length > 0) {
            if (this.debug) this.console.log("Failed to load XML resource(s): " + errors.toString());
            // TODO: display error message to user
            return;
        }
        // init xslt processor and pass parameters
        var proc = this.Saxon.newXSLT20Processor(xsl);
        for (key in parameters)
            proc.setParameter(key, parameters[key]);
        // set success and error handlers, then process xml file
        proc.setSuccess(this.SaxonSuccessHandler);
        this.Saxon.setErrorHandler(this.SaxonErrorHandler);
        proc.transformToDocument(xml);
    };
    Openbibl.prototype.SaxonRequestXMLHandler = function(url,errors) {
        var xml;
        try { xml = this.Saxon.requestXML(url) } catch (e) {
            if (this.debug) this.console.log("Error requesting XML resource: " + e.toString());
            errors.push("Failed to load resource '" + url + "'");
        }
        return xml;
    }
    Openbibl.prototype.SaxonErrorHandler = function(saxonError) {
        var obp = window.obp;
        if (obp.debug) {
            obp.console.log("SaxonErrorHandler (" + saxonError.level + "): " + saxonError.message);
            // TODO: display error message to user
        }
    };
    // handle a successful XSLT 2.0 transformation
    Openbibl.prototype.SaxonSuccessHandler = function(data) {
        var result_wrapper = null;
        // for Chrome and Safari
        try {
            result_wrapper = data.getResultDocument().querySelector("#result");
        } catch (e) {
            if (this.debug) this.console.log("Failed to called querySelector() in Saxon on-success callback: " + e.toString());
        }
        if (result_wrapper === null) {
            // for Firefox
            try {
                result_wrapper = data.getResultDocument().documentElement;
            } catch (e) {
                if (this.debug) this.console.log("Failed to get document element in Saxon on-success callback");
            }
        }
        if (result_wrapper === null) {
            // TODO: display error message to user
            return;
        }
        var children = result_wrapper.childNodes;
        var bibliographies_wrapper = document.getElementById("bibliographies");
        var footer = document.getElementById("footer");
        for (var i = 0; i < children.length; i++)
            bibliographies_wrapper.insertBefore(children[i].cloneNode(true),footer);
    };
    Openbibl.prototype.changetheme = function(stylesheet) {
        var parts = $('#theme-css').attr('href').split('/');
        parts[parts.length-1] = stylesheet;
        $('#theme-css').attr('href', parts.join('/'));
    }
    window.obp = new Openbibl();

})();
