/*
* Openbibl Framework v0.1.0
* Copyright 2014, Dawn Childress
* Contact: https://github.com/kirschbombe/openbibl
* License: GNU AGPL v3 (https://github.com/kirschbombe/openbibl/LICENSE)
*/
/*jslint white: true, todo: true, nomen: true, regexp: true */
/*global require: true */

/**
 * Main entry point for the Openbibl framework.
 *
 * This module is loaded according to the RequireJS @data-main attribute and performs
 * setting of configuration options for RequireJS and for the Openbibl framework modules.
 *
 * @module main
 */
require.config({
      paths : {
          'domReady'    : 'lib/domReady-2.0.1'
        , 'jquery'      : 'lib/jquery-2.1.0.min'
        , 'typeahead'   : 'lib/bootstrap-typeahead-2.3.2'
        , 'cookie'      : 'lib/jquery.cookie'
        , 'underscore'  : 'lib/underscore-1.6.0.min'
        , 'filesaver'   : 'lib/FileSaver'

        , 'browse'      : 'openbibl/browse'
        , 'obpconfig'   : 'openbibl/config'
        , 'download'    : 'openbibl/download'
        , 'obpev'       : 'openbibl/event'
        , 'filter'      : 'openbibl/filter'
        , 'highlight'   : 'openbibl/highlight'
        , 'obp'         : 'openbibl/obp'
        , 'query'       : 'openbibl/query'
        , 'saxon'       : 'openbibl/saxon'
        , 'search'      : 'openbibl/search'
        , 'sort'        : 'openbibl/sort'
        , 'obpstate'    : 'openbibl/state'
        , 'theme'       : 'openbibl/theme'
        , 'toc'         : 'openbibl/toc'
        , 'tooltip'     : 'openbibl/tooltip'
    }
    , shim : {
          'typeahead' : { deps: ['jquery'] }
    }
});
