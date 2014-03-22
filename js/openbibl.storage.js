(function() {
"use strict";
    window.obp.storage.cache = {};
    window.obp.storage.retrieve = function(keys) {
        var ret = [];
        for (var i = 0; i < keys.length; i++) {
            ret.push(this.cache[keys[i]]);
            delete this.cache[keys[i]];
        }
        return ret;
    }
    // NOTE: assumes the only thing stored is bib entries
    window.obp.storage.retrieve_all = function() {
        var ret = [];
        for (var key in this.cache) {
            ret.push(this.cache[key]);
            delete this.cache[key];
        }
        return ret;
    }
    window.obp.storage.store = function(obj) {
        for (var key in obj) 
            this.cache[key] = obj[key];
    }
    window.obp.storage.key_div = "div-entry-";
})();
