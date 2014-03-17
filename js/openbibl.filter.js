(function() {
"use strict";
    window.obp.filter.add_filter_item = function(selection) {
       var id = 'obp-filter-li-'
                + document.getElementById('search-results-list').childNodes.length;
       var $new_li = $('<li class="list-group-item">'
       + '<a id="'+ id + '" href="#" data-selection="'+ selection + '">'
       + '<span class="glyphicon glyphicon-remove-sign"></span></a> '
       + selection 
       + '</li>');
       var $ul = $(document.getElementById('search-results-list'));
       if ($ul.find('a').length == 0) {
            $('.obp-filter-results').toggle();
       }
       $ul.append($new_li);
       $('#' + id).click(function(e) {
            window.obp.filter.remove_filter_item(e.target.parentElement);
       });
       this.filter_entries(selection);
    }
    window.obp.filter.filter_entries = function(selection) {
        var obp = window.obp;
        var obp_t = obp.typeahead;
        // add one for indexing shift
        var lookup = new Array(obp.bibliographies.count + 1);
        for (var i = 0; i <= obp.bibliographies.count; i++) {lookup[i] = false}
        // loop over the div's that are keyed to this selection
        $.map(obp_t.data[selection], function(n,i) {
            lookup[n] = true;
        });
        var prefix = window.obp.storage.key_div;
        var stored = {};
        for (var i = 1; i <= obp.bibliographies.count; i++) {
            var $div = $('div[data-src-index="' + i + '"]');
            if ( lookup[i] !== true && $div.length > 0)
                stored[prefix + i] = $div.remove()[0];
        }
        window.obp.storage.store(stored);
        obp.highlight.highlight_term(selection);
    }
    window.obp.filter.remove_filter_item = function(anchor) {
        var obp = window.obp;
        // remove the filter entry from the list
        var $li = $(anchor.parentElement);
        var $ul = $li.parent();
        var item_key = anchor.getAttribute('data-selection');
        $li.remove();
        // unfilter the bibl entries
        var selections = $.map($ul.find('a'), function(n,i) {
            return n.getAttribute('data-selection')
        });
        // remove highlight <span> on un-unfiltered bibl set
        obp.highlight.unhighlight_term(item_key);
        // un-unfilter bibl set
        var unloaded = [];
        if (selections.length === 0) {
            $('.obp-filter-results').toggle();
            for ( var i = 1; i <= obp.bibliographies.count; i++) {
                if ( $('.entry[data-src-index="' + i + '"]').length == 0 ) {
                    unloaded.push(obp.storage.key_div + i);
                }
            }
        } else {
            unloaded = $.grep(obp.typeahead.data[selections], function(n,i) {
                return $('.entry[data-src-index="' + n + '"]').length == 0;
            }).map(function(n,i){
                return obp.storage.key_div + n;
            });
        }
        if (unloaded.length > 0) { 
            var divs = obp.storage.retrieve(unloaded);
            $('#bibliographies').append(divs);
            obp.sort.sort_entries(obp.sort.current_sort_key);
            var hterms = $('#search-results-list').find('a').map(function(i,e) { 
                return $(e).attr('data-selection') 
            })
        }
    }   
})();
