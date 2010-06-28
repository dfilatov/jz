JZ.Widget.Input.Text = $.inherit(JZ.Widget.Input, {

	_init : function() {

		this.__base()._isFocused || this._enablePlaceholder();
		return this;

	},

	_bindEvents : function() {

		return this
			.__base()
			._bindToElem('input change keyup blur', this._onChange);

	},

	_onFocus : function() {

		this._disablePlaceholder();
		this.__base.apply(this, arguments);

	},

	_onBlur : function() {

		this._enablePlaceholder();
		this.__base.apply(this, arguments);

	},

	_onChange : function() {

		this._updateValue();

	},

	_enablePlaceholder : function() {

		this._params.placeholder && this._getVal().isEmpty() &&
			this._getPlaceholder().removeClass(this.__self.CSS_CLASS_HIDDEN);

	},

	_disablePlaceholder : function() {

		this._params.placeholder && this._getPlaceholder().addClass(this.__self.CSS_CLASS_HIDDEN);

	},

	_getPlaceholder : $.memoize(function() {

		return $('<label for="' + this.getId() + '" class="' + this.__self.CSS_CLASS_PLACEHOLDER + '">' +
			this._params.placeholder + '</label>')
			.insertBefore(this._elem.attr('id', this.getId()));

	}),

	_destruct : function() {

		this._disablePlaceholder();
		this.__base();

	}

}, {

	CSS_CLASS_PLACEHOLDER : JZ.CSS_CLASS_WIDGET + '-placeholder'

});