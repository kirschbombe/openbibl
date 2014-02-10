(function() {

    // obp object attached to js window global, for access in callbacks
    function Openbibl() {}
    Openbibl.prototype.Saxon = null;
    Openbibl.prototype.onSaxonLoad = function(Saxon) {
        this.Saxon = Saxon;
        var xml_dir = document.location.href.replace(/[^\/]+$/, "");    // directory containing xml file, with trailing /
        var xsl = Saxon.requestXML(xml_dir + "../../xsl/openbibl.xsl"); // openbibl.xsl 2.0 stylesheet
        var xml = Saxon.requestXML(document.location.href);             // reload the XML file being handled here
        var proc = Saxon.newXSLT20Processor(xsl);
        proc.setSuccess(function(data) {
            var children = data.getResultDocument().querySelector("#result").childNodes;
            var bibliographies_wrapper = document.getElementById("bibliographies");
            var footer = document.getElementById("footer");
            for (var i = 0; i < children.length; i++)
                bibliographies_wrapper.insertBefore(children[i].cloneNode(true),footer);
            //handle_hover();
        });
        proc.transformToDocument(xml);
    };
    window.obp = new Openbibl();
    
    // js callbacks to be installed once page is loaded
    $(document).ready(function() {
        var browse_ids = {'browse-people' : { 'properties' : ['name'],           'class' : 'yellow' },
                          'browse-places' : { 'properties' : ['location'],       'class' : 'pink' },
                          'browse-dates'  : { 'properties' : ['datePublished'],  'class' : 'purple' }
                          };
        for (var id in browse_ids) {
            $('#' + id).click(function(e) {
                var id = $(this).attr('id');
                var selector = $.map(browse_ids[id]['properties'], function(elt) { return 'span[itemprop="'+ elt +'"]' }).join();
                $(document).find(selector).each(function() {
                    if (!$(this).hasClass('browsed')) {
                        $(this).addClass(browse_ids[id]['class']);
                    } else {
                        $(this).removeClass(browse_ids[id]['class']);
                    }
                    $(this).toggleClass('browsed');
                });
            });
        }

        // update css stylesheet on change of theme form
        $('#theme-form').change(function(){
        debugger;
            var parts = $('#theme-css').attr('href').split('/');
            parts[parts.length-1] = $('#theme-form-select').children('option:selected').attr('value');
            $('#theme-css').attr('href', parts.join('/'));
        });

    // end document-ready callback
    });

})();
