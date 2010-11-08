JZ.Widget.Input.Select = $.inherit(JZ.Widget.Input, {

	_bindEvents : function() {

		return this
			.__base()
			._bindToElem('change', this._onChange);

	},

	_onChange : function() {

		this._updateVal();

	},

	_processVal : function(val) {

		var clone = this._elem.clone();
		clone.val(val.get()) !== val.get() && val.set(clone.val());
		return val;

	}

});