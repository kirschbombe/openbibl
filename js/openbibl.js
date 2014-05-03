(function() {
"use strict";
    function Openbibl() {}
    // TODO: fix project pathing
    Openbibl.prototype.config = {
        template_dir : '../../js/templates',
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
        // obp event target is <body>
        this.event.target = $(document.getElementsByTagName('body')[0]);
        // initialize the bibliography entry filter, highlighter,
        // and sort objects (for event listening)
        this.filter.init([this.search, this.browse]);
        this.highlight.init([this.search, this.browse]);
        this.search.init();
        this.browse.init();
        this.sort.init();
        this.tooltip.init();
        this.toc.init();
        this.download.init();
        // check for a last-used theme in the cookies and load it if found
        this.change_theme(this.retrieve_cookie('theme-stylesheet'));
        // fill data for "Search" input
        var browse_data_file = 'query.json';
        var search_file = document.location.href.replace(/[^\/]+$/,"") + browse_data_file;
        this.query.init(search_file, [this.search, this.browse]);
        // enable sorting
        $('.obp-sort-anchor').on('click', function(e) {
            window.obp.sort.sort_entries(e.target.getAttribute('data-sort-key'));
        });
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
        // initialize UI items; NOTE: added for serialize-to-HTML feature; probably can 
        // be handled more effectively otherwise
        window.obp.event["target"].trigger(obp.event["events"]["obp:bibliography-added"]);
        // prevent scroll event from bubbling up to ancestors
        $('.obp-browse-panel-body').bind('mousewheel DOMMouseScroll', function(e) {
            var $this = $(this);
            var scrollto_position = null;
            if (e.type === 'mousewheel') {
                scrollto_position = e.originalEvent.wheelDelta * -1;
            } else if (e.type === 'DOMMouseScroll') {
                scrollto_position = 40 * e.originalEvent.detail;
            }
            if (scrollto_position != null) {
                e.preventDefault();
                $this.scrollTop(scrollto_position + $this.scrollTop());
            }
        });
    }
    Openbibl.prototype.browse    = {};
    Openbibl.prototype.download  = {};
    Openbibl.prototype.filter    = {};
    Openbibl.prototype.highlight = {};
    Openbibl.prototype.query     = {};
    Openbibl.prototype.SaxonCE   = {};
    Openbibl.prototype.search    = {};
    Openbibl.prototype.sort      = {};
    Openbibl.prototype.storage   = {};
    Openbibl.prototype.tooltip   = {};
    Openbibl.prototype.toc       = {};
    Openbibl.prototype.typeahead = {};
    window.obp = new Openbibl();
    $(document).ready(function() { window.obp.onDocumentReady(); });
})();
