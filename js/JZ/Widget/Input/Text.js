JZ.Widget.Input.Text = $.inherit(JZ.Widget.Input, {

	_init : function() {

		this.__base();
		!this._isFocused && this._enablePlaceholder();

	},

	_bindEvents : function() {

		this.__base();
		this._bindToElement('input change keyup blur', this._onChange);

	},

	_onFocus : function() {

		this._disablePlaceholder();
		this.__base();

	},

	_onBlur : function() {

		this._enablePlaceholder();
		this.__base();

	},

	_onChange : function() {

		this._updateValue();

	},

	_enablePlaceholder : function() {

		!!this._params.placeholder && this._getValue().isEmpty() && this._getPlaceholder().removeClass(this.__self.CSS_CLASS_HIDDEN);

	},

	_disablePlaceholder : function() {

		!!this._params.placeholder && this._getPlaceholder().addClass(this.__self.CSS_CLASS_HIDDEN);

	},

	_getPlaceholder : $.memoize(function() {

		var result = $('<label for="' + this.getId() + '" class="' + this.__self.CSS_CLASS_PLACEHOLDER + '">' +
			this._params.placeholder + '</label>');

		this._element
			.attr('id', this.getId())
			.before(result);

		return result;

	}),

	_destruct : function() {

		this._disablePlaceholder();
		this.__base();

	}

}, {

	CSS_CLASS_PLACEHOLDER : JZ.CSS_CLASS_WIDGET + '-placeholder'

});