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

	enable : function() {

		this._applyFnToChildren('enable');
		this.__base();

	},

	disable : function() {

		this._applyFnToChildren('disable');
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