(function() {
"use strict";
    window.obp.sort.init = function() {
        window.obp.event["target"].on(obp.event["events"]["obp:filter-complete"], function() {
            // for an filter-event-driven call to sort, use the 
            // current sort key
            window.obp.sort.sort_entries(window.obp.sort.current_sort_key);
        });
    }
    window.obp.sort.sort_key_default = 'data-src-index';
    window.obp.sort.current_sort_key = null;
    window.obp.sort.sort_entries = function (key) {
        if (key === undefined || key === null) { key = this.sort_key_default }
        this.current_sort_key = key;
        var $wrapper = $('#bibliographies');
        var $sorted_entries = $wrapper.find('div.entry').sort(function(a,b) {
            var a_val = a.getAttribute(key);
            var b_val = b.getAttribute(key); 
            return a_val > b_val ? 1 :
                   a_val = b_val ? 0 :
                                  -1 ;
        });
        $sorted_entries.appendTo($wrapper);
    }
})();
