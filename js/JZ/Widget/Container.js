JZ.Widget.Container = $.inherit(JZ.Widget, {

	__constructor : function() {

		this.__base.apply(this, arguments);

		this._children = [];

	},

	addChild : function() {

		var i = 0, child;
		while(child = arguments[i++]) {
			(child._parent = this)._children.push(child);
		}
		return this;

	},

	focus : function() {

		var firstChild = this._children[0];
		firstChild && firstChild.focus();
		return this;

	},

	enable : function(byParent) {

		return this
			.__base(byParent)
			._applyFnToChildren('enable', [true]);

	},

	disable : function() {

		return this
			.__base()
			._applyFnToChildren('disable');

	},

	reset : function() {

		return this
			.__base()
			._applyFnToChildren('reset');

	},

	_removeChild : function(widget) {

		var children = this._children, i = 0, child;
		while(child = children[i++]) {
			if(child === widget) {
				children.splice(i - 1, 1);
				return true;
			}
		}
		return false;

	},

	_init : function() {

		this
			._applyFnToChildren('_init')
			.__base();

		var children = this._children, i = 0, child;
		while(child = children[i++]) {
			this._bindChildEvents(child);
		}
		return this;

	},

	_reinit : function() {

		return this
			._applyFnToChildren('_reinit')
			.__base();

	},

	_bindChildEvents : function(widget) {

		this._hasVal() || this._bindTo(widget, 'value-change enable disable', this._onChildChange);

	},

	_onChildChange : function() {

		this.trigger('value-change', this);

	},

	_setForm : function(form) {

		return this
			._applyFnToChildren('_setForm', arguments)
			.__base(form);

	},

	_checkDependencies : function(onlyType, recursively) {

		this.__base(onlyType, recursively);
		recursively && this._applyFnToChildren('_checkDependencies', arguments);
		return this;

	},

	_beforeSubmit : function() {

		this
			._applyFnToChildren('_beforeSubmit')
			.__base();

	},

	_checkRequired : function(params) {

		if(this._hasVal()) {
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
				child._checkRequired(params) || ++countRequiredChild;
				params.pattern = pattern;
			}
		}
		return countRequiredChild == 0;

	},

	_processFirstUnreadyWidget : function() {

		var baseResult = this.__base();
		if(baseResult || this._hasVal()) {
			return baseResult;
		}

		return this._processFirstUnreadyChildWidget();

	},

	_processFirstUnreadyChildWidget : function() {

		var children = this._children, i = 0, child, unreadyWidget;
		while(child = children[i++]) {
			if(unreadyWidget = child._processFirstUnreadyWidget()) {
				return unreadyWidget;
			}
		}

	},

	_destruct : function() {

		this
			._applyFnToChildren('_destruct')
			.__base();

		delete this._children;

	},

	_triggerRemove : function() {

		return this
			._applyFnToChildren('_triggerRemove')
			.__base();

	},

	_applyFnToChildren : function(name, args) {

		var children = this._children, i = 0, child;
		while(child = children[i++]) {
			child[name].apply(child, args || []);
		}
		return this;

	}

});