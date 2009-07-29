JZ.Builder = $.inherit({

	__constructor : function(element) {

		this._element = element;
		this._widgets = [];
		this._widgetsByName = {};
		this._widgetsById = {};

	},

	build : function() {

		var _this = this, widget;
		$.each(this._element.add(this._element.find('.' + JZ.CSS_CLASS_WIDGET)), function() {
			widget = _this._makeWidgetByElement($(this));
			_this._widgets.push(_this._widgetsById[widget.getId()] = widget);
		});

		// Строим хэш по именам после создании дерева виджетов, потому что имена некорорых виджетов зависят от детей
		var i = 0, name;
		while(widget = _this._widgets[i++]) {
			name = widget.getName();
			name && (_this._widgetsByName[name] = widget);
		}

		// Перебираем, строим зависимости, потому что только здесь знаем имена виджетов
		i = 0;
		while(widget = _this._widgets[i++]) {
			this._buildDependencies(widget);
		}

		var result = this._widgets[0];

		delete this._element;
		delete this._widgets;
		delete this._widgetsByName;
		delete this._widgetsById;

		result.init();

		return result;

	},

	_makeWidgetByElement : function(element) {

		var params = this.__self._extractParamsFromElement(element),
				result = new (this.__self._typeToWidgetClass(params.type))(element, this.__self._getClassElement(element, params), params);

		params.type != 'form' && this._getParentWidget(element).addChild(result);

		return result;

	},

	_getParentWidget : function(element) {

		return this._widgetsById[JZ._identifyElement(element.parents('.' + JZ.CSS_CLASS_WIDGET + ':first'))];

	},

	_buildDependencies : function(widget) {

		var params = widget._params, _this = this;

		$.each(['enabled', 'valid', 'required'], function() {
			if(this in params) {
				widget.addDependence(this, _this._buildDependence(this, widget, params[this]));
			}
		});

	},

	_buildDependence : function(type, widget, data) {

		return $.isArray(data)?
			new JZ.Dependence.Composition({
				logic        : data[typeof data[0] == 'string'? 0 : 1],
				dependencies : typeof data[0] == 'string'?
					[this._buildDependence(type, widget, data[1])] :
					[this._buildDependence(type, widget, data[0]), this._buildDependence(type, widget, data[2])]
			}) :
			this[this.__self._dependenceTypeToFn(type)](widget, data);

	},

	_buildEnabledDependence : function(widget, data) {

		return new JZ.Dependence($.extend(data, { widget : this._getFromWidget(data, widget) }));

	},

	_buildRequiredDependence : function(widget, data) {

		return new JZ.Dependence.Required($.extend(data, { widget : this._getFromWidget(data, widget) }));

	},

	_getFromWidget : function(params, widget) {

		var result;

		if(params.id) {
			result = this._widgetsById[params.id];
		}
		else if(params.name) {
			result = this._widgetsByName[params.name];
		}
		else {
			return widget;
		}

		if(!result) {
			JZ._throwException('widget with name/id = "' + (params.id || params.name) + '" not found"');
		}

		return result;

	}

},
{

	_getClassElement : function(element, params) {

		if(params.container) {
			return element.closest(params.container);
		}

		switch(params.type) {
			case 'form':
			case 'fieldset':
			case 'button':
				return element;
			break;

			case 'state':
				return element.parent();
			break;

			default:
				return element.parent().parent();
		}

	},

	_extractParamsFromElement : function(element) {

		var result = $.isFunction(element[0].onclick) ? element[0].onclick().jz || {} : {};

		if(!result.type) {
			result.type = this._extractTypeFromElement(element);
		}

		return result;

	},

	_extractTypeFromElement : function(element) {

		var tagName = element[0].tagName.toLowerCase();

		if(tagName == 'input') {
			switch(element.attr('type')) {
				case 'radio':
				case 'checkbox':
					return 'state';
				break;

				case 'image':
				case 'submit':
					return 'submit';
				break;
			}
		}

		if(tagName == 'select' || tagName == 'fieldset' || tagName == 'form') {
			return tagName;
		}

		return this._cssClassToType(element.attr('class')) || 'text';

	},

	_cssClassToType : (function() {

		var cache = {}, typeRE = new RegExp(JZ.CSS_CLASS_WIDGET + '-(number|submit)');
		return function(cssClass) {
			if(cache[cssClass]) {
				return cache[cssClass];
			}
			var result = cssClass.match(typeRE);
			if(result) {
				return cache[cssClass] = result[1];
			}
		};

	})(),

	_typeToWidgetClass : (function() {

		var classes = {
			'text'	   : JZ.Widget.Text,
			'number'   : JZ.Widget.Text.Number,
			'submit'   : JZ.Widget.Button.Submit,
			'fieldset' : JZ.Widget.Container,
			'form'	   : JZ.Widget.Container.Form
		};

		return function(type) {
			return classes[type] || JZ._throwException('undefined type "' + type + '"');
		};

	})(),

	_dependenceTypeToFn : (function() {

		var fns = {};

		return function(type) {
			return fns[type] || (fns[type] = '_build' + type.charAt(0).toUpperCase() + type.substr(1).toLowerCase() + 'Dependence');
		};

	})()

});