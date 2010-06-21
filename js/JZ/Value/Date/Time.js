JZ.Value.Date.Time = $.inherit(JZ.Value.Date, {

	reset : function() {

		this._value = { second : '', minute : '', hour : '', day : '', month : '', year : '' };

	},

	get : function() {

		return this.isEmpty()?
	    	'' :
			this.__base() + ' ' + this.getHour() + ':' + this.getMinute() + ':' + this.getSecond();

	},

	set : function(value) {

		var date;

		if(value instanceof Date) {
			date = value;
		}
		else {
			var matches = value.match(/^(-?\d{1,4})-(\d{1,2})-(-?\d{1,2}) (-?\d{1,2}):(-?\d{1,2}):(-?\d{1,2})/);
			matches && (date = new Date(
				parseInt(matches[1], 10),
				parseInt(matches[2], 10) - 1,
				parseInt(matches[3], 10),
				parseInt(matches[4], 10),
				parseInt(matches[5], 10),
				parseInt(matches[6], 10)));
		}

		date?
			this._value = {
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

		return this.__base() || this._value.hour === '' || this._value.minute === '' || this._value.second === '';

	},

	isEqual : function(value) {

		if(value instanceof this.__self) {
			return this.get() == value.get();
		}

		if(value instanceof JZ.Value.Date) {
			return this.get() == value.get() + ' 0:0:0';
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

		if(this.__base(value)) {
			return true;
		}

		var value = (value instanceof this.__self)?
			value :
			new this.__self(
				(value instanceof JZ.Value.Date?
					value.get() + ' 0:0:0' :
					(value instanceof JZ.Value? value.get() : value)));

		if(this.getDay() == value.getDay()) {
			if(this.getHour() > value.getHour()) {
				return true;
			}
			else if(this.getHour() == value.getHour()) {
				if(this.getMinute() > value.getMinute()) {
					return true;
				}
				else {
					return this.getMinute() == value.getMinute() && this.getSecond() > value.getSecond();
				}
			}

		}

		return false;

	},

	getHour : function() {

		return this._value.hour;

	},

	getMinute : function() {

		return this._value.minute;

	},

	getSecond : function() {

		return this._value.second;

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

});