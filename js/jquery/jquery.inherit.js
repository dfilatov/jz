/**
 * Inheritance plugin 1.0.9
 *
 * Copyright (c) 2009 Filatov Dmitry (alpha@zforms.ru)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

(function($) {

var
	hasIntrospection = (function(){_}).toString().indexOf('_') > -1,
	emptyBase = function() {}
	;

$.inherit = function() {

	var
		hasBase = $.isFunction(arguments[0]),
		base = hasBase? arguments[0] : emptyBase,
		props = arguments[hasBase? 1 : 0] || {},
		staticProps = arguments[hasBase? 2 : 1],
		result = props.__constructor || base.prototype.__constructor?
			function() {
				this.__constructor.apply(this, arguments);
			} : function() {},
		inheritance = function() {}
		;

	$.extend(result, base, staticProps);

	inheritance.prototype = base.prototype;
	result.prototype = new inheritance();
	result.prototype.__self = result.prototype.constructor = result;

	var propList = [];
	$.each(props, function(i) {
		if(props.hasOwnProperty(i)) {
			propList.push(i);
		}
	});
	// fucking ie hasn't toString, valueOf in for
	$.each(['toString', 'valueOf'], function() {
		if(props.hasOwnProperty(this) && $.inArray(this, propList) == -1) {
			propList.push(this);
		}
	});

	$.each(propList, function() {
		if(hasBase
			&& $.isFunction(base.prototype[this]) && $.isFunction(props[this])
			&& (!hasIntrospection || props[this].toString().indexOf('.__base') > -1)) {

			(function(methodName) {
				var
					baseMethod = base.prototype[methodName],
					overrideMethod = props[methodName]
					;
				result.prototype[methodName] = function() {
					var baseSaved = this.__base;
					this.__base = baseMethod;
					var result = overrideMethod.apply(this, arguments);
					this.__base = baseSaved;
					return result;
				};
			})(this);

		}
		else {
			result.prototype[this] = props[this];
		}
	});

	return result;

};

})(jQuery);