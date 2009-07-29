JZ.Widget.Button.Submit = $.inherit(JZ.Widget.Button, {

	_setForm : function(form) {

		this.__base(form);
		form.bind('change-ready', this._onChangeReady, this);

	},

	_onChangeReady : function(event, isReady) {

		this[isReady? 'enable' : 'disable']();

	},

	_checkDependencies : function() {}

});