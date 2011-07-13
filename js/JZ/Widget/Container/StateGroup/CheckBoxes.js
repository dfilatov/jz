JZ.Widget.Container.StateGroup.CheckBoxes = $.inherit(JZ.Widget.Container.StateGroup, {

	_createVal : function(val) {

		return new JZ.Value.Multiple(val);

	},

	_onChildChange : function(widget, index) {

		this._children[index]._setChecked(widget._isChecked());
		this._updateVal();

	},

	_extractValFromElem : function() {

		var result = [], children = this._children, child, i = 0;
		while(child = children[i++]) {
			child.isEnabled() && child._isChecked() && result.push(child._elem.val());
		}
		return result;

	},

	_setValToElem : function(value) {

		var children = this._children, child, i = 0;
		while(child = children[i++]) {
			child.isEnabled() && child._setChecked(value.isContain(child._elem.val()));
		}

	},

	_checkRequired : function(params) {

	 	return $.grep(this._children, function(child) {
			 return child.isEnabled() && child._isChecked();
	 	}).length >= params.min;

	}

});