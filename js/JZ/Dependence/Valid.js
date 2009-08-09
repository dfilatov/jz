JZ.Dependence.Valid = $.inherit(JZ.Dependence, {

	__precheck : function() {

		return this.__base() && !(this._params.bCheckEmpty && this._params.widget.getValue().isEmpty());

	},

	_processParams : function(result) {

		return {
			invalidCSSClasses : [!!this._params.invalidCSSClass?
				{ name : this._params.invalidCSSClass, add : !result } :
				{}
			]
		};

	},

	_getDefaultParams : function() {

		return {
			bCheckEmpty : false
		};

	}

}, {

	_onOr : function(checkLeft, checkRight) {

		return {
			invalidCSSClasses : checkLeft.params.invalidCSSClasses.concat(checkRight.params.invalidCSSClasses)
		};

	},

	_onAnd : function(checkLeft, checkRight) {

		return this._onOr(checkLeft, checkRight);

	}

});