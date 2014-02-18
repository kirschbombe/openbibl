"use strict";
(function() {
    
    // js callbacks to be installed once page is loaded
    $(document).ready(function() {
        var browse_ids = {'browse-people' : { 'properties' : ['name'],           'class' : 'yellow' },
                          'browse-places' : { 'properties' : ['location'],       'class' : 'pink' },
                          'browse-dates'  : { 'properties' : ['datePublished'],  'class' : 'purple' }
                          };
        for (var id in browse_ids) {
            $('#' + id).click(function(e) {
                var id = $(this).attr('id');
                var selector = $.map(browse_ids[id]['properties'], function(elt) { return 'span[itemprop="'+ elt +'"]' }).join();
                $(document).find(selector).each(function() {
                    if (!$(this).hasClass('browsed')) {
                        $(this).addClass(browse_ids[id]['class']);
                    } else {
                        $(this).removeClass(browse_ids[id]['class']);
                    }
                    $(this).toggleClass('browsed');
                });
            });
        }

        // menu offcanvas (bootstrap)
        $('[data-toggle=offcanvas]').click(function() {
            $('.row-offcanvas').toggleClass('active');
        });
        
        // typeahead
        var typeahead_file = document.location.href.replace(/[^\/]+$/,"") + 'typeahead.json';
        var typeahead_list_len = 100;
        $.ajax({
            "url":      typeahead_file,
            "type":     "GET",
            "dataType": "json",
            "success":  function(data) {
                var words = Object.keys(data);
                $('.search-input').each(function() {
                    $(this).typeahead({
                        "items": typeahead_list_len,
                        "matcher": function(item) {
                            //return new RegExp("^" + this.query, "i").test(item);
                            return new RegExp("^" + this.query, "").test(item);
                        },
                        "source": words
                    });
                });
            },
            "error" : function(jqXHR, textStatus, errorThrown) {
                console.log("Typeahead ajax error: " + textStatus);
            }
        });

    }); // end document-ready callback

})();
