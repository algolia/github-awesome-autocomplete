// module for manipulating / validating the form shared between options and
// popup views.  when 'Go!' button is pressed, structured info is passed to
// provided callback.
//
// no unit tests for this module, it is jQuery manipulation mostly.
//

var $ = require('../libs/jquery');

module.exports.init = function(callback) {
  $(function() {

    // form logic:
    $('#type_bcast, #type_cmd, #type_bg').change(function() {
      var bg_sel = $('#type_bg').is(':checked');
      $('#ctx, #tab').prop('disabled', bg_sel);
    });

    $('#cmd_echo, #cmd_random').change(function() {
      var echo_sel = $('#cmd_echo').is(':checked');
      $('#cmd_echo_text').prop('disabled', !echo_sel);
      $('#cmd_random_sync, #cmd_random_async').prop('disabled', echo_sel);
    });

    $('#ctx_all, #ctx_select').change(function() {
      var ctx_all = $('#ctx_all').is(':checked');
      $('input[type=checkbox]').prop('disabled', ctx_all);
    });

    $('#tab_all, #tab_same, #tab_provided').change(function() {
      var tab_prov = $('#tab_provided').is(':checked');
      $('#tab_provided_text').prop('disabled', !tab_prov);
    });

    function validateTabId() {
      var el = $('#tab_provided_text');
      if ('' === el.val()) { el.val(1); }
      if (parseInt(el.val(), 10) < 0) { el.val(1); }
    }

    $('#tab_provided_text').blur(validateTabId);

    // button logic:
    $('#submit').click(function() {
      validateTabId();
      if ('function' === typeof(callback)) {
        var res = {};
        var type_bcast = $('#type_bcast').is(':checked'),
            type_bg = $('#type_bg').is(':checked'),
            cmd_echo = $('#cmd_echo').is(':checked'),
            cmd_echo_text = $('#cmd_echo_text').val(),
            cmd_random_sync = $('#cmd_random_sync').is(':checked'),
            ctx_all = $('#ctx_all').is(':checked'),
            ctx_sel_bg = $('#ctx_select_bg').is(':checked'),
            ctx_sel_ct = $('#ctx_select_ct').is(':checked'),
            ctx_sel_dt = $('#ctx_select_dt').is(':checked'),
            ctx_sel_popup = $('#ctx_select_popup').is(':checked'),
            ctx_sel_options = $('#ctx_select_options').is(':checked'),
            tab_all = $('#tab_all').is(':checked'),
            tab_provided = $('#tab_provided').is(':checked'),
            tab_provided_val = parseInt($('#tab_provided_text').val(), 10);
        // command:
        if (cmd_echo) { res.cmd = 'echo'; res.arg = cmd_echo_text; }
        else if (cmd_random_sync) { res.cmd = 'random'; }
        else { res.cmd = 'randomAsync'; }
        // type:
        if (type_bg) { res.type = 'bg'; }
        else {
          if (type_bcast) { res.type = 'bcast'; } else { res.type = 'cmd'; }
          // contexts:
          res.ctx_all = ctx_all;
          if (!ctx_all) {
            var arr = [];
            if (ctx_sel_bg) { arr.push('bg'); }
            if (ctx_sel_ct) { arr.push('ct'); }
            if (ctx_sel_dt) { arr.push('dt'); }
            if (ctx_sel_popup) { arr.push('popup'); }
            if (ctx_sel_options) { arr.push('options'); }
            res.ctxs = arr;
          }
          // tab id:
          if (tab_all) { res.tab = -1; }
          else if (tab_provided) { res.tab = tab_provided_val; }
          else { res.tab = -2; } // same id
        }
        callback(res);
      }
      return false;  // stop propagation
    });

    // default values:
    $('#type_bcast, #cmd_random, #cmd_random_sync, #ctx_all, #tab_all').attr('checked', true);
    $('#cmd_echo_text').val('salsita');
    $('#cmd_echo_text').prop('disabled', true);
    $('input[type=checkbox]').prop('checked', true);
    $('input[type=checkbox]').prop('disabled', true);
    $('#tab_provided_text').val(1);
    $('#tab_provided_text').prop('disabled', true);
  });

};
