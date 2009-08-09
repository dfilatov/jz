JZ.Dependence.Enabled = $.inherit(JZ.Dependence, {

	_processParams : function(result) {

		return {
			focusOnEnable : result && this._params.focusOnEnable
		};

	},

	_getDefaultParams : function() {

		return {
			focusOnEnable : false
		};

	}

}, {

	_onOr : function(checkLeft, checkRight) {

		return {
			focusOnEnable : checkLeft.params.focusOnEnable || checkRight.params.focusOnEnable
		};

	},

	_onAnd : function(checkLeft, checkRight) {

		return {
			focusOnEnable : checkLeft.params.focusOnEnable && checkRight.params.focusOnEnable
		};

	}

});