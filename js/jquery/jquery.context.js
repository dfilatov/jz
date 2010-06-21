(function($) {

$.proxy || ($.proxy = function(fn, context) {
	return function() {
		return fn.apply(context, arguments);
	};
});

})(jQuery);