JZ.Dependence.Valid = $.inherit(JZ.Dependence, {

	_precheck : function() {

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

	_onOR : function(checkLeft, checkRight) {

		return {
			invalidCSSClasses : checkLeft.params.invalidCSSClasses.concat(checkRight.params.invalidCSSClasses)
		};

	},

	_onAND : function(checkLeft, checkRight) {

		return this._onOR(checkLeft, checkRight);

	}

});