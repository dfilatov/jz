JZ.Widget.Container.StateGroup.CheckBoxes = $.inherit(JZ.Widget.Container.StateGroup, {

	_createValue : function(value) {

		return new JZ.Value.Multiple(value);

	},

	_onChildChange : function(widget, index) {

		this._children[index]._setChecked(widget._isChecked());
		this._updateValue();

	},

	_extractValueFromElem : function() {

		var result = [], child, i = 0;
		while(child = this._children[i++]) {
			child.isEnabled() && child._isChecked() && result.push(child._elem.val());
		}
		return result;

	},

	_setValueToElem : function(value) {

		var child, i = 0;
		while(child = this._children[i++]) {
			child.isEnabled() && child._setChecked(value.isContain(child._elem.val()));
		};

	},

	_checkRequired : function(params) {

	 	return $.grep(this._children, function(child) {
			 return child.isEnabled() && child._isChecked();
	 	}).length >= params.min;

	}

});