JZ.Value.Number = $.inherit(JZ.Value, {

	set : function(val) {

		this._val = parseFloat(val.toString().replace(this.__self.replaceRE, '').replace(',', '.'));

	},

	match : function(pattern) {

		return pattern.test(isNaN(this._val)? '' : this._val.toString());

	},

	isEmpty : function() {

		return isNaN(this._val);

	},

	isGreater : function(val) {

		return this._checkForCompareTypes(val) &&
			   this.get() > new this.__self((val instanceof JZ.Value)? val.get() : val).get();

	},

	toString : function() {

		return isNaN(this._val)? '' : this._val.toString().replace('.', JZ.Resources.getNumberSeparator());

	},

	_checkForCompareTypes : function(val) {

		if(val instanceof this.__self || typeof val == 'number') {
			return true;
		}

		if(val instanceof JZ.Value) {
			return !isNaN(parseFloat(val.get()));
		}

		if(typeof val == 'string') {
			return !isNaN(parseFloat(val));
		}

		return false;

	}

}, {

	replaceRE : /[^0-9\.\,\-]/g

});