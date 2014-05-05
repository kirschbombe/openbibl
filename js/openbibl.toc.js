(function() {
"use strict";
    window.obp.toc.init = function() {
        window.obp.toc.enable_click();
        window.obp.event["target"].on(obp.event["events"]["obp:filter-complete"], function() {
            window.obp.toc.update_toc();
            window.obp.toc.enable_click();
        });
        window.obp.event["target"].on(obp.event["events"]["obp:bibliography-added"], function() {
            window.obp.toc.update_toc();
            window.obp.toc.enable_click();
        });
    }
    window.obp.toc.enable_click = function() {
        $('a.toc-click').click(function(e) {
            var offset = $('div[data-src-index="' + $(e.target).attr('data-src-index') + '"]').offset().top
                       - $('#bibliographies').offset().top
            $('html body').animate({
                scrollTop: offset
                }, window.obp.config['scroll_speed']
            );
        });
    };
    window.obp.toc.update_toc = function () {
        var $wrapper = $('#bibliographies');
        var src_sequence = $.map($wrapper.children('div.entry:visible'), function(elt) {
            return $(elt).attr('data-src-index');
        });
        var $toc = $('#toc');
        var $toc_entries = $toc.children('li.toc').remove();
        $toc_entries.sort(function(a,b){
            var aInd = src_sequence.indexOf(a.getAttribute('data-src-index')) || -1;
            var bInd = src_sequence.indexOf(b.getAttribute('data-src-index')) || -1;
            return aInd < bInd
                ? -1
                : aInd === bInd
                    ? 0
                    : 1;
        });
        $toc_entries.each(function(i,elt){
            $(elt).show();
            if (src_sequence.indexOf(elt.getAttribute('data-src-index')) === -1) {
                $(elt).hide();
            }
        });
        $toc.append($toc_entries);
    }
})();
