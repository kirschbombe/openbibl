
define(
  [ 'module', 'jquery', 'domReady', 'obpev', 'obpconfig' ]
, function(module,$,domReady,obpev,obpconfig) {
    domReady(function() {
        module.exports.enable_click();
    });
    obpev.subscribe("obp:filter-complete", module.id, function() {
        module.exports.update_toc();
        module.exports.enable_click();
    });
    obpev.subscribe("obp:bibliography-added", module.id, function() {
        module.exports.update_toc();
        module.exports.enable_click();
    });
    module.exports.enable_click = function() {
        $('a.toc-click').click(function(e) {
            var $target = $('div[data-src-index="' + $(e.target).attr('data-src-index') + '"]'); 
            if ($target.length === 0) return;
            $('html,body').animate({
                scrollTop: ($target.offset().top - $('#bibliographies').offset().top)
                }, obpconfig.scroll_speed
            );
        });
    };
    module.exports.update_toc = function () {
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
});
