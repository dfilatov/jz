JZ.Widget.Input.Select = $.inherit(JZ.Widget.Input, {

	_bindEvents : function() {

		this.__base();
		this._element.bind('change', $.bindContext(this._onChange, this));

	},

	_onChange : function() {

		this._updateValue();

	}

});