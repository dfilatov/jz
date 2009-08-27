(function($) {

$.event.bindWithContext = function (elem, type, data, handler, context) {
    var fn;

    // http://ajaxian.com/archives/working-aroung-the-instanceof-memory-leak
    if ($.isFunction(data)) {
        context = handler;
        handler = data;
        data = null;
    };

    if (context || data) {
        fn = handler;
        context = context || elem;
        handler = this.proxy(fn, function () {
            return fn.apply(context, arguments);
        });
        handler.data = data;
    };

    this.add(elem, type, handler);
};

$.fn.bind = function (type, data, fn, context) {
    return type === 'unload' ? this.one(type, data, fn) : this.each(function(){
        $.event.bindWithContext(this, type, data, fn, context);
    });
};

$.bindContext = function(fn, context) {
	return function() {
		return fn.apply(context, arguments);
	};
};

})(jQuery);