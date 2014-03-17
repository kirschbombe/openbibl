(function() {
"use strict";
    window.obp.highlight.match_attr_name = 'data-match';
    window.obp.highlight.match_class = 'obp-match';
    window.obp.highlight.match_attr_preproc = function(str) {
        return str.toUpperCase().trim()
    }
    window.obp.highlight.highlight_term = function(term) {
        var highlighter = window.obp.highlight;
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
    window.obp.highlight.unhighlight_term = function(term) {
        var highlighter = window.obp.highlight;
        var selector = 
              'span[' 
            + highlighter.match_attr_name 
            + '="' 
            + highlighter.match_attr_preproc(term)
            + '"]';
        $('#bibliographies').find(selector).map(function() {
            var text = this.textContent || this.innerText;
            var text_node = document.createTextNode(text);
            this.parentNode.replaceChild(text_node,this);
        });
    }
})();
