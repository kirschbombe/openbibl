define(
  [ 'module', 'jquery', 'domReady', 'obpconfig' ]
, function(module,$,domReady,obpconfig) {
    var supported_events = [  
        "obp:filter-start",      "obp:filter-change",      "obp:filter-mode-change", 
        "obp:filter-complete",   "obp:bibliography-added", "obp:search-term-change",
        "obp:browse-term-change"
    ];
    var event_map = {};
    var init_events = function() {
        for (var i = 0; i < supported_events.length; i++)
            event_map[supported_events[i]] = {};
    };
    init_events();
    return {
         init : function() {
             init_events();
             this.events = event_map;
         }
       , events: event_map
       , subscribe : function(ev,obj,cb) {
            if (obpconfig.debug) obpconfig.console.log(obj + ' subscribed ' + ev);
            if (!(ev in this.events)) {
               throw "Unsupported event subscription for '"
                     + ev + "' from object '" + obj + "'";
            }
           this.events[ev][obj] = cb;
       }
       , unsubscribe : function(ev,obj) {
            if (!(ev in this.events)) {
               throw "Unsupported event subscription for '"
                     + ev + "' from object '" + obj + "'";
            }
            delete this.events[ev][obj];
       }
       , raise : function(ev,obj) {
            if (obpconfig.debug) obpconfig.console.log(obj + ' raised ' + ev);
            if (!(ev in this.events)) {
               throw "Unsupported event subscription for '"
                     + ev + "' from object '" + obj + "'";
            }
            var subscribers = this.events[ev] || {};
            for (var obj in subscribers) {
                subscribers[obj]();
            }
       }
    }
});
