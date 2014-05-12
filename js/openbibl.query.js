(function() {
"use strict";
    window.obp.query.subscribers = [];
    window.obp.query.init = function(file, subscribers){
        var obp_query = this;
        this.subscribers = subscribers;
        if (window.obp.config.query.data === null) {
            this.request_query_data(file);
        } else {
            this.notify_subscribers();
        }
    };
    window.obp.query.request_query_data = function(file) {
        $.ajax({
            "url":      file,
            "async":    true,
            "type":     "GET",
            "dataType": "json",
            "success":  window.obp.query.handle_query_success,
            "error" : function(jqXHR, textStatus, errorThrown) {
                console.log('File "' +   + '" not available. Requesting index data be generated.');
                window.obp.query.request_saxon_query
            }
        });
    };
    window.obp.query.handle_query_success = function(data) {
        window.obp.config.query.data = data;
        window.obp.query.notify_subscribers();
    };
    window.obp.query.notify_subscribers = function() {
        var subscribers = window.obp.query.subscribers || [];
        for (var i = 0; i < subscribers.length; i++)
            subscribers[i].handle_query_data();
    };
    window.obp.query.request_saxon_query = function() {
        window.obp.SaxonCE.requestQueryTransform(
            window.obp.config.paths['query_xsl'],
            window.obp.bibliographies.xml,
            [],
            function(data) {
                var json;
                try {
                    json = JSON.parse(data.getResultDocument().textContent);
                } catch (e) {
                    console.log('Failure to generate query data: ' + e.toString());
                }
                this.handle_query_success(json);
            }
        );
    };
})();
