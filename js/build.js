// r.js optimizer config file
// CURRENTLY UNUSED
/*jslint white: true, ass: true */
/*global define: true */
({
      generateSourceMaps : true
    , preserveLicenseComments : false 
    ,  optimize : "uglify2"
    , 
    
      baseUrl: "."
    , name: "main"
    , out: "main.min.js"
    , paths : {
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
