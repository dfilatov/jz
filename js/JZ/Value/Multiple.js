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

		return new this.__self(this.get().slice(0));

	},

	isEmpty : function() {

		return this._val.length == 0;

	},

	isContain : function(val) {

		var i = 0, thisVal = this._val, length = thisVal.length;
		while(i < length) {
			if(thisVal[i++] == val) {
				return true;
			}
		}
		return false;

	},

	isEqual : function(val) {

		if(!this._checkForCompareTypes(val)) {
			return false;
		}

		var compareVal = val instanceof this.__self? val.get() : val,
			thisVal = this._val,
			thisValLength = thisVal.length;

		if(thisValLength != compareVal.length) {
			return false;
		}

		var i = 0;
		while(i < thisValLength) {
			if(thisVal[i] != compareVal[i++]) {
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