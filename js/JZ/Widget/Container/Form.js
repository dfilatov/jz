JZ.Widget.Container.Form = $.inherit(JZ.Widget.Container, {

	__constructor : function() {

		this.__base.apply(this, arguments);

		this._widgetsByName = {};
		this._widgetsDataById = {};
		this._unreadyWidgetIds = {};
		this._unreadyCounter = 0;
		this._changedCounter = 0;

	},

	isReady : function() {

		return this._unreadyCounter == 0 && (!this._params.heedChanges || this._changedCounter > 0);

	},

	getWidgetByName : function(name) {

		return this._widgetsByName[name];

	},

	serialize : function() {

		var result = {};
		$.each(this._widgetsByName, function(name) {
			this._hasValue() && this.isEnabled() && (result[name] = this.getValue());
		});
		return result;

	},

	submit : function() {

		this._element.submit();

	},

	destruct : function() {

		this._destruct();

	},

	_init : function() {

		this.__base();
		this._setForm(this);
		this._checkDependencies();
		this.addCSSClass(this.__self.CSS_CLASS_INITED);
		this.__self._addInstance(this);
		this._unreadyCounter == 0 && this.trigger('ready-change', this); // инициирующее событие
		this._element.trigger('init.jz', this);

	},

	_reinit : function() {

		this._changedCounter = 0;
		this.__base();

	},

	_bindChildEvents : function() {},

	_bindEvents : function() {

		this._element.submit($.bindContext(this._onSubmit, this));

	},

	_onSubmit : function() {

		if(this.isReady()) {
			this._beforeSubmit();
			var preventSubmit = this._params.preventSubmit;
			this.trigger('before-submit');
			return !preventSubmit;
		}
		var _this = this;
		this._unreadyCounter > 0 && $.each(this._unreadyWidgetIds, function(id) {
			_this._widgetsDataById[id].widget._setNoReady();
		});
		return false;

	},

	_checkDependencies : function() {

		var _this = this;
		$.each(this._widgetsDataById, function() {
			if(_this !== this.widget) {
				this.widget._checkDependencies();
			}
		});

	},

	_getDefaultParams : function() {

		return {
			heedChanges   : false,
			preventSubmit : false
		};

	},

	_addWidget : function(widget) {

		this._widgetsDataById[widget.getId()] = {
			widget  : widget === this?
				widget :
				widget.bind('ready-change', $.bindContext(this._onWidgetReadyChange, this)),
			isReady : true
		};

		!!widget.getName() && (this._widgetsByName[widget.getName()] = widget);

		widget.bind('focus', $.bindContext(function() {
			this.__self._currentInstance = this;
		}, this));

		if(this._params.heedChanges && widget._hasValue()) {
			widget.bind('initial-value-change', $.bindContext(this._onWidgetInitialValueChange, this));
		}

	},

	_onWidgetReadyChange : function(event, widget) {

		var widgetData = this._widgetsDataById[widget.getId()], isReady = widget.isReady();
		if(widgetData.isReady == isReady) {
			return;
		}
		this._unreadyCounter = this._unreadyCounter + (isReady ? -1 : 1);
		widgetData.isReady = isReady;
		isReady? delete this._unreadyWidgetIds[widget.getId()] : this._unreadyWidgetIds[widget.getId()] = true;
		this.trigger('ready-change', this);

	},

	_onWidgetInitialValueChange : function(event, isInitialValueChanged) {

		var counter = this._changedCounter;
		this._changedCounter = this._changedCounter + (isInitialValueChanged ? 1 : -1);

		if(counter + this._changedCounter == 1) {
			this.trigger('ready-change', this);
		}

	},

	_destruct : function() {

		this.__base();
		this.__self._removeInstance(this);

	}

}, {

	_currentInstance : null,
	_instanceCounter : 0,

	_addInstance : function(instance) {

		this._currentInstance = instance;
		++this._instanceCounter == 1 && $(document).bind('keyup.jz', $.bindContext(function(event) {
			this._currentInstance && event.keyCode == 13 && event.ctrlKey && this._currentInstance.submit();
		}, this));

	},

	_removeInstance : function(instance) {

		this._currentInstance == instance && (this._currentInstance = null);
		--this._instanceCounter == 0 && $(document).unbind('keyup.jz');

	}

});