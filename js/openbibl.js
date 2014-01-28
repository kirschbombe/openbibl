(function() {
    $(document).ready(function() {
    
        // add event handler for 'hover' for the <head>
        // and <biblStruct> elements, to unhide/expand 
        // the content for the following elements
        /*
        $(document).find('.expand').each(function() {
            var $expanded = $(this);
            var $collapsed = $expanded.next();
            var collapsed_height = $collapsed.height();
            $expanded.hover(
                function (e) {
                    $collapsed.animate({
                        height: "100%"
                    }, 150, "swing"
               )},
               function(e) {
                    $collapsed.animate({
                        height: collapsed_height
                    }, 150, "swing"
               )}
           );
        });
        */
    })
    
    
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

})();
