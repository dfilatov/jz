JZ.Dependence.Composition.OR = $.inherit(JZ.Dependence.Composition, {

	__constructor : function(params) {

		this.__base(params);

		this._resultLeft = this._resultRight = false;

	},

	_precheck : function() {

		this._resultLeft = this._params.dependencies[0]._precheck();
		this._resultRight = this._params.dependencies[1]._precheck();

		return this._resultLeft || this._resultRight;

	},

	_processResult : function() {

		this._resultLeft = this._resultLeft && this._params.dependencies[0]._processResult();
		this._resultRight = this._resultRight && this._params.dependencies[1]._processResult();

		return this._resultLeft || this._resultRight;

	},

	_processParams : function(result) {

		return this._params.dependencies[0].__self._onOR({
			result : this._resultLeft,
			params : this._params.dependencies[0]._processParams(this._resultLeft.result)
		}, {
			result : this._resultRight,
			params : this._params.dependencies[1]._processParams(this._resultRight.result)
		});

	}

});