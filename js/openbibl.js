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
        // TODO: handle this incrementally?
        var children = result_wrapper.childNodes;
        var bibliographies_wrapper = document.getElementById("bibliographies");
        for (var i = 0; i < children.length; i++)
            bibliographies_wrapper.appendChild(children[i].cloneNode(true));
    };
    Openbibl.prototype.change_theme = function(stylesheet) {
        var $theme_css = $('#theme-css');
        this.update_cookie('theme-stylesheet',stylesheet);
        var parts = $theme_css.attr('href').split('/');
        parts[parts.length-1] = stylesheet;
        stylesheet = parts.join('/');
        if ($theme_css.attr('href') !== stylesheet)
            $('#theme-css').attr('href', stylesheet);
    }
    Openbibl.prototype.scroll_to_id = function(ref_id,dlg_id) {
        var $dlg = $('#' + dlg_id);
        // bring attention to the mention once the dialog is closed
        $dlg.on('hidden.bs.modal', function(e) {
            var $elt = $('#' + ref_id);
            if ($elt.length == 0) return;
            $('html body').scrollTop($elt.offset().top -
                $('#bibliographies').offset().top);
            $elt.css('background-color', 'red').delay(10000).removeClass('obp-highlight');
         });
         $dlg.modal('hide');
    }
    Openbibl.prototype.retrieve_cookie = function(key) {
        return $.cookie(key);
    }
    Openbibl.prototype.update_cookie = function(key,val) {
        if (key !== undefined) $.cookie(key,val);
    }
    Openbibl.prototype.docready = function() {
        // check for a last-used theme in the cookies
        // and load it if found
        var stylesheet = this.retrieve_cookie('theme-stylesheet'); 
        if (stylesheet !== undefined) this.change_theme(stylesheet);
        // auto-close offcanvas menu (jansy-bootstrap)
        $('[data-toggle=offcanvas]').click(function() {
            $('.row-offcanvas').toggleClass('active');
        });
        // fill data for "Search" input
        this.load_typeahead_data();
        // collapse the navmenu
        $(document).on('click',function(){
            $('.collapse').collapse('hide');
        });
    }
    Openbibl.prototype.load_typeahead_data = function(){
        var obp = this;
        // TODO: parameterize these vars
        var typeahead_file = document.location.href.replace(/[^\/]+$/,"") + 'typeahead.json';
        var typeahead_list_len = 100;
        $.ajax({
            "url":      typeahead_file,
            "async":    true,
            "type":     "GET",
            "dataType": "json",
            "success":  function(data) {
                var words = Object.keys(data);
                $('.search-input').each(function() {
                    $(this).typeahead({
                        "items": typeahead_list_len,
                        "matcher": function(item) {
                            //return new RegExp("^" + this.query, "i").test(item);
                            return new RegExp("^" + this.query, "").test(item);
                        },
                        "source": words
                    });
                });
            },
            "error" : function(jqXHR, textStatus, errorThrown) {
                obp.console.log("Typeahead ajax error: " + textStatus);
            }
        });
    }
    window.obp = new Openbibl();
    $(document).ready(function() {
        window.obp.docready();
    });

})();
