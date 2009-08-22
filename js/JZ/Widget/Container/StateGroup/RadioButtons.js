JZ.Widget.Container.StateGroup.RadioButtons = $.inherit(JZ.Widget.Container.StateGroup, {

	__constructor : function() {

		this.__base.apply(this, arguments);
		this._checkedIndex = -1;

	},

	addChild : function(widget) {

		this.__base.apply(this, arguments);
		widget._isChecked() && (this._checkedIndex = this._children.length - 1);

	},

	_onChildChange : function(checked, index) {

		this._checkedIndex > -1 && this._children[this._checkedIndex]._setChecked(false);
		this._children[this._checkedIndex = index]._setChecked(true);
		this._updateValue();

	},

	_extractValueFromElement : function() {

		return this._checkedIndex > -1? this._children[this._checkedIndex]._element.val() : '';

	}

});