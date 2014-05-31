/*
* Openbibl Framework v0.1.0
* Copyright 2014, Dawn Childress
* Contact: https://github.com/kirschbombe/openbibl
* License: GNU AGPL v3 (https://github.com/kirschbombe/openbibl/LICENSE)
*/
/*jslint white: true, todo: true, nomen: true */
/*global define: true */
/**
 * Openbibl XML file querying object.
 *
 * @module openbibl/query
 */
define(
  [ 'obpconfig', 'obpstate', 'jquery', 'saxon' ]
, function(obpconfig,obpstate,$,saxon) {
    'use strict';
    return {
        /**
         *
         */
        subscribers : [],
        /**
         *
         */
        request_query_data : function(file) {
            /*jslint unparam: true*/
            var query = this;
            $.ajax({
                "url":      file
                , "async":    true
                , "type":     "GET"
                , "dataType": "json"
                , "success":  function(data) {
                    obpstate.query.data = data;
                    query.notify_subscribers();
                 }
                 , "error" : function(jqXHR, textStatus, errorThrown) {
                    query.request_saxon_query();
                }
            });
        },
        /**
         *
         */
        notify_subscribers : function() {
            var subscribers = this.subscribers || [];
            subscribers.map(function(subscriber){
                subscriber.handle_query_data();
            });
        },
        /**
         *
         */
        request_saxon_query : function() {
            var query = this
               , json;
            saxon.requestQueryTransform(
                  obpconfig.paths.query_xsl
                , obpstate.bibliographies.xml
                , []
                , function(data) {
                    try {
                        json = JSON.parse(data.getResultDocument().textContent);
                        obpstate.query.data = json;
                        query.notify_subscribers();
                    } catch (e) {
                        console.log('Failure to generate query data: ' + e.toString());
                    }
                }
            );
        }
    };
});
