define(
  [ 'module', 'jquery', 'obpev' ]
, function(module,$,obpev) {
    obpev.subscribe("obp:bibliography-added", module.id, function() {
        module.exports.enable_tooltips();
    });
    obpev.subscribe("obp:filter-complete", module.id, function() {
        module.exports.enable_tooltips();
    });
   module.exports.enable_tooltips = function() {
        $('[data-toggle="tooltip"]').click(function(e){
            e.preventDefault();
        });
        $('[data-toggle="tooltip"]').tooltip({
              placement : "top"
            , trigger   : "hover"
        });
    };
});
