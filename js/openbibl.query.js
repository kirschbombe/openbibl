(function() {
"use strict";
    window.obp.query.subscribers = []; 
    window.obp.query.init = function(file, subscribers){
        var obp_query = this;
        this.subscribers = subscribers;
        $.ajax({
            "url":      file,
            "async":    true,
            "type":     "GET",
            "dataType": "json",
            "success":  obp_query.handle_query_success,
            "error" : function(jqXHR, textStatus, errorThrown) {
                window.obp.console.log("Query data ajax error: " + textStatus);
            }
        });
    }
    window.obp.query.handle_query_success = function(data) {
        var subscribers = window.obp.query.subscribers;
        for (var i = 0; i < subscribers.length; i++) {
            subscribers[i].handle_query_data(data);
        }
    }
})();
