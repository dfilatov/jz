JZ.DependenceComposition = $.inherit({

	__constructor : function(dependence1, relation, dependence2) {

		this._dependence1 = dependence1;
		this._relation = relation;
		this._dependence2 = dependence2;

	},

	check : function() {

		var check1 = dependence1.check(),
			check2 = dependence2.check(),
			params1 = check1.params? ($.isArray(check1.params)? check1.params : [check1.params]) : [],
			params2 = check2.params? ($.isArray(check2.params)? check2.params : [check2.params]) : [];

		return {
			check  : this._relation == 'or'? check1.result || check2.result : check1.result && check2.result,
			params : params1.concat(params2)
		};

	}

});