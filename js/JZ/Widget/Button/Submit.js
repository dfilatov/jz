JZ.Widget.Button.Submit = $.inherit(JZ.Widget.Button, {

	reset : function() {

		return this
			.__base()
			._updateState();

	},

	_setForm : function(form) {

		this.__base(form);
		this._params.disableOnNoReady?
			this._bindTo(form, 'ready-change', this._updateState) :
			this.enable();

	},

	_reinit : function() {

		return this
			.__base()
			._updateState();

	},

	_updateState : function() {

		return this[this._form.isReady() || !this._params.disableOnNoReady? 'enable' : 'disable']();

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