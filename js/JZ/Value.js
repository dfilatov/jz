JZ.Value = $.inherit({

	__constructor : function(val) {

		this._val = null;
		this.reset();

		typeof val != 'undefined' && this.set(val);

	},

	reset : function() {

		this.set('');

	},

	get : function() {

		return this._val;

	},

	set : function(val) {

		this._val = val.toString();

	},

	match : function(pattern) {

		return pattern.test(this.get());

	},

	clone : function() {

		return new this.__self(this.get());

	},

	isEqual : function(val) {

		return this._checkForCompareTypes(val) &&
			   this.get() === new this.__self((val instanceof JZ.Value)? val.get() : val).get();

	},

	isGreater : function(val) {

		return this._checkForCompareTypes(val) &&
			   this.get().length > new this.__self((val instanceof JZ.Value)? val.get() : val).get().length;

	},

	isGreaterOrEqual : function(val) {

		return this.isGreater(val) || this.isEqual(val);

	},

	isLess : function(val) {

		return this._checkForCompareTypes(val) && !this.isGreaterOrEqual(val);

	},

	isLessOrEqual : function(val) {

		return this._checkForCompareTypes(val) && !this.isGreater(val);

	},

	isEmpty : function() {

		return this.get() === '';

	},

	toString : function() {

		return this.get().toString();

	},

	_checkForCompareTypes : function(val) {

		return val instanceof this.__self || typeof val == 'string';

	}

});