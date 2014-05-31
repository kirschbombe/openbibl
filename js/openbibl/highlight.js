/*
* Openbibl Framework v0.1.0
* Copyright 2014, Dawn Childress
* Contact: https://github.com/kirschbombe/openbibl
* License: GNU AGPL v3 (https://github.com/kirschbombe/openbibl/LICENSE)
*/
/*jslint white: true, todo: true, nomen: true, plusplus: true */
/*global define: true, document: true */
/**
 * Openbibl search term and browse item highlighter.
 *
 * @module openbibl/highlight
 */
define(
  [ 'jquery', 'obpev' ]
, function($,obpev) {
    'use strict';
    return {
        /**
         * Register highlight module with Openbibl application events.
         * @todo work out the uncollapse/recollapse logic (see reported issue)
         * @method
         * @public
         * @instance
         */
        init : function(sources) {
            var highlight = this;
            highlight.sources = sources;
            obpev.subscribe("obp:bibliography-added", highlight.id, function() {
                highlight.unhighlight_filter_items();
                highlight.highlight_filter_items();
                highlight.unhide_filter_items();
            });
        },
        /**
         * Attribute name for for a <span> representing a highlighted match.
         * @property
         * @constant
         */
        match_attr_name : 'data-match',
        /**
         * Class name for a span representing a highlighted match.
         * @property
         * @constant
         */
        match_class : 'obp-match',
        /**
         * Preprocessor for the value of a @data-match attribute value.
         * @method
         * @private
         * @instance
         */
        match_attr_preproc : function(str) {
            return str.toUpperCase().trim();
        },
        /**
         * Method to display a highlighted item that is in a collapsed Bootstrap panel.
         * @todo correct display and uncollapse behavior, which is inconsistent.
         * @method
         * @private
         * @instance
         */
        hide_filter_items : function() {
            /*jslint unparam: true */
            $('.obp-match').each(function(i,elt){
                $(elt).closest('.panel-collapse:not(.collapse)').addClass('collapse');
                $(elt).closest('.panel.panel-default').find('.accordion-toggle').addClass('collapsed');
            });
        },
        /**
         * Method to hide a highlighted item (collapse an encolsing Bootstrap panel).
         * @todo correct display and collapse behavior, which is inconsistent
         * @method
         * @private
         * @instance
         */
        unhide_filter_items : function() {
            /*jslint unparam: true */
            $('.obp-match:hidden').each(function(i,elt){
                $(elt).closest('.panel.panel-default').find('.accordion-toggle.collapsed').removeClass('collapsed');
                $(elt).closest('.panel-collapse.collapse').removeClass('collapse');
            });
        },
        /**
         * Method to collect items to be highlighted from subscribed objects (i.e., browse
         * and search controllers).
         * @method
         * @public
         * @instance
         */
        highlight_filter_items : function() {
            var items = { element: [], term: [] }
              , i, result;
            this.sources.forEach(function(source){
                result = source.highlight_items();
                Object.keys(result).map(function(k){
                    items[k] = items[k].concat(result[k]);
                });
            });
            for (i = 0; i < items.element.length; i++) {
                this.highlight_elt(items.element[i]);
            }
            for (i = 0; i < items.term.length; i++) {
                this.highlight_term(items.term[i]);
            }
        },
        /**
         * Highlight an element (<span>).
         * @param {string} jQuery selector pattern for matching
         * @method
         * @private
         * @instance
         */
        highlight_elt : function(selector) {
            /*jslint unparam: true */
            var highlight = this
               , $elt, span;
            // simply adding a class is insufficient (at least in Chrome)
            // for having the match color applied, so insert a child
            // <span> element
            $(selector).map(function(i,elt) {
                $elt = $(elt);
                span = document.createElement('span');
                span.appendChild(document.createTextNode($elt.text()));
                $(span).addClass(highlight.match_class);
                $elt.text('');
                $elt.append(span);
            });
        },
        /**
         * Highlight a term.
         * @param {string} term to highlight
         * @todo parameterize whole-word, case-insensitive search
         * @method
         * @private
         * @instance
         */
        highlight_term : function(term) {
            var highlighter = this
              , re = new RegExp('\\b' + term + '\\b','i')
              , match, span, node_after;
            $('#bibliographies').find('*').contents().filter(function() {
                return this.nodeType === 3 // Node.TEXT_NODE
                    && this.textContent.match(re);
            }).map(function() {
                match = re.exec(this.textContent);
                while(match) {
                    span = document.createElement('span');
                    span.appendChild(document.createTextNode(match[0]));
                    span.setAttribute(
                        'class',
                        highlighter.match_class
                    );
                    span.setAttribute(
                        highlighter.match_attr_name,
                        highlighter.match_attr_preproc(term)
                    );
                    node_after = this.splitText(match.index);
                    node_after.textContent = node_after.textContent.substr(match[0].length);
                    this.parentNode.insertBefore(this,node_after);
                    this.parentNode.insertBefore(span,node_after);
                    // next loop
                    match = re.exec(this.textContent);
                }
            });
        },
        /**
         * Remove highlighting from all currently highlighted terms.
         * @method
         * @private
         * @instance
         */
        unhighlight_filter_items : function() {
            var highlight = this
              , text, text_node;
            $('#bibliographies').find('.'  + highlight.match_class).map(function() {
                text = this.textContent || this.innerText;
                text_node = document.createTextNode(text);
                this.parentNode.replaceChild(text_node,this);
            });
        }
    };
});
