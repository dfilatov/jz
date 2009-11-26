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
		return this;

	},

	enable : function(byParent) {

		this.__base(byParent);
		this._applyFnToChildren('enable', [true]);
		return this;

	},

	disable : function() {

		this.__base();
		this._applyFnToChildren('disable');
		return this;

	},

	reset : function() {

		this.__base();
		this._applyFnToChildren('reset');
		return this;

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

		this._applyFnToChildren('_init');
		this.__base();

		var children = this._children, i = 0, child;
		while(child = children[i++]) {
			this._bindChildEvents(child);
		}

	},

	_reinit : function() {

		this._applyFnToChildren('_reinit');
		return this.__base();

	},

	_bindChildEvents : function(widget) {

		!this._hasValue() && this._bindTo(widget, 'value-change enable disable', this._onChildChange);

	},

	_onChildChange : function() {

		this.trigger('value-change', this);

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

	_processFirstUnreadyWidget : function() {

		if(this._hasValue()) {
			return this.__base();
		}

		var children = this._children, i = 0, child, unreadyWidget;
		while(child = children[i++]) {
			if(unreadyWidget = child._processFirstUnreadyWidget()) {
				return unreadyWidget;
			}
		}

	},

	_destruct : function() {

		this._applyFnToChildren('_destruct');
		this.__base();

		delete this._children;

	},

	_triggerRemove : function() {

		this._applyFnToChildren('_triggerRemove');
		return this.__base();

	},

	_applyFnToChildren : function(name, args) {

		var children = this._children, i = 0, child;
		while(child = children[i++]) {
			child[name].apply(child, args || []);
		}

	}

});