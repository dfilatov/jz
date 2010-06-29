JZ.Dependence.Composition.OR = $.inherit(JZ.Dependence.Composition, {

	__constructor : function(params) {

		this.__base(params);

		this._resultLeft = this._resultRight = false;

	},

	_precheck : function() {

		var dependencies = this._params.dependencies;
		this._resultLeft = dependencies[0]._precheck();
		this._resultRight = dependencies[1]._precheck();

		return this._resultLeft || this._resultRight;

	},

	_processResult : function() {

		var dependencies = this._params.dependencies;
		this._resultLeft = this._resultLeft && dependencies[0]._processResult();
		this._resultRight = this._resultRight && dependencies[1]._processResult();

		return this._resultLeft || this._resultRight;

	},

	_processParams : function(result) {

		var dependencies = this._params.dependencies;
		return dependencies[0].__self._onOR({
			result : this._resultLeft,
			params : dependencies[0]._processParams(this._resultLeft)
		}, {
			result : this._resultRight,
			params : dependencies[1]._processParams(this._resultRight)
		});

	}

});