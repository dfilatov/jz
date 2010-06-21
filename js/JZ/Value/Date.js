JZ.Value.Date = $.inherit(JZ.Value, {

	reset : function() {

		this._value = { day : '', month : '', year : '' };

	},

	get : function() {

		return this.isEmpty()? '' : this.getYear() + '-' + this.getMonth() + '-' + this.getDay();

	},

	set : function(value) {

		var date;

		if(value instanceof Date) {
			date = value;
		}
		else {
			var matches = value.match(/^(-?\d{1,4})-(\d{1,2})-(-?\d{1,2})/);
			matches && (date = new Date(
				parseInt(matches[1], 10),
				parseInt(matches[2], 10) - 1,
				parseInt(matches[3], 10)));
		}

		date?
			this._value = { day : date.getDate(), month : date.getMonth() + 1, year : date.getFullYear() } :
			this.reset();

	},

	isEmpty : function() {

		return !(this._value.year && this._value.month && this._value.day);

	},

	isEqual : function(value) {

		if(value instanceof this.__self.Time) {
			return this.get() + ' 0:0:0' == value.get();
		}

		if(value instanceof this.__self) {
			return this.get() == value.get();
		}

		if(value instanceof JZ.Value) {
			return this.get() == value.get();
		}

		if(value instanceof Date) {
			return this.get() == new this.__self(value).get();
		}

		return this.get() === value;

	},

	isGreater : function(value) {

		!(value instanceof JZ.Value.Date) &&
			(value = new JZ.Value.Date((value instanceof JZ.Value)? value.get() : value));

		if(this.isEmpty() || value.isEmpty()) {
			return false;
		}

		if(this.getYear() > value.getYear()) {
			return true;
		}

		if(this.getYear() == value.getYear()) {
			if(this.getMonth() > value.getMonth()) {
				return true;
			}
			return this.getMonth() == value.getMonth() && this.getDay() > value.getDay();
		}

		return false;

	},

	getYear : function() {

		return this._value.year;

	},

	getMonth : function() {

		return this._value.month;

	},

	getDay : function() {

		return this._value.day;

	},

	toString : function() {

		return this.isEmpty()? '' :
			this.getYear() + '-' + (this.getMonth() < 10? '0' : '') + this.getMonth() + '-' +
				(this.getDay() < 10? '0' : '') + this.getDay();

	},

	_checkForCompareTypes : function(value) {

		if(value instanceof JZ.Value.Date || value instanceof JZ.Value.Date.Time) {
			return !value.isEmpty();
		}

		if(value instanceof JZ.Value) {
			return !(new JZ.Value.Date(value.get()).isEmpty());
		}

		if(typeof value == 'string') {
			return !(new JZ.Value.Date(value).isEmpty());
		}

		return value instanceof Date;

	}

});