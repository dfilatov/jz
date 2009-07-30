JZ.Dependence.Enabled = $.inherit(JZ.Dependence, {

	check : function() {

		var check = this.__base();
		check.params.focusOnEnable = check.result && this._params.focusOnEnable;
		return check;

	},

	_getDefaultParams : function() {

		return {
			focusOnEnable : false
		};

	}

});