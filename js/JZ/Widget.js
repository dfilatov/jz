JZ.Widget = $.inherit(JZ.Observable, {

	__constructor : function(element, classElement, params) {

		this._element = element;
		this._classElement = classElement || element;
		this._params = $.extend(this._getDefaultParams(), params);
		this._parent = null;
		this._form = null;
		this._isRequired = false;
		this._isValid = true;
		this._isEnabled = true;
		this._value = null;
		this._initialValue = null;
		this._dependencies = {};

	},

	getId : function() {

		var result = JZ._identifyElement(this._element);
		return (this.getId = function() {
			return result;
		})();

	},

	getName : function() {

		var result = this._element.attr('name');
		return (this.getName = function() {
			return result;
		})();

	},

	focus : function() {

		this._element.focus();
		return this;

	},

	hasCSSClass : function(name) {

		return this._classElement.hasClass(name);

	},

	addCSSClass : function(name) {

		this._classElement.addClass(name);

	},

	removeCSSClass : function(name) {

		this._classElement.removeClass(name);

	},

	replaceCSSClass : function(nameFrom, nameTo) {

		if(this.hasCSSClass(nameFrom)) {
			this.removeCSSClass(nameFrom);
		}
		this.addCSSClass(nameTo);

	},

	init : function() {

		this._bindEvents();

		if(this._hasValue()) {
			this._initValue();
		}

		if(this._params.focusOnInit) {
			this.focus();
		}

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

	enable : function(byParent) {

		if(this.isEnabled() || !this._parent.isEnabled()) {
			return;
		}

		if(byParent && this._dependencies['enabled']) {
			return this._checkDependencies('enabled');
		}

		this._enableElements();
		this.removeCSSClass(this.__self.CSS_CLASS_DISABLED);
		var isReady = this.isReady();
		this._isEnabled = true;
		if(isReady != this.isReady()) {
			this.trigger('ready-change', this);
		}
		this.trigger('enable', this);

	},

	disable : function() {

		if(!this.isEnabled()) {
			return;
		}

		this._disableElements();
		this.addCSSClass(this.__self.CSS_CLASS_DISABLED);
		var isReady = this.isReady();
		this._isEnabled = false;
		if(isReady != this.isReady()) {
			this.trigger('ready-change', this);
		}
		this.trigger('disable', this);

	},

	getValue : function() {

		return this._value;

	},

	setValue : function(value, prevent) {

		if(this._value.isEqual(value)) {
			return this;
		}
		var isInitialValueChanged = this._isInitialValueChanged();
		this._value = value;
		!prevent && this._setValueToElement(value);
		this.trigger('value-change', this);
		if(isInitialValueChanged != this._isInitialValueChanged()) {
			this[(isInitialValueChanged? 'remove' : 'add') + 'CSSClass'](this.__self.CSS_CLASS_CHANGED);
			this.trigger('initial-value-change', !isInitialValueChanged);
		}
		return this;

	},

	createValue : function(value) {

		return new JZ.Value(value);

	},

	addDependence : function(type, dependence) {

		this._dependencies[type] = dependence;

		var ids = {}, _this = this;
		$.each(dependence.getFrom(), function() {
			if(ids[this.getId()]) {
				return;
			}
			ids[this.getId()] = true;
			this.bind('value-change enable disable', $.bindContext(function() {
				this._checkDependencies();
			}, _this));
		});

	},

	addChild : function(widget) {},

	_setForm : function(form) {

		this._form = form;
		form._addWidget(this);

	},

	_getDefaultParams : function() {

		return {
			focusOnInit : false
		};

	},

	_destruct : function() {

		this._unbindAll();

		delete this._element;
		delete this._classElement;
		delete this._params;
		delete this._parent;

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

		this._initialValue = (this._value = this.createValue(this._extractValueFromElement())).clone();

	},

	_isInitialValueChanged : function() {

		return !this._initialValue.isEqual(this._value);

	},

	_updateValue : function() {

		this.setValue(this.createValue(this._extractValueFromElement()), true);

	},

	_checkDependencies : (function() {

		var fullOrder = ['enabled', 'valid', 'required'];
		return function(onlyType) {
			var i = 0, type, order = !!onlyType? [onlyType] : fullOrder,
				length = order.length, isReady = this.isReady();
			while(i < length) {
				type = order[i++];
				if(this._dependencies[type]) {
					this[this.__self._dependenceTypeToFn(type)](this._dependencies[type].check());
				}
			}
			if(isReady != this.isReady()) {
				this.trigger('ready-change', this);
			}
		};

	})(),

	_processEnabledDependenceCheck : function(check) {

		if(check.result) {
			this.enable();
			if(check.params.focusOnEnable) {
				this.focus();
			}
		}
		else {
			this.disable();
		}

	},

	_processRequiredDependenceCheck : function(check) {

		this._updateRequired(!check.result);

	},

	_processValidDependenceCheck : function(check) {

		this._updateValid(check.result);
		var _this = this;
		$.each(check.params.invalidCSSClasses, function() {
			_this[(this.add? 'add' : 'remove') + 'CSSClass'](this.name);
		});

	},

	_updateRequired : function(isRequired) {

		if(isRequired) {
			this.replaceCSSClass(this.__self.CSS_CLASS_REQUIRED_OK, this.__self.CSS_CLASS_REQUIRED);
		}
		else {
			this.replaceCSSClass(this.__self.CSS_CLASS_REQUIRED, this.__self.CSS_CLASS_REQUIRED_OK);
		}

		this._isRequired = isRequired;

	},

	_updateValid : function(isValid) {

		if(isValid) {
			if(this.getValue().isEmpty()) {
				this.removeCSSClass(this.__self.CSS_CLASS_INVALID + ' ' + this.__self.CSS_CLASS_INVALID_OK);
			}
			else {
				this.replaceCSSClass(this.__self.CSS_CLASS_INVALID, this.__self.CSS_CLASS_INVALID_OK);
			}
		}
		else {
			this.replaceCSSClass(this.__self.CSS_CLASS_INVALID_OK, this.__self.CSS_CLASS_INVALID);
		}

		this._isValid = isValid;

	},

	_extractValueFromElement : function() {},
	_setValueToElement : function() {},
	_bindEvents : function() {},
	_enableElements : function() {},
	_disableElements : function() {},
	_beforeSubmit : function() {}

}, {

	CSS_CLASS_HIDDEN      : JZ.CSS_CLASS_WIDGET + '-hidden',
	CSS_CLASS_INVISIBLE   : JZ.CSS_CLASS_WIDGET + '-invisible',
	CSS_CLASS_INITED      : JZ.CSS_CLASS_WIDGET + '-inited',
	CSS_CLASS_CHANGED     : JZ.CSS_CLASS_WIDGET + '-changed',
	CSS_CLASS_FOCUSED     : JZ.CSS_CLASS_WIDGET + '-focused',
	CSS_CLASS_SELECTED    : JZ.CSS_CLASS_WIDGET + '-selected',
	CSS_CLASS_DISABLED    : JZ.CSS_CLASS_WIDGET + '-disabled',
	CSS_CLASS_REQUIRED    : JZ.CSS_CLASS_WIDGET + '-required',
	CSS_CLASS_REQUIRED_OK : JZ.CSS_CLASS_WIDGET + '-required-ok',
	CSS_CLASS_INVALID     : JZ.CSS_CLASS_WIDGET + '-invalid',
	CSS_CLASS_INVALID_OK  : JZ.CSS_CLASS_WIDGET + '-invalid-ok',

	_dependenceTypeToFn : (function() {

		var fns = {};

		return function(type) {
			return fns[type] || (fns[type] = '_process' + type.charAt(0).toUpperCase() + type.substr(1).toLowerCase() + 'DependenceCheck');
		};

	})()

});