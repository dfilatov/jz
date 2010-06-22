JZ.Value.Multiple = $.inherit(JZ.Value, {

	reset : function() {

		this.set([]);

	},

	set : function(val) {

		this._val = $.makeArray(val);

	},

	match : function(pattern) {

		if(this.isEmpty()) {
			return pattern.test('');
		}

		var i = 0, length = this._val.length;
		while(i < length) {
			if(pattern.test(this._val[i++])) {
				return true;
			}
		}

		return false;

	},

	clone : function() {

		return new this.__self(this.get().concat([]));

	},

	isEmpty : function() {

		return this._val.length == 0;

	},

	isContain : function(val) {

		var i = 0, length = this._val.length;
		while(i < length) {
			if(this._val[i++] == val) {
				return true;
			}
		}
		return false;

	},

	isEqual : function(val) {

		if(!this._checkForCompareTypes(val)) {
			return false;
		}

		var compareValue = val instanceof this.__self? val.get() : val;

		if(this._val.length != compareValue.length) {
			return false;
		}

		var i = 0, length = this._val.length;
		while(i < length) {
			if(this._val[i] != compareValue[i++]) {
				return false;
			}
		}

		return true;

	},

	isGreater : function(val) {

		return this._checkForCompareTypes(val) &&
			   this._val.length > (val instanceof this.__self? val.get() : val).length;

	},

	_checkForCompareTypes : function(val) {

		return val instanceof this.__self || $.isArray(val);

	}

});