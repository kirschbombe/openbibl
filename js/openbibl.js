(function() {
"use strict";
    function Openbibl() {}
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
            "obp:filter-complete"       : "obp:filter-complete",
            "obp:bibliography-added"    : "obp:bibliography-added"
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
        this.sort.init();
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
        // set focus for search <input> when made visible 
        $('#obp-search-panel').bind('shown.bs.collapse', function() {
            $('#obp-search-panel-input').focus();
        });
        $('.obp-browse-checkbox').click(function(){
            window.obp.event["target"].trigger(obp.event["events"]["obp:filter-change"]);
        });
        $('.obp-filter-mode').change(function(){
            window.obp.event["target"].trigger(obp.event["events"]["obp:filter-change"]);
        });
        $('.obp-filter-clear').click(function(event){
            window.obp.browse.clear_browse_items($(event.target));
            window.obp.search.clear_search_items($(event.target));
            event.preventDefault();
        });
        window.obp.event["target"].on(obp.event["events"]["obp:bibliography-added"], function() {
            $('[data-toggle="tooltip"]').tooltip({
                placement : "top",
                trigger   : "hover"
            });
        });
        window.obp.event["target"].on(obp.event["events"]["obp:filter-complete"], function() {
            $('[data-toggle="tooltip"]').tooltip({
                placement : "top",
                trigger   : "hover"
            });
        });
        $('.obp-search-form').on('submit', function(event) {
            // prevent the search field from causing a page
            // reload when a typeahead suggestion is unavailable
            event.preventDefault();
        })
    }
    Openbibl.prototype.browse    = {};
    Openbibl.prototype.filter    = {};
    Openbibl.prototype.highlight = {};
    Openbibl.prototype.query     = {};
    Openbibl.prototype.SaxonCE   = {};
    Openbibl.prototype.search    = {};
    Openbibl.prototype.sort      = {};
    Openbibl.prototype.storage   = {};
    Openbibl.prototype.typeahead = {};
    window.obp = new Openbibl();
    $(document).ready(function() { window.obp.onDocumentReady(); });
})();
