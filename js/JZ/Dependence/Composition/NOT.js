JZ.Dependence.Composition.NOT = $.inherit(JZ.Dependence.Composition, {

	_precheck : function() {

		return this._params.dependencies[0]._precheck();

	},

	_processResult : function() {

		return !this._params.dependencies[0]._processResult();

	},

	_processParams : function(result) {

		return this._params.dependencies[0]._processParams(result);

	}

});