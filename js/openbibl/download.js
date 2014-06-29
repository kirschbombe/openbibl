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
          , xml_uri = URI(obpstate.bibliographies.xml)
          , state_clone = $.extend({}, obpstate)
          , config_clone = $.extend({}, obpconfig)
          , text, blob, filename, update_path;

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

        // remove the XML/XSL loader script
        $clone.find('#obp-load-script').remove();

        // make all @src and @rel values absolute
        var update_path = function($elt,att) {
            var src = URI($elt.attr(att));
            if (src.is('relative')) {
                src = src.absoluteTo(xml_uri);
            }
            $elt.attr(att, src.toString());
        };
        $clone.find('*[src]'      ).each(function(i,elt) { update_path($(elt), 'src'       ) });
        $clone.find('*[data-main]').each(function(i,elt) { update_path($(elt), 'data-main' ) });
        $clone.find('*[href]'     ).each(function(i,elt) { update_path($(elt), 'href'      ) });

        // this flag is false for a serialize HTML document
        state_clone.bibliographies.xsl_load = false;

        // serialize application state and configuration data
        // TODO externalize, possibly using template
        text = '//<![CDATA[                                         \n\
require.config({                                                    \n\
    paths : {                                                       \n\
          "obp"       : "openbibl/obp"                              \n\
        , "obpconfig" : "openbibl/config"                           \n\
        , "obpstate"  : "openbibl/state"                            \n\
    }                                                               \n\
});                                                                 \n\
require(["obpconfig","obpstate"], function(obpconfig,obpstate) {    \n\
    obpstate.rebase(' + state_clone.stringify() + ');               \n\
    obpconfig.rebase(' + config_clone.stringify() + ',true);        \n\
});                                                                 \n\
var saxonLoaded = false                                             \n\
  , onSaxonLoad = function() { saxonLoaded = true; };               \n\
require(["obp","obpstate"], function(obp,obpstate) {                \n\
    obp.init(                                                       \n\
        function() { return saxonLoaded }                           \n\
    );                                                              \n\
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
