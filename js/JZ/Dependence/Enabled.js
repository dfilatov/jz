JZ.Dependence.Enabled = $.inherit(JZ.Dependence, {

	_processParams : function(result) {

		return {
			focusOnEnable : result && this._params.focusOnEnable,
			hideOnDisable : !result && this._params.hideOnDisable
		};

	},

	_getDefaultParams : function() {

		return {
			focusOnEnable : false,
			hideOnDisable : false
		};

	}

}, {

	_onOR : function(checkLeft, checkRight) {

		return {
			focusOnEnable : checkLeft.params.focusOnEnable || checkRight.params.focusOnEnable,
			hideOnDisable : checkLeft.params.hideOnDisable || checkRight.params.hideOnDisable
		};

	},

	_onAND : function(checkLeft, checkRight) {

		return {
			focusOnEnable : checkLeft.params.focusOnEnable && checkRight.params.focusOnEnable,
			hideOnDisable : checkLeft.params.hideOnDisable && checkRight.params.hideOnDisable
		};

	}

});