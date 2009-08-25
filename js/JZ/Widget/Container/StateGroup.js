JZ.Widget.Container.StateGroup = $.inherit(JZ.Widget.Container, {

	addChild : function(widget) {

		this.__base.apply(this, arguments);
		var index = this._children.length - 1;
		widget.bind('value-change', function(event, checked) {
			this._onChildChange(widget, index);
		}, this);

	},

	_hasValue : function() {

		return true;

	},

	_extractName : function() {

		return !!this._children.length? this._children[0].getName() : null;

	},

	_onChildChange : function(widget, index) {}

});