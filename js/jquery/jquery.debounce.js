/**
 * Debounce and throttle function's decorator plugin 1.0.3
 *
 * Copyright (c) 2009 Filatov Dmitry (alpha@zforms.ru)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

(function($) {

$.extend({

	debounce : function(fn, timeout, invokeAsap, context) {

		if(arguments.length == 3 && typeof invokeAsap != 'boolean') {
			context = invokeAsap;
			invokeAsap = false;
		}

		var timer;

		return function() {

			var args = arguments;
			context = context || this;

			if(invokeAsap && !timer) {
				fn.apply(context, args);
			}

			clearTimeout(timer);

			timer = setTimeout(function() {
				if(!invokeAsap) {
					fn.apply(context, args);
				}
				timer = null;
			}, timeout);

		};

	},

	throttle : function(fn, timeout, context) {

		var timer, args, needInvoke;

		return function() {

			args = arguments;
			needInvoke = true;

			if(!timer) {
				(function() {
					if(needInvoke) {
						fn.apply(context, args);
						needInvoke = false;
						timer = setTimeout(arguments.callee, timeout);
					}
					else {
						timer = null;
					}
				})();
			}

		};

	}

});

})(jQuery);