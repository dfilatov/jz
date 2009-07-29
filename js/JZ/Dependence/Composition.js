JZ.Dependence.Composition= $.inherit(JZ.Dependence, {

	getFrom : function() {

		return $.map(this._params.dependencies, function(dependence) {
			return dependence.getFrom();
		});

	},

	check : function() {

		var check = this._params.dependencies[0].check();

		return {
			check  : check.result,
			params : $.makeArray(check.params)
		};

	}

});