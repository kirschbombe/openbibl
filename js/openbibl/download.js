define(
[ 'module', 'jquery', 'filesaver' ]
, function(module, $, filesaver) {
    $('.obp-download-page').click(function(event) {
        // this require has to be done explicitly here for some reason
        // (circular dependency?) rather than by dependency injection
        var obpstate = require('obpstate');
        var obpconfig = require('obpconfig');

        var $clone = $(document.cloneNode(true));

        // remove Download link from page
        $clone.find('.obp-download-page').closest('li').remove();

        // remove Saxon/XSLT code, which is used only for xml->html convesion
        $clone.find('#Saxonce').remove();
        $clone.find('#obp-saxonce-onload').remove();
        $clone.find('#obp-saxonce-nocache').remove();
        $clone.find('script').each(function(i,elt){
            if (elt.text.match(/saxon/i))
                $(elt).remove();
        })
        // remove scripts loaded by require-js
        $clone.find('script[data-requiremodule]').remove();

        // serialize application state, for search/browse
        var $state_script = $('<script></script>');

        var text = 'window.obp=' + JSON.stringify(window.obp) + ';';
        $state_script.append(text);

        // save off window.obp.bibliographies data
        text = 'window.obp.obpstate=' + obpstate.stringify() + ';';
        $state_script.append(text);

        // save off window.obp.config data
        text = 'window.obp.obpconfig=' + obpconfig.stringify() + ';';
        $state_script.append(text);

        $clone.find('body').append($state_script);
        // have browser download/save to file
        var blob = new Blob([$clone[0].documentElement.outerHTML], {type: "text/html;charset=utf-8"});
        var filename = obpstate.bibliographies.xml.replace(/#.*$/,'').replace(/.*?([^/\\]+)$/,'$1').replace(/xml$/, 'html');
        filesaver(blob, filename);
    });
});

