define([]
, function() {
    // The xsl->js handoff is done by means of an 'obp' property
    // attached to the global window object
    // TODO: handle better
    var global_bib_data = window.hasOwnProperty('obp')
        ? window.obp
        :   { bibliographies : {
                  xml : ''
                , xsl : ''
            }
        };
    var serialize = {
        bibliographies  : true
        , saxonInterval : false
        , query         : true
        , rebase        : true
        , stringify     : true
    };
    // TODO: factor out rebase and stringify for state.js and config.js
    var rebase = function(obj) {
        if (typeof obj !== "object") throw "obp.state.rebase() requires an object";
        for (var key in obj) {
            if (this.hasOwnProperty(key)) {
                this[key] = obj[key];
            } else {
                throw "Unsupported key in obp.state.rebase: " + key;
            }
        }
    };
    var stringify = function() {
        var ret = {};
        for (var key in this) {
            if (serialize[key])
                ret[key] = this[key];
        }
        return JSON.stringify(ret);
    };
    var state = {
        bibliographies : {
              count         : 0
            , xml           : global_bib_data.bibliographies.xml
            , xsl           : global_bib_data.bibliographies.xsl
        }
        , saxonInterval : null
        , query : {
            data : null
        }
        , rebase    : rebase
        , stringify : stringify
    };
    return state;
});
