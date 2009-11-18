JZ.Widget = $.inherit(JZ.Observable, {

	__constructor : function(element, classElement, params) {

		this._element = element;
		this._classElement = classElement || element;
		this._params = $.extend(this._getDefaultParams(), params);
		this._parent = null;
		this._form = null;
		this._isRequired = false;
		this._isValid = true;
		this._isEnabled = !this._element.attr('disabled');
		this._isInited = false;
		this._value = null;
		this._initialValue = null;
		this._dependencies = {};
		this._dependFromIds = {};

	},

	getElement : function() {

		return this._element;

	},

	getId : function() {

		var result = JZ._identifyElement(this._element);
		return (this.getId = function() {
			return result;
		})();

	},

	getName : function() {

		var result = this._extractName();
		return (this.getName = function() {
			return result;
		})();

	},

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
		this._isInited?
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

		return this._value.get();

	},

	setValue : function(value) {

		return this._setValue(this._createValue(value));

	},

	addDependence : function(type, dependence) {

		this._dependencies[type] = dependence;

		var _this = this;
		$.each(dependence.getFrom(), function() {
			if(_this._dependFromIds[this.getId()]) {
				return;
			}
			_this._dependFromIds[this.getId()] = true;
			this.bind('value-change enable disable', $.bindContext(function() {
				this._checkDependencies();
			}, _this));
		});

	},

	addChild : function(widget) {},

	_init : function() {

		this._element.data('jz', this);

		this._bindEvents();

		this._hasValue() && this._initValue();
		this._isInited = true;
		this._params.focusOnInit && this.focus();

	},

	_reinit : function() {

		if(this._hasValue()) {
			this._isInitialValueChanged() && this.removeCSSClass(this.__self.CSS_CLASS_CHANGED);
			this._initialValue = this._value;
		}

	},

	_extractName : function() {

		return this._element.attr('name');

	},

	_createValue : function(value) {

		return new JZ.Value(value);

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
			this[(isInitialValueChanged? 'remove' : 'add') + 'CSSClass'](this.__self.CSS_CLASS_CHANGED);
			this.trigger('initial-value-change', !isInitialValueChanged);
		}
		return this;

	},

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

		this._initialValue = (this._value = this._createValue(this._extractValueFromElement())).clone();

	},

	_isInitialValueChanged : function() {

		return !this._initialValue.isEqual(this._value);

	},

	_updateValue : function() {

		this._setValue(this._createValue(this._extractValueFromElement()), true);

	},

	_checkDependencies : (function() {

		var fullOrder = ['enabled', 'valid', 'required'];
		return function(onlyType) {
			var i = 0, type, order = !!onlyType? [onlyType] : fullOrder,
				length = order.length, isReady = this.isReady();
			while(i < length) {
				type = order[i++];
				this._dependencies[type] &&
					this[this.__self._dependenceTypeToFn(type)](this._dependencies[type].check());
			}
			isReady != this.isReady() && this.trigger('ready-change', this);
		};

	})(),

	_checkRequired : function(params) {

	 	return this._getValue().match(params.pattern);

	},

	_processEnabledDependenceCheck : function(check) {

		if(check.result) {
			this.enable();
			this.show();
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
			if(this._getValue().isEmpty()) {
				this.removeCSSClass(this.__self.CSS_CLASS_INVALID + ' ' + this.__self.CSS_CLASS_INVALID_OK);
			}
			else {
				this.replaceCSSClass(this.__self.CSS_CLASS_INVALID, this.__self.CSS_CLASS_INVALID_OK);
			}
			this.removeCSSClass(this.__self.CSS_CLASS_NOREADY_INVALID);
		}
		else {
			this.replaceCSSClass(this.__self.CSS_CLASS_INVALID_OK, this.__self.CSS_CLASS_INVALID);
		}

		this._isValid = isValid;

	},

	_setNoReady : function() {

		this.isRequired() && this.addCSSClass(this.__self.CSS_CLASS_NOREADY_REQUIRED);
		!this.isValid() && this.addCSSClass(this.__self.CSS_CLASS_NOREADY_INVALID);

	},

	_extractValueFromElement : function() {

		return this._element.val();

	},

	_setValueToElement : function(value) {

		this._element.val(value.toString());

	},


	_bindEvents : function() {},
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

	_dependenceTypeToFn : (function() {

		var fns = {};

		return function(type) {
			return fns[type] || (fns[type] = '_process' + type.charAt(0).toUpperCase() + type.substr(1).toLowerCase() + 'DependenceCheck');
		};

	})()

});