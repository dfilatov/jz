JZ.Widget.Input.Text = $.inherit(JZ.Widget.Input, {

	_constructor : function() {

		this.__base.apply(this, arguments);
		this._hintShowed = false;

	},

	_init : function() {

		this.__base()._isFocused || this._updatePlaceholder();
		return this;

	},

	_bindEvents : function() {

		return this
			.__base()
			._bindToElem('input change keyup blur', this._onChange);

	},

	_onFocus : function() {

		this.__base.apply(this, arguments);
		this._updatePlaceholder();

	},

	_onBlur : function() {

		this.__base.apply(this, arguments);
		this._updatePlaceholder();

	},

	_onChange : function() {

		this._updateValue();

	},

	_updatePlaceholder : function() {

		if(this._params.placeholder) {
			var showHint = this._hintShowed,
				isValEmpty = this._getVal().isEmpty();
			this._hintShowed?
				(this._isFocused || !isValEmpty) && (showHint = false) :
				(!this._isFocused && isValEmpty) && (showHint = true);
			showHint != this._hintShowed &&
				this._getPlaceholder()[(this._hintShowed = showHint? 'remove' : 'add') + 'Class'](this.__self.CSS_CLASS_HIDDEN);
		}

	},

	_setValToElem : function() {

		this._updatePlaceholder();
		this.__base.apply(this, arguments);

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