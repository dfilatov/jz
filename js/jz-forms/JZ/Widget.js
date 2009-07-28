JZ.Widget = $.inherit(JZ.Observable, {

    __constructor : function(element, classElement, params) {

        this.element = element;
        this.classElement = classElement || element;
        this.params = $.extend(this._getDefaultParams(), params);

    },

    getId : function() {

        var result = JZ._identifyElement(this.element);

        return (this.getId = function() {
            return result;
        })();

    },

    getName : function() {

        return element.attr('name');

    },

    focus : function() {

        this.element.focus();

    },

    addChild : function(widget) {},

    _getDefaultParams : function() {

        return {
            focusOnInit : false
        };

    },

    _init : function() {

        if(this.params.focusOnInit) {
            this.focus();
        }

    }

});