JZ.Widget.Container = $.inherit(JZ.Widget, {

	__constructor : function(element, classElement, params) {

		this.__base(element, classElement, params);

		this._children = [];

	},

	addChild : function(widget) {

		widget._parent = this;
		this._children.push(widget);

	},

	focus : function() {

		this._children[0] && this._children[0].focus();

	},

	init : function() {

		this._applyFnToChildren('init');
		this.__base();

	},

	enable : function(byParent) {

		this.__base(byParent);
		this._applyFnToChildren('enable', [true]);

	},

	disable : function() {

		this.__base();
		this._applyFnToChildren('disable');

	},

	_setForm : function(form) {

		this._applyFnToChildren('_setForm', arguments);
		this.__base(form);

	},

	_beforeSubmit : function() {

		this._applyFnToChildren('_beforeSubmit');
		this.__base();

	},

	_destruct : function() {

		this._applyFnToChildren('_destruct');
		this.__base();

		delete this._children;

	},

	_applyFnToChildren : function(name, args) {

		var children = this._children, i = 0, child;
		while(child = children[i++]) {
			child[name].apply(child, args);
		}

	}

});