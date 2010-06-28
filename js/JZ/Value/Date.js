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
			matches && (date = this._createDateFromArray(matches));
		}

		date?
			this._val = this._createValFromDate(date) :
			this.reset();

	},

	isEmpty : function() {

		return !(this._val.year && this._val.month && this._val.day);

	},

	isEqual : function(val) {

		var _self = this.__self;

		if(val instanceof _self.Time) {
			return this.get() + ' 0:0:0' == val.get();
		}

		if(val instanceof _self) {
			return this.get() == val.get();
		}

		if(val instanceof JZ.Value) {
			return this.get() == val.get();
		}

		if(val instanceof Date) {
			return this.get() == new _self(val).get();
		}

		return this.get() === val;

	},

	isGreater : function(val) {

		(val instanceof JZ.Value.Date) ||
			(val = new JZ.Value.Date(val instanceof JZ.Value? val.get() : val));

		if(this.isEmpty() || val.isEmpty()) {
			return false;
		}

		if(this.getYear() > val.getYear()) {
			return true;
		}

		if(this.getYear() == val.getYear()) {
			return this.getMonth() > val.getMonth()?
				true :
				this.getMonth() == val.getMonth() && this.getDay() > val.getDay();
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
			this.getYear() + '-' + this._padNumber(this.getMonth()) + '-' + this._padNumber(this.getDay());

	},

	_padNumber : function(val) {

		return (val < 10? '0' : '') + val;

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

	},

	_createDateFromArray : function(arr) {

		return new Date(
			parseInt(arr[1], 10),
			parseInt(arr[2], 10) - 1,
			parseInt(arr[3], 10));

	},

	_createValFromDate : function(date) {

		return {
			day   : date.getDate(),
			month : date.getMonth() + 1,
			year  : date.getFullYear()
		};

	}

}, {

	matchRE : /^(\d{1,4})-(\d{1,2})-(\d{1,2})/

});