var JZ = {

	CSS_CLASS_WIDGET : 'jz',

	build : function(element) {

		return new this.Builder(element).build();

	},

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
			return element.attr('id') || element[0].__id || (element[0].__id = '__id-' + counter++);
		};

	})()

};