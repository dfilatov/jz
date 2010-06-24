JZ.Value.Date.Time = $.inherit(JZ.Value.Date, {

	reset : function() {

		this._val = { second : '', minute : '', hour : '', day : '', month : '', year : '' };

	},

	get : function() {

		return this.isEmpty()?
	    	'' :
			this.__base() + ' ' + this.getHour() + ':' + this.getMinute() + ':' + this.getSecond();

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

		val = val instanceof this.__self?
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
				return this.getMinute() > val.getMinute()?
					true :
					this.getMinute() == val.getMinute() && this.getSecond() > val.getSecond();
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

		return this.isEmpty()?
			'' :
			(this.__base() +
			   ' ' + this._padNumber(this.getHour()) +
			   ':' + this._padNumber(this.getMinute()) +
			   ':' + this._padNumber(this.getSecond()));

	},

	_createDateFromArray : function(arr) {

		var result = this.__base(arr);
		result.setHours(parseInt(arr[4], 10));
		result.setMinutes(parseInt(arr[5], 10));
		result.setSeconds(parseInt(arr[6], 10));
		return result;

	},

	_createValFromDate : function(date) {

		return $.extend(this.__base(date), {
			second : date.getSeconds(),
			minute : date.getMinutes(),
			hour   : date.getHours()
		});

	}

}, {

	matchRE : /^(\d{1,4})-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})/

});