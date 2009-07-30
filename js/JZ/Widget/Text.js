JZ.Widget.Text = $.inherit(JZ.Widget, {

	__constructor : function(element, classElement, params) {

		this.__base(element, classElement, params);
		this._placeholderElement = !!this._params.placeholder?
			$('<label for="' + this.getId() + '" class="' + this.__self.CSS_CLASS_PLACEHOLDER + '">' +
			this._params.placeholder + '</label>') :
			null;

	},

	init : function() {

		if(this._placeholderElement) {
			this._element
				.attr('id', this.getId())
				.before(this._placeholderElement);
		}

		this.__base();

	},

	_bindEvents : function() {

		this._element
			.focus($.bindContext(this._onFocus, this))
			.blur($.bindContext(this._onBlur, this))
			.bind('input change keyup blur', $.bindContext(this._onChange, this));

	},

	_onFocus : function() {

		this._placeholderElement && this._placeholderElement.addClass(this.__self.CSS_CLASS_HIDDEN);
		this.addCSSClass(this.__self.CSS_CLASS_FOCUSED);

	},

	_onBlur : function() {

		this._placeholderElement && this.getValue().isEmpty() && this._placeholderElement.removeClass(this.__self.CSS_CLASS_HIDDEN);
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

}, {

	CSS_CLASS_PLACEHOLDER : JZ.CSS_CLASS_WIDGET + '-placeholder'

});