JZ.Widget.Button.Submit = $.inherit(JZ.Widget.Button, {

	_setForm : function(form) {

		this.__base(form);
		form.bind('ready-change', $.bindContext(this._onReadyChange, this));

	},

	_onReadyChange : function(event, isReady) {

		this[isReady? 'enable' : 'disable']();

	},

	_checkDependencies : function() {}

});