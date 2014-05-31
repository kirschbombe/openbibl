/*
* Openbibl Framework v0.1.0
* Copyright 2014, Dawn Childress
* Contact: https://github.com/kirschbombe/openbibl
* License: GNU AGPL v3 (https://github.com/kirschbombe/openbibl/LICENSE)
*/
/*jslint white: true, todo: true, nomen: true, unparam: true, regexp: true */
/*global define: true, window: true, document: true, Blob: true */
/**
 * Downlad-as-HTML functionality.
 *
 * Document rendered in the browser is serialized as HTML. This allows the XML->HTML
 * transformation step to be avoided if the downloaded HTML file is served. Configuration
 * and state data are serialized as JSON in the HTML file to keep file
 * references accurate and to maintain any generated data.
 *
 * @module openbibl/download
 */
define(
[ 'module', 'jquery', 'filesaver' ]
, function(module, $, filesaver) {
    'use strict';
    /**
     * Function called by click handler for the "Download" button.
     * @method
     * @private
     * @inner
     */
    var download_file = function() {
        // this require has to be done explicitly here for some reason
        // (circular dependency?) rather than by dependency injection
        var obpstate = require('obpstate')
          , obpconfig = require('obpconfig')
          , $clone = $(document.cloneNode(true))
          , $state_script = $('<script></script>')
          , text, blob, filename, obp_global;

        // remove Download link from page
        $clone.find('.obp-download-page').closest('li').remove();

        // remove Saxon/XSLT code, which is used only for xml->html convesion
        $clone.find('#Saxonce').remove();
        $clone.find('#obp-saxonce-onload').remove();
        $clone.find('#obp-saxonce-nocache').remove();
        $clone.find('script').each(function(i,elt){
            if (elt.text.match(/saxon/i)) {
                $(elt).remove();
            }
        });

        // set this global flag for js loading in html
        obp_global = window.obp;
        obp_global.xsl_load = false;

        // remove script tags injected by require-js
        $clone.find('script[data-requiremodule]').remove();

        // serialize application state and configuration data
        text = 'window.obp='           + JSON.stringify(obp_global) + ';\n'
             + 'window.obp.obpstate='  + obpstate.stringify()       + ';\n'
             + 'window.obp.obpconfig=' + obpconfig.stringify()      + ';\n';
        $state_script.append(text);
        $clone.find('body').append($state_script);

        // have browser download/save to file
        blob = new Blob([$clone[0].documentElement.outerHTML], {type: "text/html;charset=utf-8"});
        filename = obpstate.bibliographies.xml
                 .replace(/#.*$/,'')                // remove any hashbangs
                 .replace(/.*?([^\/\\]+)$/,'$1');   // capture file name w/o path
        if (filename.match(/xml$/)) {
            filename = filename.replace(/xml$/, 'html');
        } else {
            filename = filename + '.html';
        }
        filesaver(blob, filename);
    };
    $('.obp-download-page').click(function(event) {
        download_file();
    });
});
