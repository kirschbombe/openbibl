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
          , text, blob, filename;

        // remove Download link from page
        $clone.find('.obp-download-page').closest('li').remove();

        // remove GWT elements for Saxon load
        $clone.find('#Saxonce').remove();
        $clone.find('script[defer="defer"]').each(function(i,elt){
            if (elt.text.match(/Saxonce\.onInjectionDone/)) {
                $(elt).remove();
            }
        });

        // remove script tags injected by require-js
        $clone.find('script[data-requiremodule]').remove();

        // remove Bootstrap Tooltip attributes
        $clone.find('[data-toggle="tooltip"')
            .removeAttr('data-original-title')
            .removeAttr('title');

        // serialize application state and configuration data
        // TODO externalize, possibly using template
        text = '//<![CDATA[                                         \n\
require.config({                                                    \n\
    paths : {                                                       \n\
          "obpconfig" : "openbibl/config"                           \n\
        , "obpstate"  : "openbibl/state"                            \n\
    }                                                               \n\
});                                                                 \n\
require(["obpconfig","obpstate"], function(obpconfig,obpstate) {    \n\
    obpstate.rebase(' + obpstate.stringify() + ');                  \n\
    obpconfig.rebase(' + obpconfig.stringify() + ',true);           \n\
});                                                                 \n\
//]]>                                                               \n\
';
        $state_script.text(text);
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
