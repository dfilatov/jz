JZ.Widget.Input = $.inherit(JZ.Widget, {

	__constructor : function() {

		this.__base.apply(this, arguments);

		this._isFocused = false;

	},

	_bindEvents : function() {

		this
			._bindToElement('focus', this._onFocus)
			._bindToElement('blur', this._onBlur);

	},

	_onFocus : function() {

		this.addCSSClass(this.__self.CSS_CLASS_FOCUSED);
		this._isFocused = true;
		this.trigger('focus');

	},

	_onBlur : function() {

		this.removeCSSClass(this.__self.CSS_CLASS_FOCUSED);
		this._isFocused = false;
		this.trigger('blur');

	},

	_hasValue : function() {

		return true;

	},

	_enableElements : function() {

		this._element.attr('disabled', false);

	},

	_disableElements : function() {

		this._element.attr('disabled', true);

	}

});