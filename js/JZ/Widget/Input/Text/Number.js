JZ.Widget.Input.Text.Number = $.inherit(JZ.Widget.Input.Text, {

	__constructor : function() {

		this.__base.apply(this, arguments);
		this._hiddenElement = null; // тут будет храниться реальное значение
		this._keyDownAllowed = false;

	},

	_createValue : function(value) {

		return new JZ.Value.Number(value);

	},

	_init : function() {

		this.__base();
		this._element.after(this._hiddenElement = $('<input type="hidden" value="' + this._element.val() + '"' +
			(this._element.attr('id')? ' id="value-' + this._element.attr('id') + '"' : '') + '/>'));
		if(this._element.attr('name')) {
			this._hiddenElement.attr('name', this._element.attr('name'));
			this._element.removeAttr('name');
		}
		this._checkElementValue();
		return this;

	},

	_extractName : function() {

		return (this._hiddenElement || this._element).attr('name');

	},

	_bindEvents : function() {

		return this
			.__base()
			._bindToElement('keydown', this._onKeyDown)
			._bindToElement('keypress', this._onKeyPress);

	},

	_onBlur : function() {

		this.__base();
		this._checkElementValue();

	},

	_checkElementValue : function() {

		this._element.val() != this._getValue().toString() && this._element.val(this._getValue().toString());

	},

	_onKeyDown : function(event) {

		return this._keyDownAllowed = event.ctrlKey || event.metaKey ||
			(event.keyCode > 47 && event.keyCode < 58) ||
			(event.keyCode > 95 && event.keyCode < 106) ||
			$.inArray(event.keyCode, [190, 189, 188, 109, 46, 45, 39, 37, 36, 35, 9, 8, 13]) > -1;

	},

	_onKeyPress : function(event) {

		if(event.charCode === 0) {
			return true;
		}

		if(!this._keyDownAllowed) {
			return false;
		}

		var keyCode = event.keyCode || event.charCode;

		if($.inArray(keyCode, [44, 45, 46]) == -1) {
			return true;
		}

		var selection = this._element.getSelection();
		if(this._params.allowNegative && keyCode == 45) {
			return (this._element.val().charAt(0) != '-' && selection.start == 0) ||
				   selection.text.indexOf('-') > -1;
		}

		return this._params.allowFloat && ((!/\.|\,/.test(this._element.val()) &&
			   (this._element.val().charAt(0) != '-' || selection.start > 0 || selection.text.indexOf('-') > -1)) ||
			   selection.text.indexOf('.') > -1 || selection.text.indexOf(',') > -1);

	},

	_setValue : function(value, prevent) {

		this._hiddenElement.val(value.get());
		return this.__base(value, prevent);

	},

	_enableElements : function() {

		this.__base();
		this._hiddenElement && this._hiddenElement.attr('disabled', false);

	},

	_disableElements : function() {

		this.__base();
		this._hiddenElement && this._hiddenElement.attr('disabled', true);

	},

	_getDefaultParams : function() {

		return $.extend(this.__base(), {
			allowNegative : false,
			allowFloat    : false
		});

	}

});