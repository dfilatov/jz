JZ.Widget.Input.Select = $.inherit(JZ.Widget.Input, {

	_bindEvents : function() {

		return this
			.__base()
			._bindToElement('change', this._onChange);

	},

	_onChange : function() {

		this._updateValue();

	},

	_processValue : function(value) {

		var clone = this._element.clone();
		clone.val(value.get()) !== value.get() && value.set(clone.val());
		return value;

	}

});