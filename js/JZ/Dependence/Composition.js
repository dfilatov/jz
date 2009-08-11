JZ.Dependence.Composition = $.inherit(JZ.Dependence, {

	getFrom : function() {

		var result = [];
		$.each(this._params.dependencies, function() {
			result = result.concat(this.getFrom());
		});
		return result;

	}

});