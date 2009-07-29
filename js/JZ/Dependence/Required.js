JZ.Dependence.Required = $.inherit(JZ.Dependence, {

	__constructor : function(params) {

		this.__base(params);

		this._params.pattern = this._params.min > 1?
	    	new RegExp('\\S.{' + (this._params.min - 2) + ',}\\S') :
			/\S+/;

	},

	_getDefaultParams : function() {

		return {
			min : 1
		};

	}

});