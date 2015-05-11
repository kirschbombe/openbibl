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
        init : function(options) {
            if (options.subscribers instanceof Array) {
                this.subscribers = options.subscribers;
            } else if (typeof options.subscribers === 'string') {
                this.subscribers = [options.subscribers];
            } else {
                this.subscribers = [];
            }
            // have data for browse/search functionality fetched/generated
            // TODO: evaluate whether this data should be stored globally
            // since it can be weighty
            this.request_query_data();
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
         * @todo notify user about failure to receive data
         * @method
         * @public
         * @instance
         */
        request_query_data : function() {
            /*jslint unparam: true*/
            var query = this;
            $.ajax({
                  "url":      obpconfig.query.file
                , "async":    obpconfig.async
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
        request_saxon_query : function() {
            var query = this
               , json;
            saxon.requestTransform({
                  method : 'transformToFragment'
                , stylesheet : obpconfig.path('query_xsl')
                , source : obpstate.bibliographies.xml
                , success : function(data) {
                    try {
                        json = JSON.parse(data.getResultDocument().textContent);
                        obpstate.query.data = json;
                        query.notify_subscribers();
                    } catch (e) {
                        console.log('Failure to generate query data: ' + e.toString());
                    }
                }
            });
        }
    };
});
