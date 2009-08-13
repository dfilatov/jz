JZ.Widget.Input = $.inherit(JZ.Widget, {

	__constructor : function() {

		this.__base.apply(this, arguments);

		this._isFocused = false;

	},

	_bindEvents : function() {

		this._element
			.focus($.bindContext(this._onFocus, this))
			.blur($.bindContext(this._onBlur, this));

	},

	_onFocus : function() {

		this.addCSSClass(this.__self.CSS_CLASS_FOCUSED);
		this._isFocused = true;

	},

	_onBlur : function() {

		this.removeCSSClass(this.__self.CSS_CLASS_FOCUSED);
		this._isFocused = false;

	},

	_hasValue : function() {

		return true;

	},

	_extractValueFromElement : function() {

		return this._element.val();

	},

	_setValueToElement : function(value) {

		this._element.val(value.toString());

	},

	_enableElements : function() {

		this._element.attr('disabled', false);

	},

	_disableElements : function() {

		this._element.attr('disabled', true);

	}

});