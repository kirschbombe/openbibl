(function() {
"use strict";
    window.obp.tooltip.init = function() {
        window.obp.event["target"].on(obp.event["events"]["obp:bibliography-added"], function() {
            window.obp.tooltip.enable_tooltips();
        });
        window.obp.event["target"].on(obp.event["events"]["obp:filter-complete"], function() {
            window.obp.tooltip.enable_tooltips();
        });
    }
    window.obp.tooltip.enable_tooltips = function() {
        $('[data-toggle="tooltip"]').click(function(e){
            e.preventDefault();
        });
        $('[data-toggle="tooltip"]').tooltip({
              placement : "top"
            , trigger   : "hover"
        });
    };
})();
