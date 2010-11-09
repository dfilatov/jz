JZ.Widget.Input = $.inherit(JZ.Widget, {

	_bindEvents : function() {

		return this
			._bindToElem({
				'focus' : this._onFocus,
				'blur'  : this._onBlur
			});

	},

	_onFocus : function() {

		this
			.addCSSClass(this.__self.CSS_CLASS_FOCUSED)
			._isFocused = true;
		this.trigger('focus');

	},

	_onBlur : function() {

		this
			.removeCSSClass(this.__self.CSS_CLASS_FOCUSED)
			._isFocused = false;
		this.trigger('blur');

	},

	_hasVal : function() {

		return true;

	},

	_enableElems : function() {

		this._elem.attr('disabled', false);

	},

	_disableElems : function() {

		this._elem.attr('disabled', true);

	}

});