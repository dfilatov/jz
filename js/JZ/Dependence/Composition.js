JZ.Dependence.Composition= $.inherit(JZ.Dependence, {

	getFrom : function() {

		var result = [];
		$.each(this._params.dependencies, function() {
			result = result.concat(this.getFrom());
		});
		return result;

	},

	check : function() {

		if(this._params.logic == 'not') {
			return (this.check = $.bindContext(function() {
				var dependence = this._params.dependencies[0];
				var check = dependence.check();				
				return {
					result : dependence._precheck() && !check.result,
					params : check.params
				};
			}, this))();
		}
		else {
			return (this.check = $.bindContext(function() {
				var checkLeft = this._params.dependencies[0].check(),
					checkRight = this._params.dependencies[1].check();
				return {
					result : this._params.logic == 'or'?
						checkLeft.result || checkRight.result :
						checkLeft.result && checkRight.result,
					params : this._params.logic == 'or'?
						this._onOr(checkLeft, checkRight) :
						this._onAnd(checkRight, checkRight)
				};
			}, this))();
		}

	},

	_onOr : function(checkLeft, checkRight) {

		return this._params.dependencies[0].__self._onOr(checkLeft, checkRight);

	},

	_onAnd : function(checkLeft, checkRight) {

		return this._params.dependencies[0].__self._onAnd(checkLeft, checkRight);

	}

});