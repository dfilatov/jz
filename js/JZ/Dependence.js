JZ.Dependence = $.inherit({

	__constructor : function(params) {

		this._params = $.extend(this._getDefaultParams(), params);

	},

	getFrom : function() {

		return [this._params.widget];

	},

	check : function() {

		return {
			result : this._params.widget.isEnabled() && this._params.widget.getValue().match(this._params.pattern),
			params : {}
		};

	},

	_getDefaultParams : function() {

		return {
			pattern : /.+/
		};

	}

});