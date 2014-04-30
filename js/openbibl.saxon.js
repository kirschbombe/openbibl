(function() {
"use strict";
    // the Saxon object
    // http://www.saxonica.com/ce/user-doc/1.1/html/api/saxon/
    window.obp.SaxonCE.Saxon = null;
    // callback fired once SaxonCE library has loaded
    window.obp.SaxonCE.onSaxonLoad = function(Saxon, xsl_url, xml_url, parameters) {
        this.Saxon = Saxon;
        if (window.obp.debug) this.Saxon.setLogLevel("FINE");
        this.requestTransform(xsl_url, xml_url, parameters, this.SaxonSuccessHandler);
    }
    window.obp.SaxonCE.requestTransform = function(xsl_url, xml_url, parameters, handler) { 
        var errors = [];
        var xsl = this.SaxonRequestXMLHandler(xsl_url,errors);  // asyncURI obj
        var xml = this.SaxonRequestXMLHandler(xml_url,errors);  // asyncURI obj
        if (errors.length > 0) {
            if (this.debug) this.console.log("Failed to load XML resource(s): " + errors.toString());
            // TODO: display error message to user
            return;
        }
        var proc = Saxon.newXSLT20Processor(xsl);
        for (var key in parameters)
            proc.setParameter(key, parameters[key]);
        proc.setSuccess(handler);
        this.Saxon.setErrorHandler(this.SaxonErrorHandler);
        proc.updateHTMLDocument(xml);        
    };
    window.obp.SaxonCE.SaxonRequestXMLHandler = function(url,errors) {
        var xml;
        try { xml = this.Saxon.requestXML(url) } catch (e) {
            if (this.debug) this.console.log("Error requesting XML resource: " + e.toString());
            errors.push("Failed to load resource '" + url + "'");
        }
        return xml;
    }
    window.obp.SaxonCE.SaxonErrorHandler = function(saxonError) {
        var obp = window.obp;
        if (obp.debug) {
            obp.console.log("SaxonErrorHandler (" + saxonError.level + "): " + saxonError.message);
            // TODO: display error message to user
        }
    };
    // handle a successful XSLT 2.0 transformation
    window.obp.SaxonCE.SaxonSuccessHandler = function(data) {
        var obp = window.obp;
        obp.bibliographies.count = $('div.entry').length;
        obp.event["target"].trigger(window.obp.event["events"]["obp:bibliography-added"]);
    };
})();
