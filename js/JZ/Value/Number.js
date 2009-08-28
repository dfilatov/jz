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

	toString : function() {

		return isNaN(this._value)? '' : this._value.toString().replace('.', JZ.Resources.getNumberSeparator());

	},

	_checkForCompareTypes : function(value) {

		if(value instanceof this.__self || typeof value == 'number') {
			return true;
		}

		if(value instanceof JZ.Value) {
			return !isNaN(parseFloat(value.get()));
		}

		if(typeof value == 'string') {
			return !isNaN(parseFloat(value));
		}

		return false;

	}

});