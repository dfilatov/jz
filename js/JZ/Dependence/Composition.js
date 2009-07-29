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
			(this.check = function() {
				var check = this._params.dependencies[0].check();
				return {
					check  : !check.result,
					params : $.makeArray(check.params)
				};
			})();
		}
		else {
			(this.check = function() {
				var checkLeft = this._params.dependencies[0].check(),
					checkRight = this._params.dependencies[1].check();

				return {
					check  : this._params.logic == 'or'?
						checkLeft.result || checkRight.result :
						checkLeft.result && checkRight.result,
					params : $.makeArray(checkLeft.params).concat($.makeArray(checkRight.params))
				};
			})();
		}

	}

});