define(
  [ 'module', 'obpconfig', 'obpstate', 'jquery', 'obpev' ]
, function(module,obpconfig,obpstate,$,obpev) {
    return {
          subscribers : []
        , request_query_data : function(file) {
            var query = this;
            $.ajax({
                "url":      file
                , "async":    true
                , "type":     "GET"
                , "dataType": "json"
                , "success":  function(data) {
                    obpstate.query.data = data;
                    query.notify_subscribers();
                 }
                 , "error" : function(jqXHR, textStatus, errorThrown) {
                    console.log('File "' + file  + '" not available. Requesting index data be generated.');
                    query.request_saxon_query();
                }
            });
        }
        , notify_subscribers : function() {
            var subscribers = this.subscribers || [];
            for (var i = 0; i < subscribers.length; i++)
                subscribers[i].handle_query_data();
        }
        , request_saxon_query : function() {
            var callback = function(data) {
                var json;
                try {
                    json = JSON.parse(data.getResultDocument().textContent);
                } catch (e) {
                    console.log('Failure to generate query data: ' + e.toString());
                }
                window.obp.query.handle_query_success(json);
            };
            window.obp.SaxonCE.requestQueryTransform(
                window.obp.config.paths['query_xsl'],
                window.obp.bibliographies.xml,
                [],
                callback
            );
        }
    };
});
