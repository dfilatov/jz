JZ.Widget.Input.Text = $.inherit(JZ.Widget.Input, {

	init : function() {

		this.__base();
		!this._params.focusOnInit && this._enablePlaceholder();

	},

	_bindEvents : function() {

		this.__base();
		this._element.bind('input change keyup blur', $.bindContext(this._onChange, this));

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

		!!this._params.placeholder && this.getValue().isEmpty() && this._getPlaceholder().removeClass(this.__self.CSS_CLASS_HIDDEN);

	},

	_disablePlaceholder : function() {

		!!this._params.placeholder && this._getPlaceholder().addClass(this.__self.CSS_CLASS_HIDDEN);

	},

	_getPlaceholder : function() {

		var result = $('<label for="' + this.getId() + '" class="' + this.__self.CSS_CLASS_PLACEHOLDER + '">' +
			this._params.placeholder + '</label>');

		this._element
			.attr('id', this.getId())
			.before(result);

		return (this._getPlaceholder = function() {
			 return result;
		})();

	}

}, {

	CSS_CLASS_PLACEHOLDER : JZ.CSS_CLASS_WIDGET + '-placeholder'

});