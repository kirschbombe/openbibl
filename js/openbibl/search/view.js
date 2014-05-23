
define(
  [ 'module', 'obpconfig', 'jquery', 'obpev', 'search', 'domReady', 'typeahead', 'underscore', './model' ]
, function(module,obpconfig,$,obpev,search,domReady,typeahead,_,model) {
    var search;
    return {
        // NB: the 'search' reference passed in by define() is undefined
        init : function(s) {
            search = s;
            var view = this;
            obpev.subscribe("obp:search-term-change", module.id, function() {
                view.search_change();
            });
            domReady(function() {
                view.retrieve_templates();
                $('.search-input').typeahead({
                      "items"   : obpconfig.typeahead.list_len
                    , "matcher" : view.matcher
                    , "source"  : view.source
                    , "updater" : view.updater
                });
            });           
        } 
        , compiled_templates : {
            'search.term-li.handlebars': null   // string -> function
        }
        , retrieve_templates : function() {
            var templates = Object.keys(this.compiled_templates);
            for (var i = 0; i < templates.length; i++) {
                this.retrieve_template(templates[i]);
            }
        }
        , retrieve_template : function(template) {
            var view = this;
            if (obpconfig.templates[template] === undefined) {
                var path = obpconfig['paths']['template_dir'] + '/' + template;
                $.ajax({
                    url:        path,
                    cache:      true,
                    success:    function(data) {
                        obpconfig.templates[template] = data;
                        view.compiled_templates[template] = _.template(data);
                    },
                    error : function(jqXHR, textStatus, errorThrown) {
                        if (obpconfig.debug) obpconfig.console.log(
                            "Seach-template AJAX error for template '"
                            + template + "': " + textStatus 
                        );
                    }
                });
           } else {
                view.compiled_templates[template] = _.template(obpconfig.templates[template]);
            }
        }
        , source : function() {
            return _.without(
                Object.keys(model.document_data),
                search.active_search_terms
            );
        }
        , matcher : function(item) {
            return new RegExp("^" + this.query, "i").test(item);
        }
        , updater : function(selection) {
            $('.typeahead').val('');
            search.add_term(selection);
        }
        , search_change : function() {
            var active_search_terms = search.active_search_terms();
            $('.' + search.term_list_item_class ).parent().remove();
            var search_rows = [];
            for (var i = 0; i < active_search_terms.length; i++) {
                var new_row = this.compiled_templates['search.term-li.handlebars']({
                    "cls"   : search.term_list_item_class,
                    "term"  : active_search_terms[i]
                });
                search_rows.push(new_row);
            }
            if (search_rows.length > 0) {
                $('.obp-search-results-list').each(function(i,elt){
                    var $tbody = $(elt);
                    $tbody.append(search_rows);
                });
                $('.' + search.term_list_item_class).click(function(e) {
                    var term = e.target.parentElement.getAttribute('data-selection');
                    if (term) search.remove_terms([term]);
                });
            }
        }
    }
});
