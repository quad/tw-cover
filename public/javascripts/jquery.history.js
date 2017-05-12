/*
 * jQuery history plugin
 * 
 * sample page: http://www.serpere.info/jquery-history-plugin/samples/
 *
 * Copyright (c) 2006-2009 Taku Sano (Mikage Sawatari)
 * Copyright (c) 2010 Takayuki Miwa
 * Licensed under the MIT License:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Modified by Lincoln Cooper to add Safari support and only call the callback once during initialization
 * for msie when no initial hash supplied.
 */

(function($) {
    var locationWrapper = {
        put: function(hash, win) {
            (win || window).location.hash = encodeURIComponent(hash);
        },
        get: function(win) {
            return decodeURIComponent(((win || window).location.hash).replace(/^#/, ''));
        }
    };

    // public base interface
    var _ = {
        appState: undefined,
        callback: undefined,
        init:  function(callback) {},
        check: function() {},
        load:  function(hash) {}
    };
    $.history = _;

    var SimpleImpl = {
        init: function(callback) {
            _.callback = callback;
            var current_hash = locationWrapper.get();
            _.appState = current_hash;
            _.callback(current_hash);
            setInterval(_.check, 100);
        },
        check: function() {
            var current_hash = locationWrapper.get();
            if(current_hash != _.appState) {
                _.appState = current_hash;
                _.callback(current_hash);
            }
        },
        load: function(hash) {
            if(hash != _.appState) {
                locationWrapper.put(hash);
                _.appState = hash;
                _.callback(hash);
            }
        }
    };

    $.extend(_, SimpleImpl);
})(jQuery);
