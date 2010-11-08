JZ.Widget.Container.StateGroup.RadioButtons = $.inherit(JZ.Widget.Container.StateGroup, {

	__constructor : function() {

		this.__base.apply(this, arguments);
		this._checkedIndex = -1;

	},

	addChild : function(widget) {

		this.__base.apply(this, arguments);
		widget._isChecked() && (this._checkedIndex = this._children.length - 1);

	},

	_onChildChange : function(widget, index) {

		var children = this._children;
		this._checkedIndex > -1 && children[this._checkedIndex]._setChecked(false);
		children[this._checkedIndex = index]._setChecked(true);
		this._updateVal();

	},

	_extractValFromElem : function() {

		var checkedIndex = this._checkedIndex;
		return checkedIndex > -1? this._children[checkedIndex]._elem.val() : '';

	},

	_setValToElem : function(val) {

		val = val.get();

		var children = this._children, child, i = 0;
		while(child = children[i++]) {
			if(val === child._elem.val()) {
				this._checkedIndex = i - 1;
				return child._setChecked(true);
			}
			else if(child._isChecked()) {
				child._setChecked(false);
			}
		};
		this._checkedIndex = -1;

	}

});