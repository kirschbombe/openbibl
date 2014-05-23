define(
[ 'module', 'jquery', 'obpev', './model' ]
, function(module, $, obpev, model) {
    obpev.subscribe("obp:browse-term-change", module.id, function() {
        module.exports.browse_term_change();
    });
    module.exports.browse_term_change = function() {
        var browse = window.obp.browse;
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
});