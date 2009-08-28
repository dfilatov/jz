JZ.Widget.Container = $.inherit(JZ.Widget, {

	__constructor : function() {

		this.__base.apply(this, arguments);

		this._children = [];

	},

	addChild : function(widget) {

		widget._parent = this;
		this._children.push(widget);
		return this;

	},

	focus : function() {

		this._children[0] && this._children[0].focus();

	},

	enable : function(byParent) {

		this.__base(byParent);
		this._applyFnToChildren('enable', [true]);

	},

	disable : function() {

		this.__base();
		this._applyFnToChildren('disable');

	},

	_init : function() {

		this._applyFnToChildren('_init');
		this.__base();

		var children = this._children, i = 0, child;
		while(child = children[i++]) {
			this._bindChildEvents(child);
		}

	},

	_bindChildEvents : function(widget) {

		!this._hasValue() && widget.bind('value-change enable disable', $.bindContext(function() {
			this.trigger('value-change', this);
		}, this));

	},

	_setForm : function(form) {

		this._applyFnToChildren('_setForm', arguments);
		this.__base(form);

	},

	_beforeSubmit : function() {

		this._applyFnToChildren('_beforeSubmit');
		this.__base();

	},

	_checkRequired : function(params) {

		if(this._hasValue()) {
			return this.__base(params);
		}

		var children = this._children, i = 0, child, countRequiredChild = 0;
		while(child = children[i++]) {
			if(child._dependencies['required']) {
				child.isRequired() && ++countRequiredChild;
			}
			else {
				var pattern = params.pattern;
				params.pattern = params.patternChild;
				!child._checkRequired(params) && ++countRequiredChild;
				params.pattern = pattern;
			}
		}
		return countRequiredChild == 0;

	},

	_destruct : function() {

		this._applyFnToChildren('_destruct');
		this.__base();

		delete this._children;

	},

	_applyFnToChildren : function(name, args) {

		var children = this._children, i = 0, child;
		while(child = children[i++]) {
			child[name].apply(child, args || []);
		}

	}

});