
require.config({ 
      paths : {
          'domReady'    : 'lib/domReady-2.0.1'
        , 'jquery'      : 'lib/jquery-2.1.0.min'
        , 'typeahead'   : 'lib/bootstrap-typeahead-2.3.2'
        , 'cookie'      : 'lib/jquery.cookie'
        , 'underscore'  : 'lib/underscore-1.6.0.min'
        , 'filesaver'   : 'lib/FileSaver'
        
        , 'obpconfig'   : 'openbibl/config'
        , 'obpev'       : 'openbibl/event'
        , 'obpstate'    : 'openbibl/state'
        , 'browse'      : 'openbibl/browse'
        , 'download'    : 'openbibl/download'
        , 'filter'      : 'openbibl/filter'
        , 'highlight'   : 'openbibl/highlight'
        , 'query'       : 'openbibl/query'
        , 'saxon'       : 'openbibl/saxon'
        , 'search'      : 'openbibl/search'
        , 'sort'        : 'openbibl/sort'
        , 'theme'       : 'openbibl/theme'
        , 'toc'         : 'openbibl/toc'
        , 'tooltip'     : 'openbibl/tooltip'
    }
    , shim : {
          'tyepahead' : { deps: ['jquery'] }
    }
});

// TODO: need obp name?
// the modules are passed here, although not used, to trigger
// initialization
define(
  [  'module', 'require', 'domReady', 'jquery', 'underscore',
     'obpconfig', 'obpev', 'obpstate', 
     'filter', 'browse', 'search', 'query', 'highlight',
     'saxon', 'download', 'sort', 'theme', 'toc', 'tooltip',
  ]
, function(module,require,domReady,$,_,obpconfig,obpev,obpstate,
           filter,browse,search,query,highlight, saxon, download
) {
    // determine whether this is an XML or HTML file load based on href
    // TODO: do not use file extension
    var html_load = (document.location.href.replace(/#.*/,'').match(/xml$/) === null); 
    if (html_load) {
        obpconfig.rebase(window.obp.obpconfig);
        obpstate.rebase(window.obp.obpstate);
    } else {
        obpstate.bibliographies.count = 0;
        obpconfig.paths['obp_root'] = window.obp.appdir;
        for (var key in obpconfig.paths) {
            if (key !== 'obp_root') {
                obpconfig.paths[key] = obpconfig.paths['obp_root'] + obpconfig.paths[key]
            }
        }
    }
    filter.init([browse,search]);
    highlight.init([browse,search]);
    browse.init();
    search.init();
    _.templateSettings = { 
        interpolate: (new RegExp(obpconfig.template_pattern)) 
    };
    module.exports.register_query_data = function() {
        // request query data
        var dir = obpstate.bibliographies.xml.replace(/[^/\\]+$/,'');
        var query_data_file = dir + obpconfig.query.file;
        query.subscribers = [search, browse];
        query.request_query_data(query_data_file);
    };
    if (!html_load) {
        module.exports.onSaxonLoad = function() {
            saxon.onSaxonLoad(Saxon);
            var success = function(data) {
                // request transform of bibl entries
                obpstate.bibliographies.count = $('div.entry').length;
                obpev.raise("obp:bibliography-added", module.id);
                module.exports.register_query_data();
            };
            saxon.requestInitialTransform(
                obpstate.bibliographies.xsl,    // openbibl.xsl stylesheet path
                obpstate.bibliographies.xml,    // TEI XML document path
                [],
                success
            );
        };
        module.exports.saxonLoadedCB = function() {
            if (window.obp.saxonLoaded) {
                if (obpstate.saxonInterval !== null) {
                    window.clearInterval(obpstate.saxonInterval);
                    obpstate.saxonInterval = null;
                }
                module.exports.onSaxonLoad();
            } else {
                if (obpstate.saxonInterval === null) {
                    obpstate.saxonInterval = window.setInterval(
                        function() {
                            module.exports.saxonLoadedCB();
                        }, obpconfig.saxonPollInterval
                    );
                }
            }
        };
        module.exports.saxonLoadedCB();
    }
    domReady(function() {
        //set absolute paths
        $('.obp-filter-mode').change(function(event){
            obpev.raise("obp:filter-mode-change",module.id);
            obpev.raise("obp:filter-change",module.id);
        });
        $(window).resize(function() {
            obpev.raise("obp:filter-mode-change",module.id);
            obpev.raise("obp:filter-change",module.id);
            obpev.raise("obp:search-term-change",module.id);
            obpev.raise("obp:browse-term-change",module.id);
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
        obpev.raise("obp:bibliography-added", module.id);
        // make sure browse data is used
        if (obpconfig.query.data === undefined) module.exports.register_query_data();        
    });
    return {};
});
