var JZ = {

	CSS_CLASS_WIDGET : 'jz',

	onInit : function(element, fn) {

		element
			.bind('init.jz', fn)
			.each(function() {
				$(this).data('jz') && fn.call(window, $.Event('init.jz'), $(this).data('jz'));
			});

	},

	_throwException : function(text) {

		throw 'JZException: ' + text;

	},

	_identifyElement : (function() {

		var counter = 1;
		return function(element) {
			return element.attr('id') || element.data('__id') || (element.data('__id', '__id-' + counter++).data('__id'));
		};

	})()

};

$.fn.jz = function() {
	var result;
	this.each(function(i) {
		var elem = $(this);
		if(!elem.data('jz')) {
			var form = elem.closest('form');
			if(form[0]) {
				var builder = form.data('jz-builder');
				(builder || new JZ.Builder()).build(builder? elem : form);
			}
		}
		i == 0 && (result = elem.data('jz'));
	});
	return result;
};