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
				var check = this._params.dependencies[0].check();
				return {
					result : !check.result,
					params : $.makeArray(check.params)
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
					params : $.makeArray(checkLeft.params).concat($.makeArray(checkRight.params))
				};
			}, this))();
		}

	}

});