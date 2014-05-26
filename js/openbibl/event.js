define(
  [ 'module', 'jquery', 'domReady', 'obpconfig' ]
, function(module,$,domReady,obpconfig) {
    return {
         name : 'openbibl.event'
       , events: {
             "obp:filter-start"          : {}
           , "obp:filter-change"         : {}
           , "obp:filter-mode-change"    : {}
           , "obp:filter-complete"       : {}
           , "obp:bibliography-added"    : {}
           , "obp:search-term-change"    : {}
           , "obp:browse-term-change"    : {}
       }
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
