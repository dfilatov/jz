ZForms.Value.Date.Time = ZForms.Value.Date.inheritTo(
	{
		
		reset : function() {

			this.__base();
			
			this.mValue[this.__self.PART_HOUR] = '';
			this.mValue[this.__self.PART_MINUTE] = '';
			this.mValue[this.__self.PART_SECOND] = '';
	
		},

		get : function() {

			if(this.isEmpty()) {
				return '';
			}
				
			return this.__base() + ' ' + this.getHour() + ':' + this.getMinute() + ':' + this.getSecond();
	
		},

		set : function(mValue) {

			var oDate = null;
	
			if(mValue instanceof Date) {
				oDate = mValue;
			}
			else {	

				var aMatched = mValue.match(/^(-?\d{1,4})-(\d{1,2})-(-?\d{1,2})( (-?\d{1,2}):(-?\d{1,2}):(-?\d{1,2}))?/);
		
				if(aMatched) {												
					oDate = new Date(
						parseInt(aMatched[1], 10),
						parseInt(aMatched[2], 10) - 1,
						parseInt(aMatched[3], 10),
						aMatched[5]? parseInt(aMatched[5], 10) : 0,
						aMatched[6]? parseInt(aMatched[6], 10) : 0,
						aMatched[7]? parseInt(aMatched[7], 10) : 0
						);
				}

			}

			if(oDate) {
		
				this.mValue[this.__self.PART_YEAR] = oDate.getFullYear();
				this.mValue[this.__self.PART_MONTH] = oDate.getMonth() + 1;
				this.mValue[this.__self.PART_DAY] = oDate.getDate();
				this.mValue[this.__self.PART_HOUR] = oDate.getHours();
				this.mValue[this.__self.PART_MINUTE] = oDate.getMinutes();
				this.mValue[this.__self.PART_SECOND] = oDate.getSeconds();										
		
			}
			else {		
				this.reset();		
			}			
	
		},
	
		isEqual : function(mValue) {
	
			if(mValue instanceof this.__self) {
				return this.get() == mValue.get();
			}

			if(mValue instanceof ZForms.Value.Date) {
				return this.get() == mValue.get() + ' 0:0:0';
			}

			if(mValue instanceof ZForms.Value || typeof(mValue) == 'string') {
				return this.isEqual(new this.__self(typeof(mValue) == 'string'? mValue : mValue.get()));
			}

			if(mValue instanceof Date) {
				return this.get() == new this.__self(mValue).get();
			}

			return false;
	
		},
	
		isGreater : function(mValue) {

			if(this.__base(mValue)) {
				return true;
			}
			
			var oValue = (mValue instanceof this.__self)?
				mValue :
				new this.__self(
					(mValue instanceof ZForms.Value.Date?
						mValue.get() + ' 0:0:0' :
						(mValue instanceof ZForms.Value?
							mValue.get() :
							mValue
							)
						)
					);
		
			if(this.getDay() == oValue.getDay()) {
		
				if(this.getHour() > oValue.getHour()) {
					return true;
				}
				else if(this.getHour() == oValue.getHour()) {
			
					if(this.getMinute() > oValue.getMinute()) {
						return true;
					}
					else {
						return this.getMinute() == oValue.getMinute() && this.getSecond() > oValue.getSecond();
					}
			
				}
		
			}
	
			return false;

		},

		checkForCompareTypes : function(mValue) {

			if(mValue instanceof this.__self || mValue instanceof ZForms.Value.Date) {
				return !mValue.isEmpty();
			}

			if(mValue instanceof ZForms.Value) {
				return !(new ZForms.Value.Date(mValue.get()).isEmpty());
			}

			if(typeof(mValue) == 'string') {
				return !(new ZForms.Value.Date.Time(mValue).isEmpty());
			}

			return mValue instanceof Date;				

		},
	
		isEmpty : function() {
		
			return this.__base() ||				
				this.mValue[this.__self.PART_HOUR] === '' ||
				this.mValue[this.__self.PART_MINUTE] === '' ||
				this.mValue[this.__self.PART_SECOND] === ''
				;
	
		},

		getHour : function() {
	
			return this.mValue[this.__self.PART_HOUR];
	
		},

		getMinute : function() {
	
			return this.mValue[this.__self.PART_MINUTE];
	
		},

		getSecond : function() {
	
			return this.mValue[this.__self.PART_SECOND];
	
		},
		
		toStr : function() {
		
			if(this.isEmpty()) {
				return '';
			}
		
			return this.__base() + ' ' + (this.getHour() < 10? '0' : '') + this.getHour() + ':' + (this.getMinute() < 10? '0' : '') + this.getMinute() + ':' + (this.getSecond() < 10? '0' : '') + this.getSecond();
		
		}
		
	},
	// static
	{
	
		PART_HOUR   : 'hour',
		PART_MINUTE : 'minute',
		PART_SECOND : 'second'
		
	}
	);