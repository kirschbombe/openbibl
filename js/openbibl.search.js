(function() {
"use strict";
    window.obp.search.typeahead_list_len = 20;
    window.obp.search.terms = null;
    // TODO: parameterize
    window.obp.search.data = {};
    window.obp.search.to_key = function(item) {
        return String(item).toUpperCase();
    };
    window.obp.search.clear_search_items = function(target) {
        var search = this;
        $(target).closest('#obp-search-panel').find('.obp-search-item a').map(function(i,elt) {
            search.remove_search_term(elt);
        });        
    }
    window.obp.search.handle_query_data = function(data) {
        var obp_search = window.obp.search;
        var i, j;
        var termmap = {};
        var len = data["search"].length;
        var search_data = data["search"];
        for (i = 0; i < len; i+=2) {
            for (j = 0; j < search_data[i].length; j++) {
                termmap[search_data[i][j]] = search_data[i+1];
            }
        }
        obp_search.data = termmap;
        $('.search-input').typeahead({
            "items":   obp_search.typeahead_list_len,
            "matcher": obp_search.matcher,
            "source":  obp_search.source,
            "updater": obp_search.updater
        });
    }
    window.obp.search.source = function() {
       var obp_search = window.obp.search;
       var applied = {};
       $.map($(document.getElementById('search-results-list')).find('a'), function(n,i) {
           applied[ obp_search.to_key(n.getAttribute('data-selection')) ] = true;
       });
       return $.grep(Object.keys(obp_search.data), function(n,i) {
           return !applied[ obp_search.to_key(n) ];
       });
    }
    window.obp.search.matcher = function(item) {
        return new RegExp("^" + this.query, "i").test(item);
    }
    window.obp.search.updater = function(selection) {
        var obp = window.obp;
        if (obp.debug) obp.console.log("Adding filter item: " + selection);
        // clear input element
        $('.typeahead').val('');
        obp.search.add_search_term(selection);
    }
    window.obp.search.add_search_term = function(term) {
       var id = 'obp-filter-li-'
                + document.getElementById('search-results-list').childNodes.length;
       // TODO: use external template
       var $new_li = $('<li class="list-group-item obp-search-item">'
       + '<a id="'+ id + '" href="#" data-selection="'+ term + '">'
       + '<span class="glyphicon glyphicon-remove-sign"></span></a> '
       + term 
       + '</li>');
       var $ul = $(document.getElementById('search-results-list'));
       $ul.append($new_li);
       // add event handler for removal of search term
       $('#' + id).click(function(e) {
            window.obp.search.remove_search_term(
                e.target.parentElement
            );
       });
       window.obp.event["target"].trigger(obp.event["events"]["obp:filter-change"]);
    }
    window.obp.search.remove_search_term = function(anchor) {
        var obp = window.obp;
        var $li = $(anchor.parentElement);
        var $ul = $li.parent();
        var item_key = anchor.getAttribute('data-selection');
        $li.remove();
        window.obp.event["target"].trigger(obp.event["events"]["obp:filter-change"]);
    }
    window.obp.search.filter_indices = function() {
        var search_data     = window.obp.search.data;        
        var filter          = window.obp.filter;
        var $list           = $(document.getElementById('search-results-list'));
        var result_indices  = filter.all_filter_indices();
        var mode            = $list.find('.obp-filter-mode:checked').val();

        // TODO: make this search case-insensitive
        var terms = $.map($list.find('a'), function(n,i) {
            return n.getAttribute('data-selection')
        });
        if (terms.length > 0) {
            var list_indices;
            for (var i = 0; i < terms.length; i++) {
                var item_indices = search_data[terms[i]];
                list_indices = list_indices || item_indices;
                if (mode === filter.filter_mode_union) {
                    list_indices = _.union(list_indices,item_indices);
                } else {
                    list_indices = _.intersection(list_indices,item_indices);
                }
            }
            result_indices = _.intersection(result_indices, item_indices);
        }
        return result_indices;
    }
    window.obp.search.highlight_items = function() {
        var $list = $(document.getElementById('search-results-list'));
        var terms = $.map($list.find('a'), function(n,i) {
            return n.getAttribute('data-selection')
        });
        return { "term" : terms };
    }
})();
