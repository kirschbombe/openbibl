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
    return {
        bibliographies : {
              count         : 0
            , xml           : global_bib_data.bibliographies.xml
            , xsl           : global_bib_data.bibliographies.xsl
        }
        , saxonInterval : null
        , query : {
            data : null
        }
        , rebase : function(obj) {
            for (var key in obj)
                if (this.hasOwnProperty(key)) this[key] = obj[key];
        }
    };
});
