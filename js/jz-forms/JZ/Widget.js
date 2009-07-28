JZ.Widget = $.inherit(JZ.Observable, {

    __constructor : function(element, classElement, params) {

        this.element = element;
        this.classElement = classElement || element;
        this.params = $.extend(this._getDefaultParams(), params);

    },

    focus : function() {

        this.element.focus();

    },

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