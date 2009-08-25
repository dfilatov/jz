JZ.Dependence.Required = $.inherit(JZ.Dependence, {

	__constructor : function(params) {

		this.__base(params);

		this._params.pattern = this._params.min > 1?
	    	new RegExp('\\S.{' + (this._params.min - 2) + ',}\\S') :
			/\S+/;
		this._params.patternChild = /\S+/;

	},

	_processResult : function() {

		return this._params.widget._checkRequired(this._params);

	},

	_getDefaultParams : function() {

		return {
			min : 1
		};

	}

});