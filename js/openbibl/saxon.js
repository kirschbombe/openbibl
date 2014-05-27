
define(
  [ 'module', 'obpconfig', 'jquery', 'obpev' ]
, function(module,obpconfig,$,obpev) {
    return {
          saxon : null
        , onSaxonLoad : function(Saxon) {
            this.Saxon = Saxon;
            this.Saxon.setLogLevel(obpconfig.saxonLogLevel);
        }
        , requestInitialTransform : function(xsl_url, xml_url, parameters, handler) {
            var errors = [];
            var xsl = this.SaxonRequestXMLHandler(xsl_url,errors);  // asyncURI obj
            var xml = this.SaxonRequestXMLHandler(xml_url,errors);  // asyncURI obj
            if (errors.length > 0) {
                if (this.debug) this.console.log("Failed to load XML resource(s): " + errors.toString());
                // TODO: display error message to user
                return;
            }
            var proc = Saxon.newXSLT20Processor(xsl);
            for (var i = 0; i < parameters.length; i++) {
                proc.setParameter(parameters[i][0], parameters[i][1], parameters[i][2]);
            }
            proc.setSuccess(handler);
            this.Saxon.setErrorHandler(this.SaxonErrorHandler);
            proc.updateHTMLDocument(xml);
        }
        , requestQueryTransform : function(xsl_url, xml_url, parameters, handler) {
            var errors = [];
            var xsl = this.SaxonRequestXMLHandler(xsl_url,errors);  // asyncURI obj
            var xml = this.SaxonRequestXMLHandler(xml_url,errors);  // asyncURI obj
            if (errors.length > 0) {
                if (this.debug) this.console.log("Failed to load XML resource(s): " + errors.toString());
                // TODO: display error message to user
                return;
            }
            var proc = Saxon.newXSLT20Processor(xsl);
            for (var i = 0; i < parameters.length; i++) {
                proc.setParameter(parameters[i][0], parameters[i][1], parameters[i][2]);
            }
            proc.setSuccess(handler);
            this.Saxon.setErrorHandler(this.SaxonErrorHandler);
            proc.transformToFragment(xml,document);
        }
        , SaxonRequestXMLHandler : function(url,errors) {
            var xml;
            try { xml = this.Saxon.requestXML(url) } catch (e) {
                if (this.debug) this.console.log("Error requesting XML resource: " + e.toString());
                errors.push("Failed to load resource '" + url + "'");
            }
            return xml;
        }
        , SaxonErrorHandler : function(saxonError) {
            var obp = window.obp;
            if (obp.debug) {
                obp.console.log("SaxonErrorHandler (" + saxonError.level + "): " + saxonError.message);
                // TODO: display error message to user
            }
        }
    }
});
