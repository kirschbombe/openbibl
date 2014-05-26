define(
[ 'module', 'jquery', 'filesaver' ]
, function(module, $, filesaver) {
    $('.obp-download-page').click(function(event) {
        // this require has to be done explicitly here for some reason
        // (circular dependency?) rather than by dependency injection
        var obpstate = require('obpstate');
        var obpconfig = require('obpconfig');
        // remove Download link from page
        $(document.getElementsByClassName('obp-download-page')).closest('li').remove();
        // remove Saxon/XSLT code, which is used only for xml->html convesion
        $(document.getElementById('Saxonce'))[0].remove();
        $(document.getElementById('obp-saxonce-onload'))[0].remove();
        $(document.getElementById('obp-saxonce-nocache'))[0].remove();
        $('script').each(function(i,elt){
            if (elt.text.match(/saxon/i))
                $(elt).remove();
        })
        // remove scripts loaded by require-js
        $('script[data-requiremodule]').remove();
        
        // serialize application state, for search/browse
        var state_script = document.createElement('script');

        var text = 'window.obp=' + JSON.stringify(window.obp) + ';';
        state_script.appendChild(document.createTextNode(text));

        // save off window.obp.bibliographies data
        text = 'window.obp.obpstate=' + JSON.stringify(obpstate) + ';';
        state_script.appendChild(document.createTextNode(text));
        
        // save off window.obp.config data
        text = 'window.obp.obpconfig=' + JSON.stringify(obpconfig) + ';';
        state_script.appendChild(document.createTextNode(text));

        $('body').append(state_script);
        // have browser download/save to file
        var blob = new Blob([document.documentElement.outerHTML], {type: "text/html;charset=utf-8"});
        var filename = obpstate.bibliographies.xml.replace(/#.*$/,'').replace(/.*?([^/\\]+)$/,'$1').replace(/xml$/, 'html');
        filesaver(blob, filename);
    });
});

