(function() {
"use strict";
    // TODO: parameterize
    window.obp.search.typeahead_list_len = 20;
    window.obp.search.init = function() {
        this.view.init();
        // set focus for search <input> when made visible
        $('.obp-search-panel').bind('shown.bs.collapse', function() {
            $(this).find('.obp-search-panel-input').focus();
        });
        $('.obp-search-form').on('submit', function(event) {
            // prevent the search field from causing a page
            // reload when a typeahead suggestion is unavailable
            event.preventDefault();
        });
        $('.obp-search-clear').click(function(event){
            // TODO: handle this better
            var search_terms = $(event.target.parentElement.parentElement).find('a.obp-search-item').map(function(elt){
                return this.getAttribute('data-selection');
            });
            window.obp.search.model.remove_terms(search_terms);
            event.preventDefault();
        });
    }
    window.obp.search.term_list_item_class = 'obp-search-item';
    window.obp.search.filter_indices = function() {
        return this.model.filter_indices();
    }
    window.obp.search.highlight_items = function() {
        return this.model.highlight_items();
    }
    window.obp.search.handle_query_data = function(data) {
        this.model.handle_query_data(data);
    }
    window.obp.search.remove_terms = function(terms) {
        window.obp.search.model.remove_terms(terms);
    }
    window.obp.search.filter_mode_change = function(event) {
        window.obp.search.model.filter_mode_change(event);
    }

    // view for search terms -------------------------------------------------------
    window.obp.search.view  = {};
    window.obp.search.view.init = function() {
        var search = window.obp.search;
        this.retrieve_templates();
        // typeahead
        $('.search-input').typeahead({
            "items":   search.typeahead_list_len,
            "matcher": search.view.matcher,
            "source":  search.view.source,
            "updater": search.view.updater
        });
        window.obp.event["target"].on(obp.event["events"]["obp:search-term-change"], function() {
            window.obp.search.view.search_change();
        });
    };
    window.obp.search.view.compiled_templates = {
        'search.term-li.handlebars': null   // string -> function
    }
    window.obp.search.view.retrieve_templates = function() {
        var view = this;
        var templates = Object.keys(view.compiled_templates);
        for (var i = 0; i < templates.length; i++) {
            view.retrieve_template(templates[i]);
        }
    }
    window.obp.search.view.retrieve_template = function(template) {
        var view = this;
        var path = window.obp.config['template_dir'] + '/' + template;
        $.ajax({
            url:        path,
            cache:      true,
            success:    function(data) {
                view.compiled_templates[template] =
                    Handlebars.compile(data);
            },
            error : function(jqXHR, textStatus, errorThrown) {
                if (window.obp.debug) {
                    window.obp.console.log(
                        "Seach-template AJAX error for template '"
                        + template
                        +"': "
                        + textStatus
                    );
                }
            }
        });
    }
    window.obp.search.view.search_change = function() {
        var search = window.obp.search;
        var active_search_terms = search.model.active_search_terms;
        $('.' + search.term_list_item_class ).parent().remove();
        var li = [];
        for (var i = 0; i < search.model.active_search_terms.length; i++) {
            var new_li = search.view.compiled_templates['search.term-li.handlebars']({
                "cls"   : search.term_list_item_class,
                "term"  : active_search_terms[i]
            });
            li.push(new_li);
        }
        if (li.length > 0) {
            $('.obp-search-results-list').each(function(i,elt){
                var $ul = $(elt);
                $ul.append(li);
            });
            $('.' + search.term_list_item_class).click(function(e) {
                var term = e.target.parentElement.getAttribute('data-selection');
                if (term) search.model.remove_terms([term]);
            });
        }
    }
    // return list of valid search terms, filtering out terms already
    // entered
    window.obp.search.view.source = function() {
        var search = window.obp.search;
        return _.without(
            Object.keys(search.model.document_data),
            search.model.active_search_terms
        );
    }
    // TODO: .matcher() here?
    window.obp.search.view.matcher = function(item) {
        return new RegExp("^" + this.query, "i").test(item);
    }
    window.obp.search.view.updater = function(selection) {
        var obp = window.obp;
        $('.typeahead').val('');
        obp.search.model.add_term(selection);
    }

    // model for search terms --------------------------------------------------
    window.obp.search.model = {};
    window.obp.search.model.filter_mode_change = function(event) {
        this.current_search_mode = $(event.target).val();
    }
    window.obp.search.model.document_data = {};
    window.obp.search.model.active_search_terms = [];
    window.obp.search.model.current_search_mode = window.obp.filter.filter_mode_default;
    window.obp.search.model.to_key = function(item) {
        return String(item).toUpperCase();
    }
    window.obp.search.model.handle_query_data = function(data) {
        var search = window.obp.search;
        var i, j;
        var termmap = {};
        var len = data["search"].length;
        var search_data = data["search"];
        for (i = 0; i < len; i+=2) {
            for (j = 0; j < search_data[i].length; j++) {
                termmap[search_data[i][j]] = search_data[i+1];
            }
        }
        search.model.document_data = termmap;
    }
    window.obp.search.model.add_term = function(term) {
        var current_terms = this.active_search_terms || [];
        if (_.indexOf(current_terms,term) !== -1) return;
        current_terms.push(term);
        this.active_search_terms = current_terms;
        window.obp.event["target"].trigger(obp.event["events"]["obp:search-term-change"]);
        window.obp.event["target"].trigger(obp.event["events"]["obp:filter-change"]);
    }

    window.obp.search.model.remove_terms = function(remove_terms) {
        var current_terms = this.active_search_terms || [];
        // TODO: why is toArray() necessary?
        var new_terms = _.difference(_.toArray(current_terms), _.toArray(remove_terms));
        if (new_terms.length === current_terms.length) return;
        this.active_search_terms = new_terms;
        window.obp.event["target"].trigger(obp.event["events"]["obp:search-term-change"]);
        window.obp.event["target"].trigger(obp.event["events"]["obp:filter-change"]);
    }

    window.obp.search.model.filter_indices = function() {
        var filter          = window.obp.filter;
        var search_data     = this.document_data;
        var result_indices  = window.obp.filter.all_filter_indices();
        var mode = this.current_search_mode;

        // TODO: make this search case-insensitive
        var terms = this.active_search_terms;
        if (terms.length > 0) {
            var list_indices;
            for (var i = 0; i < terms.length; i++) {
                var item_indices = search_data[terms[i]];
                list_indices = list_indices || item_indices;
                if (mode === filter.filter_mode_union) {
                    list_indices = _.union(list_indices,item_indices);
                } else {
                    list_indices = _.intersection(list_indices,item_indices);
                }
            }
            result_indices = _.intersection(result_indices, list_indices);
        }
        return result_indices;
    }
    window.obp.search.model.highlight_items = function() {
        return { "term" : this.active_search_terms };
    }
})();
