ZForms.Value.Number = ZForms.Value.inheritTo(
	{

		set : function(mValue) {

			this.mValue = parseFloat(mValue.toString().replace(/[^0-9\.\,\-]/g, '').replace(/\,/g, '.'));

		},

		match : function(rPattern) {

			return rPattern.test(isNaN(this.mValue)? '' : this.mValue.toString());

		},

		isEmpty : function() {

			return isNaN(this.mValue);

		},

		isEqual : function(mValue) {

			if(!this.checkForCompareTypes(mValue)) {
				return false;
			}

			var oValue = (mValue instanceof this.__self)?
				mValue :
				new this.__self(
					(mValue instanceof ZForms.Value)?
						mValue.get() :
						mValue
					)
				;

			return this.get() === oValue.get();

		},

		isGreater : function(mValue) {

			if(!this.checkForCompareTypes(mValue)) {
				return false;
			}

			var oValue = (mValue instanceof this.__self)?
				mValue :
				new this.__self(
					(mValue instanceof ZForms.Value)?
						mValue.get() :
						mValue
					)
				;

			return this.get() > oValue.get();

		},

		checkForCompareTypes : function(mValue) {

			return mValue instanceof this.__self || (mValue instanceof ZForms.Value && !isNaN(parseFloat(mValue.get()))) || typeof(mValue) == 'number' || (typeof(mValue) == 'string' && !isNaN(parseFloat(mValue.toString())));

		},

		toStr : function() {

			return isNaN(this.mValue)? '' : this.mValue.toString();

		}

	}
	);