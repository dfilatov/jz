JZ.Dependence.Valid = $.inherit(JZ.Dependence, {

	_preprocessParams : function(params) {

		params.type == 'email' && (params.pattern = /^[a-zA-Z0-9][a-zA-Z0-9\.\-\_\~]*\@[a-zA-Z0-9\.\-\_]+\.[a-zA-Z]{2,4}$/);
		return params;

	},

	_processResult : function() {

		return (!this._params.checkEmpty && this._params.widget._getVal().isEmpty()) ||
			   this.__base();

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

		return $.extend(this.__base(), {
			checkEmpty : false
		});

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