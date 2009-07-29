JZ.Dependence = $.inherit({

	__constructor : function(widget, params) {

		this._widget = widget;
		this._params = $.extend(this._getDefaultParams(), params);

	},

	check : function() {

		var result = this._widget.getValue().match(this._params.pattern);
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