JZ.Widget.Input.State = $.inherit(JZ.Widget.Input, {

	_bindEvents : function() {

		this.__base();
		this._bindToElement('click', this._onChange);

	},

	_onChange : function() {

		this.trigger('value-change', this);

	},

	_checkDependencies : function() {},

	_setChecked : function(checked) {

		this._element.attr('checked', checked);
		this[(checked? 'add' : 'remove') + 'CSSClass'](this.__self.CSS_CLASS_CHECKED);

	},

	_isChecked : function() {

		return this._element.attr('checked');

	},

	_hasValue : function() {

		return false;

	}

}, {

	CSS_CLASS_CHECKED : JZ.CSS_CLASS_WIDGET + '-checked'

});