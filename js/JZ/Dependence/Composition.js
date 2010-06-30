JZ.Dependence.Composition = $.inherit(JZ.Dependence, {

	getFrom : function() {

		var result = [];
		$.each(this._params.dependencies, function() {
			result = result.concat(this.getFrom());
		});
		return result;

	},

	removeFrom : function(widget) {

		var dependencies = [];
		$.each(this._params.dependencies, function() {
			var dependence = this.removeFrom(widget);
			dependence && dependencies.push(dependence);
		});
		var len = dependencies.length;
		return len?
			len == 1 && this._params.dependencies.length > 1?
				dependencies[0] :
				this :
			null;

	}


});