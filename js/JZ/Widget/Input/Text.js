JZ.Widget.Input.Text = $.inherit(JZ.Widget.Input, {

	__constructor : function() {

		this.__base.apply(this, arguments);
		this._elemLastVal = this._elem.val();
		this._hintShowed = false;

	},

	isFocusable : function() {

		return this._elem[0].type.toLowerCase() != 'hidden';

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

		this.__base();
		this._updatePlaceholder();

	},

	_onBlur : function() {

		this.__base();
		this._updatePlaceholder();

	},

	_onChange : function() {

		if(this._elemLastVal != this._elem.val()) {
			this._elemLastVal = this._elem.val();
			this._updateVal();
		}

	},

	_updatePlaceholder : function() {

		if(this._params.placeholder) {
			var showHint = this._hintShowed,
				isValEmpty = !this._elem.val();
			this._hintShowed?
				(this._isFocused || !isValEmpty) && (showHint = false) :
				(!this._isFocused && isValEmpty) && (showHint = true);
			showHint != this._hintShowed &&
				this._getPlaceholder()[((this._hintShowed = showHint)? 'remove' : 'add') + 'Class'](this.__self.CSS_CLASS_HIDDEN);
		}

	},

	_setValToElem : function() {

		this._updatePlaceholder();
		this.__base.apply(this, arguments);
		this._elemLastVal = this._elem.val();

	},

	_getPlaceholder : function() {

		return this._placeholder || (this._placeholder = $('<label for="' + this.getId() + '" class="' + this.__self.CSS_CLASS_PLACEHOLDER + '">' +
			this._params.placeholder + '</label>')
			.insertBefore(this._elem.attr('id', this.getId())));

	},

	_destruct : function() {

		this._placeholder && this._placeholder.remove();
		this.__base();

	}

}, {

	CSS_CLASS_PLACEHOLDER : JZ.CSS_CLASS_WIDGET + '-placeholder'

});