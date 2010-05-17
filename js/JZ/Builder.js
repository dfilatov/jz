JZ.Builder = $.inherit({

	__constructor : function() {

		this._widgets = [];
		this._widgetsByName = {};
		this._widgetsById = {};

	},

	build : function(element) {

		var _this = this, fromIndex = this._widgets.length, widget, initWidget;
		$.each(element.add(element.find('.' + JZ.CSS_CLASS_WIDGET)), function(i) {
			widget = _this._makeWidgetByElement($(this));
			_this._widgets.push(_this._widgetsById[widget.getId()] = widget);
			i == 0 && (initWidget = widget);
		});

		// Строим хэш по именам после создании дерева виджетов, потому что имена некоторых виджетов зависят от детей
		var i = fromIndex;
		while(widget = _this._widgets[i++]) {
			widget._hasValue() && (_this._widgetsByName[widget.getName()] = widget);
		}

		// Перебираем, строим зависимости, потому что только здесь знаем имена виджетов
		i = fromIndex;
		while(widget = _this._widgets[i++]) {
			this._buildDependencies(widget);
		}

		if(element[0].tagName.toLowerCase() == 'form') {
			element.data('jz-builder', this);
			initWidget
				.bind('remove', $.bindContext(this._onFormRemove, this))
				.init();
		}
		else {
			this._widgets[0].init(initWidget);
		}

		return initWidget;

	},

	_makeWidgetByElement : function(element) {

		var params = this.__self._extractParamsFromElement(element),
			result = new (this.__self._getWidgetClassByType(params.type))(element, this.__self._getClassElement(element, params), params);

		params.type != 'form' && this._getParentWidget(element).addChild(result);

		return result;

	},

	_getParentWidget : function(element) {

		return this._widgetsById[JZ._identifyElement(element.parents('.' + JZ.CSS_CLASS_WIDGET + ':first'))];

	},

	_buildDependencies : function(widget) {

		var params = widget._params, _this = this;
		$.each(['enabled', 'valid', 'required'], function() {
			this in params && widget.addDependence(this, _this._buildDependence(this, widget, params[this]));
		});

	},

	_buildDependence : function(type, widget, data) {

		return $.isArray(data)?
			(typeof data[0] == 'string'?
				new JZ.Dependence.Composition.NOT({ dependencies : [this._buildDependence(type, widget, data[1])] }) :
				new JZ.Dependence.Composition[data[1].toUpperCase()]({ dependencies :
					[this._buildDependence(type, widget, data[0]), this._buildDependence(type, widget, data[2])] })) :
			this[this.__self._dependenceTypeToFn(type)](widget, data);

	},

	_buildEnabledDependence : function(widget, data) {

		return new JZ.Dependence.Enabled($.extend(data, { widget : this._getFromWidget(data, widget) }));

	},

	_buildRequiredDependence : function(widget, data) {

		return new JZ.Dependence.Required($.extend(data, { widget : this._getFromWidget(data, widget) }));

	},

	_buildValidDependence : function(widget, data) {

		return new JZ.Dependence.Valid($.extend(data, { widget : this._getFromWidget(data, widget) }));

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

		!result && JZ._throwException('widget with name/id = "' + (params.id || params.name) + '" not found"');

		return result;

	},

	_onFormRemove : function(event, form) {

		form.getElement().removeData('jz-builder');

		delete this._widgets;
		delete this._widgetsByName;
		delete this._widgetsById;

	}

},
{

	registerWidget : function(type, parentType, props, staticProps) {

		this._types.push(type);
		this._typeToWidgetClass[type] = $.inherit(this._getWidgetClassByType(parentType), props, staticProps);

	},

	_getClassElement : function(element, params) {

		if(params.container) {
			return element.closest(params.container);
		}

		switch(params.type) {
			case 'form':
			case 'fieldset':
			case 'button':
			case 'submit':
				return element;

			case 'rbgroup':
			case 'cbgroup':
			case 'state':
				return element.parent();

			default:
				return element.parent().parent();
		}

	},

	_extractParamsFromElement : function(element) {

		var result = $.isFunction(element[0].onclick) ? element[0].onclick().jz || {} : {};

		if(!result.type) {
			result.type = this._extractTypeFromElement(element);
		}

		if(result.type == 'combo') {
			var arrow = element.parent().find('.' + JZ.CSS_CLASS_WIDGET + '-comboarrow');
			!!arrow.length && (result.arrow = arrow);
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

				case 'image':
				case 'submit':
					return 'submit';
			}
		}

		if(tagName == 'select' || tagName == 'fieldset' || tagName == 'form') {
			return tagName;
		}

		return this._cssClassToType(element.attr('class')) || 'text';

	},

	_types : ['number', 'combo', 'datetime', 'date', 'fieldset', 'rbgroup', 'cbgroup', 'submit'],
	_typeRE : null,

	_rebuildTypeRE : function() {

		return this._typeRE = new RegExp(JZ.CSS_CLASS_WIDGET + '-(' + this._types.join('|') +')');

	},

	_cssClassToType : $.memoize(function(cssClass) {

		return (cssClass.match(this._typeRE || this._rebuildTypeRE()) || [])[1];

	}),

	_typeToWidgetClass : {
		'text'	   : JZ.Widget.Input.Text,
		'number'   : JZ.Widget.Input.Text.Number,
		'combo'    : JZ.Widget.Input.Text.Combo,
		'select'   : JZ.Widget.Input.Select,
		'date'     : JZ.Widget.Container.Date,
		'datetime' : JZ.Widget.Container.Date.Time,
		'state'    : JZ.Widget.Input.State,
		'submit'   : JZ.Widget.Button.Submit,
		'fieldset' : JZ.Widget.Container,
		'rbgroup'  : JZ.Widget.Container.StateGroup.RadioButtons,
		'cbgroup'  : JZ.Widget.Container.StateGroup.CheckBoxes,
		'form'	   : JZ.Widget.Container.Form
	},

	_getWidgetClassByType : function(type) {

		return this._typeToWidgetClass[type] || JZ._throwException('undefined type "' + type + '"');

	},

	_dependenceTypeToFn : $.memoize(function(type) {

		return '_build' + type.charAt(0).toUpperCase() + type.substr(1).toLowerCase() + 'Dependence';

	})

});