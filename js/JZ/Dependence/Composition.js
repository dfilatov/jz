JZ.Dependence.Composition= $.inherit(JZ.Dependence, {

	getFrom : function() {

		var result = [];
		$.each(this._params.dependencies, function() {
			result.concat(this.getFrom());
		});
		return result;

	},

	check : function() {

		var check = this._params.dependencies[0].check();

		return {
			check  : check.result,
			params : $.makeArray(check.params)
		};

	}

});