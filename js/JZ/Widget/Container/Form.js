JZ.Widget.Container.Form = $.inherit(JZ.Widget.Container, {

	__constructor : function() {

		this.__base.apply(this, arguments);

		this._widgetsByName = {};
		this._widgetsDataById = {};
		this._unreadyWidgetIds = {};
		this._unreadyCounter = this._changedCounter = 0;

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

	init : function(widget) {

		widget?
			widget
				._setForm(this)
				._init()
				._checkDependencies(null, true) :
			this.__base();
		return this;

	},

	_init : function() {

		this
			._setForm(this)
			.__base()
			._checkDependencies()
			.addCSSClass(this.__self.CSS_CLASS_INITED)
			.__self._addInstance(this);

		this._unreadyCounter == 0 && this.trigger('ready-change', this); // инициирующее событие
		this._element.trigger('init.jz', this);
		return this;

	},

	_reinit : function() {

		this._changedCounter = 0;
		this.__base();

	},

	_bindChildEvents : function() {},

	_bindEvents : function() {

		this._bindToElement('submit', this._onSubmit);

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
			_this._widgetsDataById[id].widget._setNoReady(true);
		});

		this._params.focusOnNoReady && this._processFirstUnreadyWidget().focus();

		return false;

	},

	_checkDependencies : function() {

		var _this = this;
		$.each(this._widgetsDataById, function() {
			_this !== this.widget && this.widget._checkDependencies();
		});
		return this;

	},

	_getDefaultParams : function() {

		return {
			heedChanges    : false,
			preventSubmit  : false,
			focusOnNoReady : true
		};

	},

	_addWidget : function(widget) {

		this._widgetsDataById[widget.getId()] = {
			widget  : widget,
			isReady : true
		};

		!!widget.getName() && (this._widgetsByName[widget.getName()] = widget);

		widget !== this._bindTo(widget, 'focus', function() {
			this.__self._currentInstance = this;
		}) && this
			._bindTo(widget, 'ready-change', this._onWidgetReadyChange)
			._bindTo(widget, 'remove', this._onWidgetRemove);

		this._params.heedChanges && widget._hasValue() &&
			this._bindTo(widget, 'initial-value-change', this._onWidgetInitialValueChange);

	},

	_onWidgetReadyChange : function(event, widget) {

		var widgetId = widget.getId(), widgetData = this._widgetsDataById[widgetId], isReady = widget.isReady();
		if(widgetData.isReady == isReady) {
			return;
		}
		this._unreadyCounter = this._unreadyCounter + (isReady ? -1 : 1);
		widgetData.isReady = isReady;
		isReady? delete this._unreadyWidgetIds[widgetId] : this._unreadyWidgetIds[widgetId] = true;
		this.trigger('ready-change', this);

	},

	_onWidgetInitialValueChange : function(event, isInitialValueChanged) {

		var counter = this._changedCounter;
		this._changedCounter = this._changedCounter + (isInitialValueChanged ? 1 : -1);
		counter + this._changedCounter == 1 && this.trigger('ready-change', this);

	},

	_onWidgetRemove : function(event, widget) {

		var widgetId = widget.getId(), widgetData = this._widgetsDataById[widgetId];
		delete this._widgetsDataById[widgetId];
		!!widget.getName() && delete this._widgetsByName[widget.getName()];
		if(!widgetData.isReady) {
			this._unreadyCounter--;
			delete this._unreadyWidgetIds[widgetId];
		}
		this._changedCounter++;
		this.trigger('ready-change', this);

	},

	_destruct : function() {

		this
			.removeCSSClass(this.__self.CSS_CLASS_INITED)
			.__base();
		this.__self._removeInstance(this);

		delete this._widgetsByName;
		delete this._widgetsDataById;
		delete this._unreadyWidgetIds;

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