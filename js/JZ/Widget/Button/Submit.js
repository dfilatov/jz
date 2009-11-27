JZ.Widget.Button.Submit = $.inherit(JZ.Widget.Button, {

	_setForm : function(form) {

		this.__base(form);
		this._params.disableOnNoReady?
			this._bindTo(form, 'ready-change', this._updateState) :
			this.enable();

	},

	_reinit : function() {

		this.__base()._params.disableOnNoReady && this._updateState();
		return this;

	},

	_updateState : function() {

		this[this._form.isReady()? 'enable' : 'disable']();

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

	_checkDependencies : function() {

		return this;

	}

});