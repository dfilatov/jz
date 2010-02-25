var JZ = {

	CSS_CLASS_WIDGET : 'jz',

	onInit : function(element, fn) {

		element
			.bind('init.jz', fn)
			.each(function() {
				$(this).data('jz') && fn.call(window, $.Event('init.jz'), $(this).data('jz'));
			});

	},

	registerWidget : function(name, parentName, props, staticProps) {

		this.Builder.registerWidget(name, parentName, props, staticProps);
		return this;

	},

	_throwException : function(text) {

		throw 'JZException: ' + text;

	},

	_identifyElement : function(element) {

		return element.attr('id') || ('__id-' + $.identify(element[0]));

	}

};

$.fn.jz = function(add) {
	var result;
	this.each(function(i) {
		var elem = $(this), jz = elem.data('jz');
		if(add === false) {
			jz && jz.remove(true);
		}
		else if(!jz) {
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