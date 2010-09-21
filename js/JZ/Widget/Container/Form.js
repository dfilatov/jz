JZ.Widget.Container.Form = $.inherit(JZ.Widget.Container, {

	__constructor : function() {

		this.__base.apply(this, arguments);

		this._widgetsByName = {};
		this._widgetsDataById = {};
		this._unreadyWidgetIds = {};
		this._unreadyCounter = this._changedCounter = 0;

	},

	isChanged : function() {

		return this._changedCounter > 0;

	},

	isReady : function() {

		return this._unreadyCounter == 0 && (!this._params.heedChanges || this.isChanged());

	},

	getWidgetByName : function(name) {

		return this._widgetsByName[name];

	},

	getWidgetById : function(id) {

		return this._widgetsDataById[id].widget;

	},

	serialize : function() {

		var result = {};
		$.each(this._widgetsByName, function(name) {
			this._hasVal() && this.isEnabled() && (result[name] = this.val());
		});
		return result;

	},

	submit : function() {

		this._elem.submit();

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
		this._elem.trigger('init.jz', this);
		return this;

	},

	_reinit : function() {

		this._changedCounter = 0;
		return this.__base();

	},

	_bindChildEvents : function() {},

	_bindEvents : function() {

		return this
            ._bindToElem({
				'submit'  : this._onSubmit,
            	'keydown' : function(e) {
                	e.keyCode == 27 && e.preventDefault(); // IE пытается возвращать форму в исходное значение
				}});

	},

	_onSubmit : function() {

		if(this.isReady()) {
			this._beforeSubmit();
			var preventSubmit = this._params.preventSubmit;
			this.trigger('before-submit', this);
			return !preventSubmit;
		}

		var _this = this;
		if(this._unreadyCounter > 0) {
			$.each(this._unreadyWidgetIds, function(id) {
				_this._widgetsDataById[id].widget._setNoReady(true);
			});
			this._params.focusOnNoReady && this._processFirstUnreadyWidget().focus();
		}

		return false;

	},

	_processFirstUnreadyWidget : function() {

		return this._processFirstUnreadyChildWidget();

	},

	_checkDependencies : function() {

		var _this = this;
		$.each(_this._widgetsDataById, function() {
			_this !== this.widget && this.widget._checkDependencies();
		});
		return _this;

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
			._bindTo(widget, {
				'ready-change' : this._onWidgetReadyChange,
				'remove'       : this._onWidgetRemove
			});

		widget._hasVal() &&
			this._bindTo(widget, 'initial-value-change', this._onWidgetInitialValueChange);

	},

	_onWidgetReadyChange : function(e, widget) {

		var widgetId = widget.getId(), widgetData = this._widgetsDataById[widgetId], isReady = widget.isReady();
		if(widgetData.isReady != isReady) {
			this._unreadyCounter += (widgetData.isReady = isReady)? -1 : 1;
			isReady? delete this._unreadyWidgetIds[widgetId] : this._unreadyWidgetIds[widgetId] = true;
			this.trigger('ready-change', this);
		}

	},

	_onWidgetInitialValueChange : function(e, isInitialValueChanged) {

		var counter = this._changedCounter;
		this._changedCounter = counter + (isInitialValueChanged? 1 : -1);
		counter + this._changedCounter == 1 && this.trigger('ready-change', this);

	},

	_onWidgetRemove : function(e, widget) {

		var widgetId = widget.getId(), widgetData = this._widgetsDataById[widgetId];
		if(widgetData) {
			delete this._widgetsDataById[widgetId];
			!!widget.getName() && delete this._widgetsByName[widget.getName()];
			if(!widgetData.isReady) {
				this._unreadyCounter--;
				delete this._unreadyWidgetIds[widgetId];
			}
			this._changedCounter++;
			this.trigger('ready-change', this);
		}

	},

	_destruct : function() {

		this
			.removeCSSClass(this.__self.CSS_CLASS_INITED)
			.__base();
		this.__self._removeInstance(this);

		this._del('_widgetsByName', '_widgetsDataById', '_unreadyWidgetIds');

	}

}, {

	_currentInstance : null,
	_instanceCounter : 0,

	_addInstance : function(instance) {

		this._currentInstance = instance;
		++this._instanceCounter == 1 && $(document).bind('keyup.jz', $.proxy(function(e) {
			this._currentInstance && e.keyCode == 13 && e.ctrlKey && this._currentInstance.submit();
		}, null, this));

	},

	_removeInstance : function(instance) {

		this._currentInstance == instance && (this._currentInstance = null);
		--this._instanceCounter == 0 && $(document).unbind('keyup.jz');

	}

});