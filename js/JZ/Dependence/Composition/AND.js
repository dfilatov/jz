JZ.Dependence.Composition.AND = $.inherit(JZ.Dependence.Composition, {

	check : function() {

		var checkLeft = this._params.dependencies[0].check(),
			checkRight = this._params.dependencies[1].check();

		return {
			check  : checkLeft.result && checkRight.result,
			params : $.makeArray(checkLeft.params).concat($.makeArray(checkRight.params))
		};

	}

});