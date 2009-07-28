JZ.Builder = $.inherit({

    __constructor : function(element) {

        this.element = element;
        this.widgets = [];
        this.widgetsByName = {};
        this.widgetsById = {};

    },

    build : function() {

        var _this = this, widget;
        $.each(this.element.find('.' + JZ.CSS_CLASS_WIDGET), function() {
            widget = _this._makeWidgetByElement($(this));
            _this.widgets.push(_this.widgetsById[widget.getId()] = widget);
        });

        // Строим хэш по именам после создании дерева виджетов, потому что имена некорорых виджетов зависят от детей
        var i = 0;
        while(widget = _this.widgets[i++]) {
            _this.widgets[widget.getName()] = widget;
        }

    },

    _makeWidgetByElement : function(element) {

        var params = $.isFunction(element[0].onclick)? element[0].onclick().jz || {} : {},
            result = new this.__self._elementToWidgetClass(element, this.__self._getClassElement(element));
            ;

        return result;

    }

}, {

    _getClassElement : function(element) {

        var tagName = element[0].tagName.toLowerCase();

        if(tagName == '')

        var parent = element;
        while(parent = parent.parent()) {
            if(parent.hasClass(JZ.CSS_CLASS_WIDGET)) {
                return;
            }
        }

    },

    _extractParamsFromElement : function(element) {

        var result = $.isFunction(element[0].onclick)? element[0].onclick().jz || {} : {};

        if(!result.type) {
            
        }


    },

    _elementToWidgetClass : function(element) {

        var result = this._cssClassToWidgetClass(element.attr('class'));
        if(result) {
            return result;
        }

        var tagName = element[0].tagName.toLowerCase();
        if(tagName == 'input') {
            return this._cssClassToWidgetClass('zf-text');
        }

    },

    _cssClassToWidgetClass : (function() {

        var cache = {}, typeRE = new RegExp(JZ.CSS_CLASS_WIDGET + '-(jz-number)'),
            classes = {
                'jz-text'   : JZ.Widget.Text,
                'jz-number' : JZ.Widget.Text.Number
            };
        return function(cssClass) {
            if(cache[cssClass]) {
                return cache[cssClass];
            }
            var result = cssClass.match(typeRE);
            if(result) {
                return cache[cssClass] = classes(result[1]);
            }
        };

    })()

});