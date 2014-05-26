define( []
, function() {
    var config = {
          debug : false
        , console : (typeof console == 'object')
                  ? console
                  : { log : function(){} }
        , saxonLogLevel : 'OFF'     // SEVERE, OFF, WARINING, INFO, CONFIG, FINE, FINER, FINEST
        , saxonPollInterval: 100    // time in ms for polling for Saxon-CE load state

          // project paths are relative to the obp root directory
        , paths : {
              obp_root        : ''
            , template_dir    : 'js/templates'              // Handlebars template dir
            , query_xsl       : 'xsl/openbibl.query.xsl'    // xsl for generating browse data
        }
        , scroll_speed        : 200                         // TOC-click scroll speed (ms)
        // query file is located relative to the XML file it is generated from
        , query : {
             file  : 'obp.query.json'               // serialized json file
        }
        , templates : {}                            // html templates used; for serialization to html
        , template_pattern : "\{\{(.+?)\}\}"        // NB: string regex
        , typeahead : {
            list_len: 20
        }
    };
    config.rebase = function(obj) {
        if (typeof obj !== "object") throw "obp.config.rebase() requires an object";
        for (var key in obj) {
            if (this.hasOwnProperty(key)) {
                this[key] = obj[key];
            } else {
                throw "Unsupported config key in obp.config.rebase: " + key;
            }
        }
    }
    return config;
});
