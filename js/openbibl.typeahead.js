(function() {
"use strict";
    window.obp.typeahead.terms = null;
    window.obp.typeahead.data = {};
    window.obp.typeahead.to_key = function(item) {
        return String(item).toUpperCase();
    };
    window.obp.typeahead.load = function(){
        var obp_t = this;
        // TODO: parameterize these vars
        var typeahead_file = document.location.href.replace(/[^\/]+$/,"") + 'typeahead.json';
        var typeahead_list_len = 20;
        $.ajax({
            "url":      typeahead_file,
            "async":    true,
            "type":     "GET",
            "dataType": "json",
            "success":  function(data) {
                var i, j;
                var termmap = {};
                for (i = 0; i < data.length; i+=2) {
                    for (j = 0; j < data[i].length; j++) {
                        termmap[data[i][j]] = data[i+1];
                    }
                }
                obp_t.data = termmap;

                $('.search-input').typeahead({
                    "items": typeahead_list_len,
                    "matcher": function(item) {
                        return new RegExp("^" + this.query, "i").test(item);
                    },
                    "source": obp_t.source,
                    "updater": obp_t.updater
                })
            },
            "error" : function(jqXHR, textStatus, errorThrown) {
                obp.console.log("Typeahead ajax error: " + textStatus);
            }
        });
    }
    window.obp.typeahead.source = function() {
       var obp_t = window.obp.typeahead;
       var applied = {};
       $.map($(document.getElementById('search-results-list')).find('a'), function(n,i) {
           applied[ obp_t.to_key(n.getAttribute('data-selection')) ] = true;
       });
       return $.grep(Object.keys(obp_t.data), function(n,i) {
           return !applied[ obp_t.to_key(n) ];
       });
    }
    window.obp.typeahead.updater = function(selection) {
        var obp = window.obp;
        if (obp.debug) obp.console.log("Adding filter item: " + selection);
        // clear input element
        $('.typeahead').val('');
        obp.filter.add_filter_item(selection);
    }
})();
