JZ.Value = $.inherit({

	__constructor : function(value) {

		this._value = null;
		this.reset();

		if(typeof value != 'undefined') {
			this.set(value);
		}

	},

	reset : function() {

		this.set('');

	},

	get : function() {

		return this._value;

	},

	set : function(value) {

		this._value = value.toString();

	},

	match : function(pattern) {

		return pattern.test(this.get());

	},

	clone : function() {

		return new this.__self(this.get());

	},

	isEqual : function(value) {

		return this._checkForCompareTypes(value) &&
			   this.get() === ((value instanceof this.__self) ? value : new this.__self(value)).get();

	},

	isGreater : function(value) {

		return this._checkForCompareTypes(value) &&
			   this.get().length > ((value instanceof this.__self) ? value : new this.__self(value)).get().length;

	},

	isGreaterOrEqual : function(value) {

		return this.isGreater(value) || this.isEqual(value);

	},

	isLess : function(value) {

		return this._checkForCompareTypes(value) && !this.isGreaterOrEqual(value);

	},

	isLessOrEqual : function(value) {

		return this._checkForCompareTypes(value) && !this.isGreater(value);

	},

	isEmpty : function() {

		return this.get() === '';

	},

	toString : function() {

		return this.get().toString();

	},

	_checkForCompareTypes : function(value) {

		return value instanceof this.__self || typeof value == 'string';

	}

});