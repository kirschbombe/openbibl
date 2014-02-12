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

        // update css stylesheet on change of theme form
        $('#theme-form').change(function(){
            var parts = $('#theme-css').attr('href').split('/');
            parts[parts.length-1] = $('#theme-form-select').children('option:selected').attr('value');
            $('#theme-css').attr('href', parts.join('/'));
        });

        // menu offcanvas (bootstrap)
        $('[data-toggle=offcanvas]').click(function() {
            $('.row-offcanvas').toggleClass('active');
        });

    }); // end document-ready callback

})();
