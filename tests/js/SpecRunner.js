(function() {
  'use strict';

  require.config({
      baseUrl: '../..'
    // , waitSeconds : 9999
    , paths: {
          'jasmine'        : 'tests/js/lib/jasmine-2.0.0/jasmine'
        , 'jasmine-html'   : 'tests/js/lib/jasmine-2.0.0/jasmine-html'
        , 'jasmine-jquery' : 'tests/js/lib/jasmine-jquery-2.1.0'
        , 'boot'           : 'tests/js/lib/jasmine-2.0.0/boot'

        , 'domReady'    : 'js/lib/domReady-2.0.1'
        , 'jquery'      : 'js/lib/jquery-2.1.0'
        , 'typeahead'   : 'js/lib/bootstrap-typeahead-2.3.2'
        , 'cookie'      : 'js/lib/jquery.cookie'
        , 'underscore'  : 'js/lib/underscore-1.6.0.min'
        , 'filesaver'   : 'js/lib/FileSaver'
        , 'bootstrap'   : 'js/lib/bootstrap-3.1.1'
        , 'saxonce'     : 'js/lib/saxon-ce/1.1/Saxonce.nocache'

        , 'browse'      : 'js/openbibl/browse'
        , 'obpconfig'   : 'js/openbibl/config'
        , 'download'    : 'js/openbibl/download'
        , 'obpev'       : 'js/openbibl/event'
        , 'filter'      : 'js/openbibl/filter'
        , 'highlight'   : 'js/openbibl/highlight'
        , 'obp'         : 'js/openbibl/obp'
        , 'query'       : 'js/openbibl/query'
        , 'saxon'       : 'js/openbibl/saxon'
        , 'search'      : 'js/openbibl/search'
        , 'sort'        : 'js/openbibl/sort'
        , 'obpstate'    : 'js/openbibl/state'
        , 'template'    : 'js/openbibl/template'
        , 'theme'       : 'js/openbibl/theme'
        , 'toc'         : 'js/openbibl/toc'
        , 'tooltip'     : 'js/openbibl/tooltip'
    },
    shim: {
      'jasmine': {
        exports: 'window.jasmineRequire'
      }
      , 'jasmine-html': {
          deps: ['jasmine']
        , exports: 'window.jasmineRequire'
      }
      , 'jasmine-jquery' : {
          deps: ['jquery']
        , exports: 'window.spyOnEvent'
      }
      , 'boot': {
          deps: ['jasmine', 'jasmine-html']
        , exports: 'window.jasmineRequire'
      }
      , 'bootstrap' : {
          deps: ['jquery']
      }
      , 'saxonce' : {
          exports : 'window.Saxon'
      }, 'typeahead' : {
            deps : ['jquery']
          , exports : '$.fn.typeahead'
      }
    }
  });

  var specs = [
        'tests/js/spec/openbibl/browse'
      , 'tests/js/spec/openbibl/config'
      , 'tests/js/spec/openbibl/download'
      , 'tests/js/spec/openbibl/event'
      , 'tests/js/spec/openbibl/filter'
      , 'tests/js/spec/openbibl/highlight'
      , 'tests/js/spec/openbibl/query'
      , 'tests/js/spec/openbibl/saxon'
      , 'tests/js/spec/openbibl/search'
      , 'tests/js/spec/openbibl/sort'
      , 'tests/js/spec/openbibl/theme'
      , 'tests/js/spec/openbibl/toc'
      , 'tests/js/spec/openbibl/tooltip'
  ];

  // jasmine bootloader
  require(['boot'], function () {
    require(specs, function () {
      window.onload();
    });
  });

})();
