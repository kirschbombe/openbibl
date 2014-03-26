(function() {
"use strict";
    window.obp.download.init = function() {
        $('.obp-download-page').click(function(event) {
            window.obp.download.download();
        });
    }
    window.obp.download.download = function() {
        // remove Download link from page
        $(document.getElementsByClassName('obp-download-page')).closest('li').remove();
        // remove Saxon/XSLT code, which is used only for xml->html convesion
        $(document.getElementById('Saxonce'))[0].remove();
        $(document.getElementById('obp-saxonce-lib'))[0].remove();
        $(document.getElementById('obp-saxonce-onload'))[0].remove();
        $(document.getElementById('obp-saxonce-nocache'))[0].remove();
        $('script').each(function(i,elt){
            if (elt.text.match(/saxon/i))
                $(elt).remove();
        })
        // serialize application state, for search/browse
        var state = document.createElement('script');
        var text = 'window.obp.bibliographies=' + JSON.stringify(window.obp.bibliographies);
        state.appendChild(document.createTextNode(text));
        $('body').append(state);
        // have browser download/save to file
        var blob = new Blob([document.documentElement.innerHTML], {type: "text/html;charset=utf-8"});
        var filename = document.title + '.html';
        saveAs(blob, filename);
    }
})();
