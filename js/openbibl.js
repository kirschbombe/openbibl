(function() {
"use strict";
    function Openbibl() {}
    // TODO: fix project pathing
    Openbibl.prototype.config = {
          paths : {
              obp_root        : ''
            , template_dir    : 'js/templates'              // Handlebars template dir
            , query_xsl       : 'xsl/openbibl.query.xsl'    // xsl for generating browse data
          }
        , scroll_speed     : 200                            // TOC-click scroll speed (ms)
        , query :{
              data  : null                           // json data for browse/search
            , file  : 'obp.query.json'               // serialized json file
        }
        , templates : {}                            // html templates used; for serialization to html
    }
    Openbibl.prototype.debug = false;
    Openbibl.prototype.console = (typeof console == 'object') ? console : {};
    Openbibl.prototype.bibliographies = {
        count: 0
    }
    Openbibl.prototype.event = {
        target: null,   // $(document.getElementsByTagName('body')[0]);
        events: {
            "obp:filter-start"          : "obp:filter-start",
            "obp:filter-change"         : "obp:filter-change",
            "obp:filter-mode-change"    : "obp:filter-mode-change",
            "obp:filter-complete"       : "obp:filter-complete",
            "obp:bibliography-added"    : "obp:bibliography-added",
            "obp:search-term-change"    : "obp:search-term-change",
            "obp:browse-term-change"    : "obp:browse-term-change"
        }
    }
    // initial document-ready event
    Openbibl.prototype.onDocumentReady = function() {
        // set absolute paths
        for (var key in this.config.paths) {
            if (key !== 'obp_root') {
                this.config.paths[key] = this.config.paths['obp_root'] + this.config.paths[key]
            }
        }
        // obp event target is <body>
        this.event.target = $(document.getElementsByTagName('body')[0]);
        // initialize the bibliography entry filter, highlighter,
        // and sort objects (for event listening)
        this.filter.init([this.search, this.browse]);
        this.highlight.init([this.search, this.browse]);
        this.search.init();
        this.browse.init();
        this.sort.init();
        this.theme.init();
        this.tooltip.init();
        this.toc.init();
        this.download.init();
        $('.obp-filter-mode').change(function(event){
            window.obp.search.filter_mode_change(event);
            window.obp.browse.filter_mode_change(event);
            window.obp.event["target"].trigger(obp.event["events"]["obp:filter-change"]);
        });
        $(window).resize(function () {
            window.obp.event["target"].trigger(obp.event["events"]["obp:filter-mode-change"]);
            window.obp.event["target"].trigger(obp.event["events"]["obp:filter-change"]);
            window.obp.event["target"].trigger(obp.event["events"]["obp:search-term-change"]);
            window.obp.event["target"].trigger(obp.event["events"]["obp:browse-term-change"]);
        });
        // prevent scroll event from bubbling up to ancestors
        $('.obp-menu-panel-checkboxes').bind('scroll mousewheel DOMMouseScroll', function(e) {
            var $this = $(this);
            var scrollto_position = null;
            if (e.type === 'mousewheel') {
                scrollto_position = e.originalEvent.wheelDelta * -1;
            } else if (e.type === 'DOMMouseScroll') {
                scrollto_position = 40 * e.originalEvent.detail;
            }
            if (scrollto_position != null) {
                $this.closest('.obp-menu-panel-checkboxes').scrollTop(scrollto_position + $this.scrollTop());
            }
            e.preventDefault();
        });
        // initialize UI items; NOTE: added for serialize-to-HTML feature; probably can
        // be handled more effectively otherwise
        window.obp.event["target"].trigger(obp.event["events"]["obp:bibliography-added"]);
        // make sure browse data is used
        if (this.config.query.data !== null) this.register_query_data();
    }
    Openbibl.prototype.onSaxonLoad = function(Saxon) {
        this.SaxonCE.onSaxonLoad(Saxon);
        var success = function(data) {
            // request transform of bibl entries
            var obp = window.obp;
            obp.bibliographies.count = $('div.entry').length;
            obp.event["target"].trigger(window.obp.event["events"]["obp:bibliography-added"]);
            obp.register_query_data();
        };
        this.SaxonCE.requestInitialTransform(
            this.bibliographies.xsl,    // openbibl.xsl stylesheet path
            this.bibliographies.xml,    // TEI XML document path
            [],
            success
        );
    }
    Openbibl.prototype.register_query_data = function() {
        // request query data
        var dir = window.obp.bibliographies.xml.replace(/[^/\\]+$/,'');
        var query_data_file = dir + window.obp.config.query.file;
        window.obp.query.init(
              query_data_file
            , [window.obp.search, window.obp.browse]
        );
    };
    Openbibl.prototype.browse    = {};
    Openbibl.prototype.download  = {};
    Openbibl.prototype.filter    = {};
    Openbibl.prototype.highlight = {};
    Openbibl.prototype.query     = {};
    Openbibl.prototype.SaxonCE   = {};
    Openbibl.prototype.search    = {};
    Openbibl.prototype.sort      = {};
    Openbibl.prototype.theme     = {};
    Openbibl.prototype.tooltip   = {};
    Openbibl.prototype.toc       = {};
    Openbibl.prototype.typeahead = {};
    window.obp = new Openbibl();
    $(document).ready(function() { window.obp.onDocumentReady(); });
})();
