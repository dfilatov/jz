JZ.Widget.Container.Date.Time = $.inherit(JZ.Widget.Container.Date, {

	__constructor : function() {

		this.__base.apply(this, arguments);
		this._hourInput = this._minuteInput = this._secondInput = null;

	},

	_addChildInputs : function() {

		this
			.addChild(
				this._secondInput = this._createNumberInput('second'),
				this._minuteInput = this._createNumberInput('minute'),
				this._hourInput = this._createNumberInput('hour'))
			.__base();

	},

	_onChildChange : function() {

		this._setVal(this._createVal(
			this._yearInput.val() + '-' + this._monthInput.val() + '-' + this._dayInput.val() + ' ' +
			this._hourInput.val() + ':' + this._minuteInput.val() + ':' + this._secondInput.val()), true);

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