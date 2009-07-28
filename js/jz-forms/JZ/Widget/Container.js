JZ.Widget.Container = $.inherit(JZ.Widget, {

    __constructor : function(element, classElement, params) {

        this.__base(element, classElement, params);

        this.children = [];

    },

    addChild : function(widget) {

        this.children.push(widget);

    },

    focus : function() {

        this.children[0] && this.children[0].focus();

    },

    _init : function() {

        this._applyFnToChildren('_init');

    },

    _applyFnToChildren : function(name, args) {

        var children = this.children, i = 0, child;
        while(child = children[i++]) {
            child[name].apply(child, args);
        }

    }

});