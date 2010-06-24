JZ.Value.Date = $.inherit(JZ.Value, {

	reset : function() {

		this._val = { day : '', month : '', year : '' };

	},

	get : function() {

		return this.isEmpty()? '' : this.getYear() + '-' + this.getMonth() + '-' + this.getDay();

	},

	set : function(val) {

		var date;

		if(val instanceof Date) {
			date = val;
		}
		else {
			var matches = val.match(this.__self.matchRE);
			matches && (date = new Date(
				parseInt(matches[1], 10),
				parseInt(matches[2], 10) - 1,
				parseInt(matches[3], 10)));
		}

		date?
			this._val = { day : date.getDate(), month : date.getMonth() + 1, year : date.getFullYear() } :
			this.reset();

	},

	isEmpty : function() {

		return !(this._val.year && this._val.month && this._val.day);

	},

	isEqual : function(val) {

		if(val instanceof this.__self.Time) {
			return this.get() + ' 0:0:0' == val.get();
		}

		if(val instanceof this.__self) {
			return this.get() == val.get();
		}

		if(val instanceof JZ.Value) {
			return this.get() == val.get();
		}

		if(val instanceof Date) {
			return this.get() == new this.__self(val).get();
		}

		return this.get() === val;

	},

	isGreater : function(val) {

		!(val instanceof JZ.Value.Date) &&
			(val = new JZ.Value.Date((val instanceof JZ.Value)? val.get() : val));

		if(this.isEmpty() || val.isEmpty()) {
			return false;
		}

		if(this.getYear() > val.getYear()) {
			return true;
		}

		if(this.getYear() == val.getYear()) {
			if(this.getMonth() > val.getMonth()) {
				return true;
			}
			return this.getMonth() == val.getMonth() && this.getDay() > val.getDay();
		}

		return false;

	},

	getYear : function() {

		return this._val.year;

	},

	getMonth : function() {

		return this._val.month;

	},

	getDay : function() {

		return this._val.day;

	},

	toString : function() {

		return this.isEmpty()? '' :
			this.getYear() + '-' + (this.getMonth() < 10? '0' : '') + this.getMonth() + '-' +
				(this.getDay() < 10? '0' : '') + this.getDay();

	},

	_checkForCompareTypes : function(val) {

		if(val instanceof JZ.Value.Date || val instanceof JZ.Value.Date.Time) {
			return !val.isEmpty();
		}

		if(val instanceof JZ.Value) {
			return !(new JZ.Value.Date(val.get()).isEmpty());
		}

		if(typeof val == 'string') {
			return !(new JZ.Value.Date(val).isEmpty());
		}

		return val instanceof Date;

	}

}, {

	matchRE : /^(\d{1,4})-(\d{1,2})-(\d{1,2})/

});