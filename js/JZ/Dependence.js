JZ.Dependence = $.inherit({

	__constructor : function(params) {

		this._params = $.extend(this._getDefaultParams(), params);

	},

	getFrom : function() {

		return [this._params.widget];

	},

	check : function() {

		var result = this._precheck() && this._processResult();

		return {
			result : result,
			params : this._processParams(result)
		};

	},

	_precheck : function() {

		return this._params.widget.isEnabled();

	},

	_processResult : function() {

		return this._params.widget._getValue().match(this._params.pattern);

	},

	_processParams : function(result) {},

	_getDefaultParams : function() {

		return {
			pattern : /.+/
		};

	}

}, {

	getClassByType : function(type) {

		switch(type) {
			case 'enabled':
				return this.Enabled;
			return;

			case 'required':
				return this.Required;
			return;
		}

	},

	_onOr : function() {},
	_onAnd : function() {}

});