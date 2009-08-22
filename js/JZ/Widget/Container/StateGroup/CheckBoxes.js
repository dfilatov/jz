JZ.Widget.Container.StateGroup.CheckBoxes = $.inherit(JZ.Widget.Container.StateGroup, {

	createValue : function(value) {

		return new JZ.Value.Multiple(value);

	},

	_onChildChange : function(checked, index) {

		this._children[index]._setChecked(checked);
		this._updateValue();

	},

	_extractValueFromElement : function() {

		var result = [], child, i = 0;
		while(child = this._children[i++]) {
			child.isEnabled() && child._isChecked() && result.push(child._element.val());
		}
		return result;

	},

	_setValueToElement : function(value) {

		var child, i = 0;
		while(child = this._children[i++]) {
			child.isEnabled() && child._setChecked(value.isContain(child._element.val()));
		};

	}

});