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
         *
         */
        init : function(sources) {
            var highlight = this;
            highlight.sources = sources;
            obpev.subscribe("obp:filter-complete", highlight.id, function() {
                highlight.highlight_filter_items();
                // TODO: work out the uncollapse/recollapse logic
                highlight.unhide_filter_items();
            });
            obpev.subscribe("obp:filter-start", highlight.id, function() {
                highlight.hide_filter_items();
                highlight.unhighlight_filter_items();
            });
        },
        /**
         *
         */
        match_attr_name : 'data-match',
        match_class : 'obp-match',
        match_attr_preproc : function(str) {
            return str.toUpperCase().trim();
        },
        /**
         *
         */
        hide_filter_items : function() {
            /*jslint unparam: true */
            $('.obp-match').each(function(i,elt){
                $(elt).closest('.panel-collapse:not(.collapse)').addClass('collapse');
                $(elt).closest('.panel.panel-default').find('.accordion-toggle').addClass('collapsed');
            });
        },
        /**
         *
         */
        unhide_filter_items : function() {
            /*jslint unparam: true */
            $('.obp-match:hidden').each(function(i,elt){
                $(elt).closest('.panel.panel-default').find('.accordion-toggle.collapsed').removeClass('collapsed');
                $(elt).closest('.panel-collapse.collapse').removeClass('collapse');
            });
        },
        /**
         *
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
         *
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
         * @todo parameterize whole-word, case-insensitive search
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
         *
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
