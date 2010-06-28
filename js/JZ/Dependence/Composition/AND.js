JZ.Dependence.Composition.AND = $.inherit(JZ.Dependence.Composition, {

	__constructor : function(params) {

		this.__base(params);

		this._resultLeft = this._resultRight = false;

	},

	_precheck : function() {

		this._resultLeft = this._params.dependencies[0]._precheck();
		this._resultRight = this._params.dependencies[1]._precheck();

		return this._resultLeft && this._resultRight;

	},

	_processResult : function() {

		this._resultLeft = this._resultLeft && this._params.dependencies[0]._processResult();
		this._resultRight = this._resultRight && this._params.dependencies[1]._processResult();

		return this._resultLeft && this._resultRight;

	},

	_processParams : function(result) {

		var dependencies = this._params.dependencies;
		return dependencies[0].__self._onAND({
				result : this._resultLeft,
				params : dependencies[0]._processParams(this._resultLeft)
			}, {
				result : this._resultRight,
				params : dependencies[1]._processParams(this._resultRight)
			});

	}

});