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

	},

	_setValueToElement : function(value) {

		var child, i = 0;
		while(child = this._children[i++]) {
			if(value.get() === child._element.val()) {
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