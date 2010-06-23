JZ.Widget.Input.State = $.inherit(JZ.Widget.Input, {

	_bindEvents : function() {

		return this
			.__base()
			._bindToElem('click', this._onChange);

	},

	_onChange : function() {

		this.trigger('value-change', this);

	},

	_checkDependencies : function() {

		return this;

	},

	_setChecked : function(checked) {

		this._elem.attr('checked', checked);
		this[(checked? 'add' : 'remove') + 'CSSClass'](this.__self.CSS_CLASS_CHECKED);

	},

	_isChecked : function() {

		return this._elem.attr('checked');

	},

	_hasVal : function() {

		return false;

	}

}, {

	CSS_CLASS_CHECKED : JZ.CSS_CLASS_WIDGET + '-checked'

});