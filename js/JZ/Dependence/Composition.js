JZ.Dependence.Composition= $.inherit(JZ.Dependence, {

	getFrom : function() {

		var result = [];
		return $.each(this._params.dependencies, function() {
			result.concat(this.getFrom());
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