JZ.Value.Multiple = $.inherit(JZ.Value, {

	reset : function() {

		this.set([]);

	},

	set : function(value) {

		this._value = $.makeArray(value);

	},

	match : function(pattern) {

		if(this.isEmpty()) {
			return pattern.test('');
		}

		var i = 0, length = this._value.length;
		while(i < length) {
			if(pattern.test(this._value[i++])) {
				return true;
			}
		}

		return false;

	},

	clone : function() {

		return new this.__self(this.get().concat([]));

	},

	isEmpty : function() {

		return this._value.length == 0;

	},

	isContain : function(value) {

		var i = 0, length = this._value.length;
		while(i < length) {
			if(this._value[i++] == value) {
				return true;
			}
		}
		return false;

	},

	isEqual : function(value) {

		if(!this._checkForCompareTypes(value)) {
			return false;
		}

		var compareValue = value instanceof this.__self? value.get() : value;

		if(this._value.length != compareValue.length) {
			return false;
		}

		var i = 0, length = this._value.length;
		while(i < length) {
			if(this._value[i] != compareValue[i++]) {
				return false;
			}
		}

		return true;

	},

	isGreater : function(value) {

		return this._checkForCompareTypes(value) &&
			   this._value.length > (value instanceof this.__self? value.get() : value).length;

	},

	_checkForCompareTypes : function(value) {

		return value instanceof this.__self || $.isArray(value);

	}

});