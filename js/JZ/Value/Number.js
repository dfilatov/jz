JZ.Value.Number = $.inherit(JZ.Value, {

	set : function(value) {

		this._value = parseFloat(value.toString().replace(/[^0-9\.\,\-]/g, '').replace(/\,/g, '.'));

	},

	match : function(pattern) {

		return pattern.test(isNaN(this._value)? '' : this._value.toString());

	},

	isEmpty : function() {

		return isNaN(this._value);

	},

	isGreater : function(value) {

		return this._checkForCompareTypes(value) &&
			   this.get() > new this.__self((value instanceof JZ.Value)? value.get() : value).get();

	},

	checkForCompareTypes : function(value) {

		return value instanceof this.__self || (value instanceof JZ.Value && !isNaN(parseFloat(value.get()))) ||
			   typeof value == 'number' || (typeof value == 'string' && !isNaN(parseFloat(value.toString())));

	},

	toString : function() {

		return isNaN(this._value)? '' : this._value.toString().replace('.', JZ.Resources.getNumberSeparator());

	}

});