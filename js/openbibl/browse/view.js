define(
[ 'module', 'jquery', 'obpev', './model' ]
, function(module, $, obpev, model) {
    return {
          init : function() {
            var view = this;
            obpev.subscribe("obp:browse-term-change", module.id, function() {
                view.browse_term_change();
            });
            obpev.subscribe("obp:browse-term-change", module.id, function() {
                view.browse_term_change();
            });
            $('.obp-filter-mode').on('change', function(event) {
                view.filter_mode_change(event);
            });
        }
        , browse_term_change : function() {
            // clear UI checkboxes
            $('.obp-browse-checkbox:checked').map(function(i,elt) {
                elt.checked = false
            });
            // re-sync UI checkboxes with this datamodel
            for ( var i = 0; i < model.browse_lists.length; i++) {
                var list = model.browse_lists[i]["list"];
                var terms = model.browse_lists[i]["terms"] || [];
                for (var j = 0; j < terms.length; j++) {
                    $('.obp-browse-checkbox[data-browse-item="' + terms[j] + '"]').each(function(i,elt){
                        elt.checked = true;
                    });
                }
            }
        }
        , filter_mode_change : function(event) {
            var $this = $(event.target);
            var list_type = $this.closest('.obp-browse-list').attr('data-ed-list');
            if (list_type !== undefined) {
                var browse_mode = $this.val();
                model.filter_mode_change(list_type,browse_mode);
            }
        }
    }
});