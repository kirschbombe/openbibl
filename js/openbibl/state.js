define([]
, function() {
    return {
        bibliographies : {
              count         : 0
            , xml           : window.obp.bibliographies.xml 
            , xsl           : window.obp.bibliographies.xsl
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
