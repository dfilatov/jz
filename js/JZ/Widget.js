JZ.Widget = $.inherit(JZ.Observable, {

	__constructor : function(element, classElement, params) {

		this._element = element.data('jz', this);
		this._classElement = classElement || element;
		this._params = $.extend(this._getDefaultParams(params), params);
		this._parent = this._form = null;
		this._isInited = this._isRequired = false;
		this._isValid = true;
		this._isEnabled = !this._element.attr('disabled');
		this._value = this._initialValue = null;
		this._dependencies = {};
		this._dependFromIds = {};

	},

	getElement : function() {

		return this._element;

	},

	getId : $.memoize(function() {

		return JZ._identifyElement(this._element);

	}),

	getName : $.memoize(function() {

		return this._extractName();

	}),

	focus : function() {

		this._element[0].focus();
		return this;

	},

	hasCSSClass : function(name) {

		return this._classElement.hasClass(name);

	},

	addCSSClass : function(name) {

		this._classElement.addClass(name);
		return this;

	},

	removeCSSClass : function(name) {

		this._classElement.removeClass(name);
		return this;

	},

	replaceCSSClass : function(nameFrom, nameTo) {

		this.hasCSSClass(nameFrom) && this.removeCSSClass(nameFrom);
		return this.addCSSClass(nameTo);

	},

	init : function() {

		// TODO
		return this._isInited?
			this._reinit() :
			this._init();

	},

	isRequired : function() {

		return this._isRequired;

	},

	isValid : function() {

		return this._isValid;

	},

	isReady : function() {

		return !this.isEnabled() || (!this.isRequired() && this.isValid());

	},

	isEnabled : function() {

		return this._isEnabled;

	},

	show : function() {

		return this.removeCSSClass(this.__self.CSS_CLASS_INVISIBLE);

	},

	hide : function() {

		return this.addCSSClass(this.__self.CSS_CLASS_INVISIBLE);

	},

	enable : function(byParent) {

		if(this.isEnabled() || !this._parent.isEnabled()) {
			return this;
		}

		if(byParent && this._dependencies['enabled']) {
			return this._checkDependencies('enabled');
		}

		this._enableElements();
		var isReady = this.removeCSSClass(this.__self.CSS_CLASS_DISABLED).isReady();
		this._isEnabled = true;
		isReady != this.isReady() && this.trigger('ready-change', this);
		this._isInitialValueChanged() && this.trigger('initial-value-change', true);
		return this.trigger('enable', this);

	},

	disable : function() {

		if(!this.isEnabled()) {
			return this;
		}

		this._disableElements();
		this.addCSSClass(this.__self.CSS_CLASS_DISABLED);
		var isReady = this.isReady();
		this._isEnabled = false;
		isReady != this.isReady() && this.trigger('ready-change', this);
		this._isInitialValueChanged() && this.trigger('initial-value-change', false);
		return this.trigger('disable', this);

	},

	getValue : function() {

		return this._value.get();

	},

	setValue : function(value) {

		return this._setValue(this._processValue(this._createValue(value)));

	},

	addDependence : function(type, dependence) {

		this._dependencies[type] = dependence;

		var _this = this;
		$.each(dependence.getFrom(), function() {
			if(_this._dependFromIds[this.getId()]) {
				return;
			}
			_this
				._bindTo(this, 'value-change enable disable', this._onChangeDependFromWidget)
				._bindTo(this, 'remove', this._onRemoveDependFromWidget)
				._dependFromIds[this.getId()] = true;
		});

	},

	remove : function(fromDOM) {

		this._triggerRemove()._parent && this._parent._removeChild(this);
		var classElement = this._classElement;
		this._destruct();
		fromDOM && classElement.remove();

	},

	reset : function() {

		if(this._hasValue()) {
			this._setNoReady(false);
			this._setValue(this._initialValue);
		}
		return this;

	},

	addChild : function(widget) {},

	_bindTo : function(observable, type, data, fn) {

		if($.isFunction(data)) {
			fn = data;
			data = null;
		}

		observable.bind(type, data, $.bindContext(fn, this));
		return this;

	},

	_bindToElement : function(type, data, fn) {

		return this._bindTo(this._element, type, data, fn);

	},

	_init : function() {

		this._bindEvents();

		this._hasValue() && this._initValue();
		this._isInited = true;
		this._params.focusOnInit && this.focus();
		return this;

	},

	_reinit : function() {

		if(this._hasValue()) {
			this._setNoReady(false);
			this._isInitialValueChanged() && this.removeCSSClass(this.__self.CSS_CLASS_CHANGED);
			this._initialValue = this._value;
		}
		return this;

	},

	_extractName : function() {

		return this._element.attr('name');

	},

	_createValue : function(value) {

		return new JZ.Value(value);

	},

	_processValue : function(value) {

		return value;

	},

	_getValue : function() {

		return this._value;

	},

	_setValue : function(value, prevent) {

		if(this._value.isEqual(value)) {
			return this;
		}
		var isInitialValueChanged = this._isInitialValueChanged();
		this._value = value;
		!prevent && this._setValueToElement(value);
		this.trigger('value-change', this);
		if(isInitialValueChanged != this._isInitialValueChanged()) {
			this[(isInitialValueChanged? 'remove' : 'add') + 'CSSClass'](this.__self.CSS_CLASS_CHANGED)
				.trigger('initial-value-change', !isInitialValueChanged);
		}
		return this;

	},

	_setForm : function(form) {

		(this._form = form)._addWidget(this);
		return this;

	},

	_getDefaultParams : function(params) {

		return {
			focusOnInit : false
		};

	},

	_destruct : function() {

		this._unbindAll();

		this._element.removeData('jz');

		delete this._element;
		delete this._classElement;
		delete this._params;
		delete this._parent;
		delete this._value;
		delete this._initialValue;
		delete this._dependencies;
		delete this._dependFromIds;

	},

	_unbindAll : function() {

		this._element.unbind();
		this._classElement.unbind();
		this.unbind();

	},

	_hasValue : function() {

		return false;

	},

	_initValue : function() {

		this._initialValue = (this._value = this._createValue(this._extractValueFromElement())).clone();

	},

	_isInitialValueChanged : function() {

		if(!this._hasValue()) {
			return false;
		}

		return !this._initialValue.isEqual(this._value);

	},

	_updateValue : function() {

		this._setValue(this._createValue(this._extractValueFromElement()), true);

	},

	_checkDependencies : (function() {

		var fullOrder = ['enabled', 'valid', 'required'];
		return function(onlyType, recursively) {
			var i = 0, type, order = !!onlyType? [onlyType] : fullOrder,
				length = order.length, isReady = this.isReady();
			while(i < length) {
				type = order[i++];
				this._dependencies[type] &&
					this[this.__self._dependenceTypeToFn(type)](this._dependencies[type].check());
			}
			isReady != this.isReady() && this.trigger('ready-change', this);
			return this;
		};

	})(),

	_checkRequired : function(params) {

	 	return this._getValue().match(params.pattern);

	},

	_processEnabledDependenceCheck : function(check) {

		if(check.result) {
			this
				.enable()
				.show();
			check.params.focusOnEnable && this.focus();
		}
		else {
			this.disable();
			check.params.hideOnDisable && this.hide();
		}

	},

	_processRequiredDependenceCheck : function(check) {

		this._updateRequired(!check.result);

	},

	_processValidDependenceCheck : function(check) {

		this._updateValid(check.result);
		var _this = this;
		$.each(check.params.invalidCSSClasses, function() {
			this.name && _this[(this.add? 'add' : 'remove') + 'CSSClass'](this.name);
		});

	},

	_updateRequired : function(isRequired) {

		if(isRequired) {
			this.replaceCSSClass(this.__self.CSS_CLASS_REQUIRED_OK, this.__self.CSS_CLASS_REQUIRED);
		}
		else {
			this
				.replaceCSSClass(this.__self.CSS_CLASS_REQUIRED, this.__self.CSS_CLASS_REQUIRED_OK)
				.removeCSSClass(this.__self.CSS_CLASS_NOREADY_REQUIRED);
		}

		this._isRequired = isRequired;

	},

	_updateValid : function(isValid) {

		if(isValid) {
			this._getValue().isEmpty()?
				this.removeCSSClass(this.__self.CSS_CLASS_INVALID + ' ' + this.__self.CSS_CLASS_INVALID_OK) :
				this.replaceCSSClass(this.__self.CSS_CLASS_INVALID, this.__self.CSS_CLASS_INVALID_OK);
			this.removeCSSClass(this.__self.CSS_CLASS_NOREADY_INVALID);
		}
		else {
			this.replaceCSSClass(this.__self.CSS_CLASS_INVALID_OK, this.__self.CSS_CLASS_INVALID);
		}

		this._isValid = isValid;

	},

	_setNoReady : function(noReady) {

		var methodName = (noReady? 'add' : 'remove') + 'CSSClass';
		this.isRequired() && this[methodName](this.__self.CSS_CLASS_NOREADY_REQUIRED);
		!this.isValid() && this[methodName](this.__self.CSS_CLASS_NOREADY_INVALID);

	},

	_processFirstUnreadyWidget : function() {

		if(!this.isReady()) {
			return this;
		}

	},

	_extractValueFromElement : function() {

		return this._element.val();

	},

	_setValueToElement : function(value) {

		this._element.val(value.toString());

	},

	_triggerRemove : function() {

		return this.trigger('remove', this);

	},

	_onChangeDependFromWidget : function() {

		this._checkDependencies();

	},

	_onRemoveDependFromWidget : function(event, widget) {

		var _this = this;
		$.each(this._dependencies, function(type) {
			var dependence = this.removeFrom(widget);
			dependence? _this._dependencies[type] = dependence : delete _this._dependencies[type];
		});
		delete this._dependFromIds[widget.getId()];
		this._checkDependencies();

	},

	_bindEvents : function() {

		return this;

	},

	_enableElements : function() {},
	_disableElements : function() {},
	_beforeSubmit : function() {}

}, {

	CSS_CLASS_HIDDEN           : JZ.CSS_CLASS_WIDGET + '-hidden',
	CSS_CLASS_INVISIBLE        : JZ.CSS_CLASS_WIDGET + '-invisible',
	CSS_CLASS_INITED           : JZ.CSS_CLASS_WIDGET + '-inited',
	CSS_CLASS_CHANGED          : JZ.CSS_CLASS_WIDGET + '-changed',
	CSS_CLASS_FOCUSED          : JZ.CSS_CLASS_WIDGET + '-focused',
	CSS_CLASS_SELECTED         : JZ.CSS_CLASS_WIDGET + '-selected',
	CSS_CLASS_DISABLED         : JZ.CSS_CLASS_WIDGET + '-disabled',
	CSS_CLASS_REQUIRED         : JZ.CSS_CLASS_WIDGET + '-required',
	CSS_CLASS_REQUIRED_OK      : JZ.CSS_CLASS_WIDGET + '-required-ok',
	CSS_CLASS_INVALID          : JZ.CSS_CLASS_WIDGET + '-invalid',
	CSS_CLASS_INVALID_OK       : JZ.CSS_CLASS_WIDGET + '-invalid-ok',
	CSS_CLASS_NOREADY_REQUIRED : JZ.CSS_CLASS_WIDGET + '-noready-required',
	CSS_CLASS_NOREADY_INVALID  : JZ.CSS_CLASS_WIDGET + '-noready-invalid',

	_dependenceTypeToFn : $.memoize(function(type) {

		return '_process' + type.charAt(0).toUpperCase() + type.substr(1).toLowerCase() + 'DependenceCheck';

	})

});