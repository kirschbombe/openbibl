(function() {
"use strict";
    window.obp.scroll_to_id = function(ref_id,dlg_id) {
        var $dlg = $('#' + dlg_id);
        // bring attention to the mention once the dialog is closed
        $dlg.on('hidden.bs.modal', function(e) {
            var $elt = $('#' + ref_id);
            if ($elt.length == 0) return;
            $('html body').scrollTop($elt.offset().top -
                $('#bibliographies').offset().top);
            $elt.css('background-color', 'red').delay(10000).removeClass('obp-highlight');
         });
         $dlg.modal('hide');
    }
    window.obp.retrieve_cookie = function(key) {
        return $.cookie(key);
    }
    window.obp.update_cookie = function(key,val) {
        if (key !== undefined) $.cookie(key,val);
    }
})();
