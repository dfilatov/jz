JZ.Widget = $.inherit(JZ.Observable, {

	__constructor : function(element, classElement, params) {

		this._element = element;
		this._classElement = classElement || element;
		this._params = $.extend(this._getDefaultParams(), params);
		this._parent = null;
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

	},

	addClass : function(name) {

		this._classElement.addClass(name);

	},

	removeClass : function(name) {

		this._classElement.removeClass(name);

	},

	init : function() {

		this._bindEvents();

		if (this._hasValue()) {
			this._initValue();
		}

		if (this._params.focusOnInit) {
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

		return !this.isRequired() && this.isValid();

	},

	isEnabled : function() {

		return this._isEnabled;

	},

	enable : function() {

		if(this.isEnabled() || !this._parent.isEnabled()) {
			return;
		}

		this._enableElements();
		this.removeClass(this.__self.CSS_CLASS_DISABLED);
		this._isEnabled = true;
		this.trigger('enable');

	},

	disable : function() {

		if(!this.isEnabled()) {
			return;
		}

		this._disableElements();
		this.addClass(this.__self.CSS_CLASS_DISABLED);
		this._isEnabled = false;
		this.trigger('disable');

	},

	getValue : function() {

		return this._value;

	},

	setValue : function(value) {

		if(this._value.isEqual(value)) {
			return;
		}
		this._value = value;
		this.trigger('change', this);

	},

	createValue : function(value) {

		return new JZ.Value(value);

	},

	addDependence : function(type, dependence) {

		this._dependencies[type] = dependence;

		var ids = {};
		$.each(dependence.getFrom(), function() {
			if(ids[this.getId()]) {
				return true;
			}
			ids[this.getId()] = true;
			this.bind('change', this._checkDependencies, this);
		});

	},

	addChild : function(widget) {},

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

	_updateValue : function() {

		this.setValue(this.createValue(this._extractValueFromElement()));

	},

	_checkDependencies : (function() {

		var order = ['required', 'valid'], length = order.length;
		return function() {
			var i = 0;
			while(i++ < length) {
				this._processDependenceResult(order[i], this._dependencies[order[i]].check());
			}
		};

	}),

	_processDependenceResult : function(type, result) {

	},

	_extractValueFromElement : function() {},
	_bindEvents : function() {},
	_enableElements : function() {},
	_disableElements : function() {}

}, {

	CSS_CLASS_INITED      : JZ.CSS_CLASS_WIDGET + '-inited',
	CSS_CLASS_FOCUSED     : JZ.CSS_CLASS_WIDGET + '-focused',
	CSS_CLASS_DISABLED    : JZ.CSS_CLASS_WIDGET + '-disabled',
	CSS_CLASS_REQUIRED    : JZ.CSS_CLASS_WIDGET + '-required',
	CSS_CLASS_REQUIRED_OK : JZ.CSS_CLASS_WIDGET + '-required-ok',
	CSS_CLASS_INVALID     : JZ.CSS_CLASS_WIDGET + '-invalid',
	CSS_CLASS_INVALID_OK  : JZ.CSS_CLASS_WIDGET + '-invalid-ok'

});