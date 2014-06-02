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
         * Initialize querier.
         * @param {array} subscribers consumers of queried data
         * @method
         * @public
         * @instance
         */
        init : function(subscribers) {
            if (subscribers instanceof Array) {
                this.subscribers = subscribers;
            } else if (typeof subscribers === 'string') {
                this.subscribers = [subscribers];
            } else {
                this.subscribers = [];
            }
        },
        /**
         * Subscribers of queried data.
         * @property
         * @private
         */
        subscribers : [],
        /**
         * Method to retrieve "query data", the json produced for the
         * browse/search functionality. Performs AJAX request for given file,
         * and on failure has the Saxon-CE processor generate the data.
         * @param {string} file to test
         * @param cb {function} callback to handle data
         * @todo notify user about failure to receive data
         * @method
         * @public
         * @instance
         */
        request_query_data : function(file, cb) {
            /*jslint unparam: true*/
            var query = this;
            $.ajax({
                "url":      file
                , "async":    obpconfig.async
                , "type":     "GET"
                , "dataType": "json"
                , "success":  function(data) {
                    cb(data);
                    query.notify_subscribers();
                 }
                 , "error" : function(jqXHR, textStatus, errorThrown) {
                    query.request_saxon_query(cb);
                }
            });
        },
        /**
         * Method to notify consumers of this object's retrieved
         * data that that data is available.
         * @method
         * @private
         * @instance
         */
        notify_subscribers : function() {
            var subscribers = this.subscribers || [];
            subscribers.map(function(subscriber){
                subscriber.handle_query_data();
            });
        },
        /**
         * Fallback to AJAX retrieval of a browse/search datafile. Calls
         * to Saxon XSLT processor to produce data for browse/search functionality.
         * @method
         * @private
         * @instance
         */
        request_saxon_query : function(cb) {
            var query = this
               , json;
            saxon.requestQueryTransform(
                  obpconfig.paths.query_xsl
                , obpstate.bibliographies.xml
                , []
                , function(data) {
                    try {
                        json = JSON.parse(data.getResultDocument().textContent);
                        cb(json);
                        query.notify_subscribers();
                    } catch (e) {
                        console.log('Failure to generate query data: ' + e.toString());
                    }
                }
            );
        }
    };
});
