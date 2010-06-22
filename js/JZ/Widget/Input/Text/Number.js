JZ.Widget.Input.Text.Number = $.inherit(JZ.Widget.Input.Text, {

	__constructor : function() {

		this.__base.apply(this, arguments);
		this._hiddenElem = null; // тут будет храниться реальное значение
		this._keyDownAllowed = false;

	},

	_createVal : function(val) {

		return new JZ.Value.Number(val);

	},

	_init : function() {

		this.__base();
		this._elem.after(this._hiddenElem = $('<input type="hidden" value="' + this._elem.val() + '"' +
			(this._elem.attr('id')? ' id="value-' + this._elem.attr('id') + '"' : '') + '/>'));
		if(this._elem.attr('name')) {
			this._hiddenElem.attr('name', this._elem.attr('name'));
			this._elem.removeAttr('name');
		}
		this._checkElemValue();
		return this;

	},

	_extractName : function() {

		return (this._hiddenElem || this._elem).attr('name');

	},

	_bindEvents : function() {

		return this
			.__base()
			._bindToElem({
				'keydown'  : this._onKeyDown,
				'keypress' : this._onKeyPress
			});

	},

	_onBlur : function() {

		this.__base();
		this._checkElemValue();

	},

	_checkElemValue : function() {

		this._elem.val() != this._getVal().toString() && this._elem.val(this._getVal().toString());

	},

	_onKeyDown : function(e) {

		return this._keyDownAllowed = e.ctrlKey || e.metaKey ||
			(e.keyCode > 47 && e.keyCode < 58) ||
			(e.keyCode > 95 && e.keyCode < 106) ||
			$.inArray(e.keyCode, [190, 189, 188, 109, 46, 45, 39, 37, 36, 35, 9, 8, 13]) > -1;

	},

	_onKeyPress : function(e) {

		if(e.charCode === 0) {
			return true;
		}

		if(!this._keyDownAllowed) {
			return false;
		}

		var keyCode = e.keyCode || e.charCode;

		if($.inArray(keyCode, [44, 45, 46]) == -1) {
			return true;
		}

		var selection = this._elem.getSelection();
		if(this._params.allowNegative && keyCode == 45) {
			return (this._elem.val().charAt(0) != '-' && selection.start == 0) ||
				   selection.text.indexOf('-') > -1;
		}

		return this._params.allowFloat && ((!/\.|\,/.test(this._elem.val()) &&
			   (this._elem.val().charAt(0) != '-' || selection.start > 0 || selection.text.indexOf('-') > -1)) ||
			   selection.text.indexOf('.') > -1 || selection.text.indexOf(',') > -1);

	},

	_setVal : function(val, prevent) {

		this._hiddenElem.val(val.get());
		return this.__base(val, prevent);

	},

	_enableElems : function() {

		this.__base();
		this._hiddenElem && this._hiddenElem.attr('disabled', false);

	},

	_disableElems : function() {

		this.__base();
		this._hiddenElem && this._hiddenElem.attr('disabled', true);

	},

	_getDefaultParams : function() {

		return $.extend(this.__base(), {
			allowNegative : false,
			allowFloat    : false
		});

	},

	_destruct : function() {

		this._hiddenElem.attr('name') && this._elem.attr('name', this._hiddenElem.attr('name'));
		this._hiddenElem.remove();
		this._hiddenElem = null;

		this.__base();

	}

});