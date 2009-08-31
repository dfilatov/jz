JZ.Widget.Button.Submit = $.inherit(JZ.Widget.Button, {

	_setForm : function(form) {

		this.__base(form);

		this._params.disableOnNoReady && form.bind('ready-change', $.bindContext(this._updateState, this));

	},

	_init : function() {

		this.__base();

	},

	_updateState : function(event, form) {

		this[form.isReady()? 'enable' : 'disable']();

	},

	_getDefaultParams : function() {

		return {
			disableOnNoReady : true,
			disableOnSubmit  : true
		};

	},

	_beforeSubmit : function() {

		this._params.disableOnSubmit && this.disable();

	},

	_checkDependencies : function() {}

});