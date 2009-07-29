JZ.Dependence = $.inherit({

	__constructor : function(params) {

		this._params = $.extend(this._getDefaultParams(), params);

	},

	getFrom : function() {

		return [this._params.widget];

	},

	check : function() {

		var result = this._params.widget.getValue().match(this._params.pattern);
		return {
			result : this._params.inverse? !result : result
		};

	},

	_getDefaultParams : function() {

		return {
			pattern : /.+/,
			inverse : false
		};

	}

});