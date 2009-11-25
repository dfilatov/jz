/**
 * Memoize plugin 1.0.0
 *
 * Copyright (c) 2009 Filatov Dmitry (alpha@zforms.ru)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

(function($) {

var getFnHash = function(fn, ctx, args) {
		var result = [$.identify(fn), $.identify(ctx)];
		$.each(args, function() {
			result.push(typeof this, this);
		});
		return result.join('\x0B');
	};

$.memoize = function(fn) {
	return function() {
		!fn['__memoize'] && (fn['__memoize'] = {});
		var hash = getFnHash(fn, this, arguments);
		return fn['__memoize'][hash] || (fn['__memoize'][hash] = fn.apply(this, arguments));
	};
};

})(jQuery);