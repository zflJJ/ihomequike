(function(win) {
    var doc = win.document;
    var docEl = doc.documentElement;
    var tid;

    function refreshRem() {
        var width = docEl.getBoundingClientRect().width;
        if (width > 540) { // 最大宽度
            width = 540;
        }
        var rem = width / 25;
        docEl.style.fontSize = rem + 'px';
    }
    win.addEventListener('resize', function() {
        refreshRem();
    }, false);
    refreshRem();
})(window);