define(
  [ 'module', 'obpconfig', 'jquery', 'obpev' ]
, function(module,obpconfig,$,obpev) {
    obpev.subscribe("obp:filter-complete", module.id, function() {
        module.exports.sort_entries(module.exports.current_sort_key);
    });
    $('.obp-sort-input').on('click', function(e) {
        module.exports.sort_entries(e.target.getAttribute('data-sort-key'));
        $(this).closest('.obp-menu-li').find('a[data-toggle]').click();
    });    
    module.exports.sort_key_default = 'data-src-index';
    module.exports.current_sort_key = null;
    module.exports.sort_entries = function (key) {
        if (key === undefined || key === null) { key = module.exports.sort_key_default }
        module.exports.current_sort_key = key;
        var $wrapper = $('#bibliographies');
        var $entries = $wrapper.children('div.entry').remove();
        $entries.sort(function(a,b) {
            return (a.getAttribute(key)||"").localeCompare(
                    (b.getAttribute(key)||"")
                );
        });
        $wrapper.append($entries);
        obpev.raise("obp:bibliography-added", module.id);
    }
});
