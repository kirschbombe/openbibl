define(
  [ 'module', 'obpconfig', 'jquery', 'obpev' ]
, function(module,obpconfig,$,obpev) {
    return {
          id : module.id
        , init : function(sources) {
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
        }
        , match_attr_name : 'data-match'
        , match_class : 'obp-match'
        , match_attr_preproc : function(str) {
            return str.toUpperCase().trim()
        }
        , hide_filter_items : function() {
            $('.obp-match').each(function(i,elt){
                $(elt).closest('.panel-collapse:not(.collapse)').addClass('collapse');
                $(elt).closest('.panel.panel-default').find('.accordion-toggle').addClass('collapsed');
            });
        }
        , unhide_filter_items : function() {
            $('.obp-match:hidden').each(function(i,elt){
                $(elt).closest('.panel.panel-default').find('.accordion-toggle.collapsed').removeClass('collapsed');
                $(elt).closest('.panel-collapse.collapse').removeClass('collapse');
            });
        }
        , highlight_filter_items : function() {
            var i;
            var  items = { element: [], term: [] };
            for (var i = 0; i < this.sources.length; i++) {
                var result = this.sources[i].highlight_items();
                for (var k in result) {
                    items[k] = items[k].concat(result[k]);
                }
            }
            for (i = 0; i < items["element"].length; i++) {
                this.highlight_elt(items["element"][i]);
            }
            for (i = 0; i < items["term"].length; i++) {
                this.highlight_term(items["term"][i]);
            }
        }
        , highlight_elt : function(selector) {
            var highlight = this;
            // simply adding a class is insufficient (at least in Chrome)
            // for having the match color applied, so insert a child
            // <span> element
            $(selector).map(function(i,elt) {
                var $elt = $(elt);
                var span = document.createElement('span');
                span.appendChild(document.createTextNode($elt.text()));
                $(span).addClass(highlight.match_class);
                $elt.text('');
                $elt.append(span);
            });
        }
        , highlight_term : function(term) {
            var highlighter = this;
            // TODO: parameterize whole-word, case-insensitive
            var re = new RegExp('\\b' + term + '\\b','i');
            $('#bibliographies').find('*').contents().filter(function() {
                return this.nodeType === 3 // Node.TEXT_NODE
                       && this.textContent.match(re)
            }).map(function() {
                var match;
                while(match = re.exec(this.textContent)) {
                    var span = document.createElement('span');
                    span.appendChild(document.createTextNode(match[0]));
                    span.setAttribute(
                        'class',
                        highlighter.match_class
                    );
                    span.setAttribute(
                        highlighter.match_attr_name,
                        highlighter.match_attr_preproc(term)
                    );
                    var node_after = this.splitText(match.index);
                    node_after.textContent = node_after.textContent.substr(match[0].length);
                    this.parentNode.insertBefore(this,node_after);
                    this.parentNode.insertBefore(span,node_after);
                }
            });
        }
        , unhighlight_filter_items : function() {
            var highlight = this;
            $('#bibliographies').find('.'  + highlight.match_class).map(function() {
                var text = this.textContent || this.innerText;
                var text_node = document.createTextNode(text);
                this.parentNode.replaceChild(text_node,this);
            });
        }
    }
});
