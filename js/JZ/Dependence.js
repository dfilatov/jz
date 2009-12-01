JZ.Dependence = $.inherit({

	__constructor : function(params) {

		this._params = $.extend(this._getDefaultParams(), this._preprocessParams(params));

	},

	getFrom : function() {

		return [this._params.widget];

	},

	removeFrom : function(widget) {

		return this._params.widget === widget? null : this;

	},

	check : function() {

		var result = this._precheck() &&
					 (this._params.fn? this._params.fn(this._params.widget) : this._processResult());

		return {
			result : result,
			params : this._processParams(result)
		};

	},

	_preprocessParams : function(params) {

		return params;

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

	_onOr : function() {},
	_onAnd : function() {}

});