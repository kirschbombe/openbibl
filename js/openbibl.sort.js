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
        var $entries = $wrapper.children('div.entry').remove();
        $entries.sort(function(a,b) {
            return (a.getAttribute(key)||"").localeCompare(
                    (b.getAttribute(key)||"")
                );
        });
        $wrapper.append($entries);
        var src_sequence = $.map($wrapper.children('div.entry'), function(elt) {
            return $(elt).attr('data-src-index');
        });
        var $toc = $('#toc');
        var $toc_entries = $toc.children('li.toc').remove();
        $toc_entries.sort(function(a,b){
            var aInd = src_sequence.indexOf(a.getAttribute('data-src-index'))
            var bInd = src_sequence.indexOf(b.getAttribute('data-src-index'));
            return aInd < bInd
                ? -1
                : aInd === bInd
                    ? 0
                    : 1;
        });
        $toc.append($toc_entries);
        window.obp.event["target"].trigger(obp.event["events"]["obp:bibliography-added"]);
    }
})();
