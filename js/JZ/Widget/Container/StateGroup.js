JZ.Widget.Container.StateGroup = $.inherit(JZ.Widget.Container, {

	addChild : function(widget) {

		var index = this.__base(widget)._children.length - 1;
		this._bindTo(widget, 'value-change', function() {
			this._onChildChange(widget, index);
		});

	},

	_hasVal : function() {

		return true;

	},

	_extractName : function() {

		var firstChild = this._children[0];
		return firstChild? firstChild.getName() : null;

	},

	_onChildChange : function() {}

});