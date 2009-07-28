var JZ = {

    CSS_CLASS_WIDGET : 'jz',

    build : function(element) {

        return new this.Builder(element).build();

    },

    _identifyElement : (function() {

        var counter = 1;
        return function(element) {
            return element.attr('id') || element.__id || (element.__id = counter++);
        };

    })()

};