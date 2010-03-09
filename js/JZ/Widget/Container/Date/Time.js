JZ.Widget.Container.Date.Time = $.inherit(JZ.Widget.Container.Date, {

	__constructor : function() {

		this.__base.apply(this, arguments);
		this._hourInput = this._minuteInput = this._secondInput = null;

	},

	_addChildInputs : function() {

		this
			.addChild(this._secondInput = this._createNumberInput('second', { maxLength : 2 }))
			.addChild(this._minuteInput = this._createNumberInput('minute', { maxLength : 2 }))
			.addChild(this._hourInput = this._createNumberInput('hour', { maxLength : 2 }))
			.__base();

	},

	_onChildChange : function() {

		this._setValue(this._createValue(
			this._yearInput.getValue() + '-' + this._monthInput.getValue() + '-' + this._dayInput.getValue() + ' ' +
			this._hourInput.getValue() + ':' + this._minuteInput.getValue() + ':' + this._secondInput.getValue()), true);

	},

	_updateChildValues : function(value) {

		value = this.__base(value);
		value.getHour() != this._hourInput.getValue() && this._hourInput.setValue(value.getHour());
		value.getMinute() != this._minuteInput.getValue() && this._minuteInput.setValue(value.getMinute());
		value.getSecond() != this._secondInput.getValue() && this._secondInput.setValue(value.getSecond());

	},

	_createValue : function(value) {

		return new JZ.Value.Date.Time(value);

	},

	_destruct : function() {

		this._hourInput.remove(true);
		this._minuteInput.remove(true);
		this._secondInput.remove(true);
		this.__base();

	}

});