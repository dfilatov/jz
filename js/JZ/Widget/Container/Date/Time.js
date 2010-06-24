JZ.Widget.Container.Date.Time = $.inherit(JZ.Widget.Container.Date, {

	__constructor : function() {

		this.__base.apply(this, arguments);
		this._hourInput = this._minuteInput = this._secondInput = null;

	},

	_addChildInputs : function() {

		this
			.addChild(
				this._secondInput = this._createNumberInput('second', { size : 2 }),
				this._minuteInput = this._createNumberInput('minute', { size : 2 }),
				this._hourInput = this._createNumberInput('hour', { size : 2 }))
			.__base();

	},

	_onChildChange : function() {

		this._setVal(this._createVal(
			this._yearInput.getValue() + '-' + this._monthInput.getValue() + '-' + this._dayInput.getValue() + ' ' +
			this._hourInput.getValue() + ':' + this._minuteInput.getValue() + ':' + this._secondInput.getValue()), true);

	},

	_updateChildValues : function(val) {

		val = this.__base(val);

		var widgets = [this._hourInput, this._minuteInput, this._secondInput],
			vals = [val.getHour(), val.getMinute(), val.getSecond()];
		$.each(widgets, function(i) {
			this.val() != vals[i] && this.val(vals[i]);
		});

	},

	_createVal : function(val) {

		return new JZ.Value.Date.Time(val);

	}

});