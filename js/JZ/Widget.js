JZ.Widget = $.inherit(JZ.Observable, {

	__constructor : function(elem, classElem, params) {

		this._elem = elem.data('jz', this);
		this._classElem = classElem || elem;
		this._params = $.extend(this._getDefaultParams(params), params);
		this._parent = this._form = null;
		this._isInited = this._isRequired = false;
		this._isValid = true;
		this._isEnabled = !this._elem.attr('disabled');
		this._val = this._initialVal = null;
		this._dependencies = {};
		this._dependFromIds = {};

	},

	getElement : function() {

		return this._elem;

	},

	getId : $.memoize(function() {

		return JZ._identifyNode(this._elem[0]);

	}),

	getName : $.memoize(function() {

		return this._extractName();

	}),

	focus : function() {

		this._elem[0].focus();
		return this;

	},

	hasCSSClass : function(name) {

		return this._classElem.hasClass(name);

	},

	addCSSClass : function(name) {

		this._classElem.addClass(name);
		return this;

	},

	removeCSSClass : function(name) {

		this._classElem.removeClass(name);
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

		this._enableElems();
		var isReady = this.removeCSSClass(this.__self.CSS_CLASS_DISABLED).isReady();
		this._isEnabled = true;
		isReady != this.isReady() && this.trigger('ready-change', this);
		this.isChanged() && this.trigger('initial-value-change', true);
		return this.trigger('enable', this);

	},

	disable : function() {

		if(this.isEnabled()) {
			this._disableElems();
			var isReady = this.addCSSClass(this.__self.CSS_CLASS_DISABLED).isReady();
			this._isEnabled = false;
			isReady != this.isReady() && this.trigger('ready-change', this);
			this.isChanged() && this.trigger('initial-value-change', false);
			this.trigger('disable', this);
		}
		return this;

	},

	val : function(val) {

		return typeof val == 'undefined'?
	   		this._val.get() :
			this._setVal(this._processVal(this._createVal(val)));

	},

	/**
	 * @deprecated use val() instead
	 */
	getValue : function() {

		return this.val();

	},

	/**
	 * @deprecated use val() instead
	 * @param val
	 */
	setValue : function(val) {

		return this.val(val);

	},

	addDependence : function(type, dependence) {

		this._dependencies[type] = dependence;

		var _this = this;
		$.each(dependence.getFrom(), function() {
			_this._dependFromIds[this.getId()] ||
				(_this
					._bindTo(this, {
						'value-change enable disable' : this._onChangeDependFromWidget,
						'remove'                      : this._onRemoveDependFromWidget
					})
					._dependFromIds[this.getId()] = true);
		});

	},

	remove : function(fromDOM) {

		this._triggerRemove()._parent && this._parent._removeChild(this);
		var classElem = this._classElem;
		this._destruct();
		fromDOM && classElem.remove();

	},

	reset : function() {

		if(this._hasVal()) {
			this._setNoReady(false);
			this._setVal(this._initialVal);
		}
		return this;

	},

	addChild : function() {},

	_bindTo : function(observable, type, data, fn) {

		if($.isFunction(data)) {
			fn = data;
			data = null;
		}

		var _this = this;
		typeof type == 'string'?
			observable.bind(type, data, $.proxy(fn, _this)) :
			$.each(type, function(type) {
				_this._bindTo(observable, type, data, this);
			});

		return _this;

	},

	_bindToElem : function(type, data, fn) {

		return this._bindTo(this._elem, type, data, fn);

	},

	_init : function() {

		this
			._bindEvents()
			._hasVal() && this._initVal();
		this._isInited = true;
		this._params.focusOnInit && this.focus();
		return this;

	},

	_reinit : function() {

		if(this._hasVal()) {
			this._setNoReady(false);
			this.isChanged() && this.removeCSSClass(this.__self.CSS_CLASS_CHANGED);
			this._initialVal = this._val;
		}
		return this;

	},

	_extractName : function() {

		return this._elem.attr('name');

	},

	_createVal : function(val) {

		return new JZ.Value(val);

	},

	_processVal : function(val) {

		return val;

	},

	_getVal : function() {

		return this._val;

	},

	_setVal : function(val, prevent) {

		if(!this._val.isEqual(val)) {
			var isChanged = this.isChanged();
			this._val = val;
			prevent || this._setValToElem(val);
			isChanged == this.trigger('value-change', this).isChanged() ||
				this[(isChanged? 'remove' : 'add') + 'CSSClass'](this.__self.CSS_CLASS_CHANGED)
					.trigger('initial-value-change', !isChanged);
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

	_delete : function() {

		var _this = this;
		$.each(arguments, function(i, prop) {
			delete _this[prop];
		});

	},

	_destruct : function() {

		this._unbindAll();

		this._elem.removeData('jz');

		this._delete('_elem', '_classElem', '_params', '_parent', '_val', '_initialVal', '_dependencies', '_dependFromIds');

	},

	_unbindAll : function() {

		this._elem.unbind();
		this._classElem.unbind();
		this.unbind();

	},

	_hasVal : function() {

		return false;

	},

	_initVal : function() {

		this._initialVal = (this._val = this._createVal(this._extractValFromElem())).clone();

	},

	isChanged : function() {

		return this._hasVal() && !this._initialVal.isEqual(this._val);

	},

	_updateValue : function() {

		this._setVal(this._createVal(this._extractValFromElem()), true);

	},

	_checkDependencies : (function() {

		var fullOrder = ['enabled', 'valid', 'required'];
		return function(onlyType, recursively) {
			var i = 0, type, dependenciesByType, order = !!onlyType? [onlyType] : fullOrder,
				length = order.length, isReady = this.isReady();
			while(i < length) {
				(dependenciesByType = this._dependencies[type = order[i++]]) &&
					this[this.__self._dependenceTypeToFn(type)](dependenciesByType.check());
			}
			isReady != this.isReady() && this.trigger('ready-change', this);
			return this;
		};

	})(),

	_checkRequired : function(params) {

	 	return this._getVal().match(params.pattern);

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

		var _self = this.__self;
		(isRequired?
			this.replaceCSSClass(_self.CSS_CLASS_REQUIRED_OK, _self.CSS_CLASS_REQUIRED) :
			this
				.replaceCSSClass(_self.CSS_CLASS_REQUIRED, _self.CSS_CLASS_REQUIRED_OK)
				.removeCSSClass(_self.CSS_CLASS_NOREADY_REQUIRED))
			._isRequired = isRequired;

	},

	_updateValid : function(isValid) {

		var _self = this.__self;
		(isValid?
			(this._getVal().isEmpty()?
				this.removeCSSClass(_self.CSS_CLASS_INVALID + ' ' + _self.CSS_CLASS_INVALID_OK) :
				this.replaceCSSClass(_self.CSS_CLASS_INVALID, _self.CSS_CLASS_INVALID_OK))
				.removeCSSClass(_self.CSS_CLASS_NOREADY_INVALID) :
			this.replaceCSSClass(_self.CSS_CLASS_INVALID_OK, _self.CSS_CLASS_INVALID))
			._isValid = isValid;

	},

	_setNoReady : function(noReady) {

		var methodName = (noReady? 'add' : 'remove') + 'CSSClass';
		this.isRequired() && this[methodName](this.__self.CSS_CLASS_NOREADY_REQUIRED);
		this.isValid() || this[methodName](this.__self.CSS_CLASS_NOREADY_INVALID);

	},

	_processFirstUnreadyWidget : function() {

		if(!this.isReady()) {
			return this;
		}

	},

	_extractValFromElem : function() {

		return this._elem.val();

	},

	_setValToElem : function(val) {

		this._elem.val(val.toString());

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

	_enableElems : function() {},
	_disableElems : function() {},
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