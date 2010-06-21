JZ.Widget.Container.StateGroup = $.inherit(JZ.Widget.Container, {

	addChild : function(widget) {

		var index = this.__base.apply(this, arguments)._children.length - 1;
		this._bindTo(widget, 'value-change', function() {
			this._onChildChange(widget, index);
		});

	},

	_hasValue : function() {

		return true;

	},

	_extractName : function() {

		return !!this._children.length? this._children[0].getName() : null;

	},

	_onChildChange : function(widget, index) {}

});