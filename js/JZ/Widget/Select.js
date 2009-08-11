JZ.Widget.Select = $.inherit(JZ.Widget, {

	_bindEvents : function() {

		this._element
			.focus($.bindContext(this._onFocus, this))
			.blur($.bindContext(this._onBlur, this))
			.bind('change', $.bindContext(this._onChange, this));

	},

	_onFocus : function() {

		this.addCSSClass(this.__self.CSS_CLASS_FOCUSED);

	},

	_onBlur : function() {

		this.removeCSSClass(this.__self.CSS_CLASS_FOCUSED);

	},

	_onChange : function() {

		this._updateValue();

	},

	_hasValue : function() {

		return true;

	},

	_extractValueFromElement : function() {

		return this._element.val();

	},

	_enableElements : function() {

		this._element.attr('disabled', false);

	},

	_disableElements : function() {

		this._element.attr('disabled', true);

	}

});