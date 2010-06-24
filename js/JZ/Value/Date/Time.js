JZ.Value.Date.Time = $.inherit(JZ.Value.Date, {

	reset : function() {

		this._val = { second : '', minute : '', hour : '', day : '', month : '', year : '' };

	},

	get : function() {

		return this.isEmpty()?
	    	'' :
			this.__base() + ' ' + this.getHour() + ':' + this.getMinute() + ':' + this.getSecond();

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
				parseInt(matches[3], 10),
				parseInt(matches[4], 10),
				parseInt(matches[5], 10),
				parseInt(matches[6], 10)));
		}

		date?
			this._val = {
				second : date.getSeconds(),
				minute : date.getMinutes(),
				hour   : date.getHours(),
				day    : date.getDate(),
				month  : date.getMonth() + 1,
				year   : date.getFullYear()
			} :
			this.reset();

	},

	isEmpty : function() {

		return this.__base() || this._val.hour === '' || this._val.minute === '' || this._val.second === '';

	},

	isEqual : function(val) {

		if(val instanceof this.__self) {
			return this.get() == val.get();
		}

		if(val instanceof JZ.Value.Date) {
			return this.get() == val.get() + ' 0:0:0';
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

		if(this.__base(val)) {
			return true;
		}

		val = (val instanceof this.__self)?
			val :
			new this.__self(
				(val instanceof JZ.Value.Date?
					val.get() + ' 0:0:0' :
					(val instanceof JZ.Value? val.get() : val)));

		if(this.getDay() == val.getDay()) {
			if(this.getHour() > val.getHour()) {
				return true;
			}
			else if(this.getHour() == val.getHour()) {
				if(this.getMinute() > val.getMinute()) {
					return true;
				}
				else {
					return this.getMinute() == val.getMinute() && this.getSecond() > val.getSecond();
				}
			}

		}

		return false;

	},

	getHour : function() {

		return this._val.hour;

	},

	getMinute : function() {

		return this._val.minute;

	},

	getSecond : function() {

		return this._val.second;

	},

	toString : function() {

		if(this.isEmpty()) {
			return '';
		}

		return this.__base() +
			   ' ' + (this.getHour() < 10? '0' : '') + this.getHour() +
			   ':' + (this.getMinute() < 10? '0' : '') + this.getMinute() +
			   ':' + (this.getSecond() < 10? '0' : '') + this.getSecond();

	}

}, {

	matchRE : /^(\d{1,4})-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})/

});