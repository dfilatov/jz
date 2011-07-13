JZ.Widget.Container.Form = $.inherit(JZ.Widget.Container, {

	__constructor : function() {

		this.__base.apply(this, arguments);

		this._widgetsByName = {};
		this._widgetsDataById = {};
		this._unreadyWidgetIds = {};
		this._unreadyCounter = this._changedCounter = 0;
		this._submitted = false;

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

		var _this = this;

		_this
			._setForm(_this)
			.__base()
			._checkDependencies()
			.addCSSClass(_this.__self.CSS_CLASS_INITED)
			.__self._addInstance(_this);

		_this._unreadyCounter || _this.trigger('ready-change', _this); // инициирующее событие
		_this._elem.trigger('init.jz', _this);

		return _this;

	},

	_reinit : function() {

		this._changedCounter = 0;
		this._submitted = false;

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

		var _this = this;

		if(_this._submitted) {
			return false;
		}

		if(_this.isReady()) {
			_this._beforeSubmit();
			var preventSubmit = _this._params.preventSubmit;
			_this.trigger('before-submit', _this);
			_this._submitted = true;
			return !preventSubmit;
		}

		if(_this._unreadyCounter) {
			$.each(_this._unreadyWidgetIds, function(id) {
				_this._widgetsDataById[id].widget._setNoReady(true);
			});
			_this._params.focusOnNoReady && _this._processFirstUnreadyWidget().focus();
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

		var _this = this;

		_this._widgetsDataById[widget.getId()] = {
			widget  : widget,
			isReady : true
		};

		!!widget.getName() && (_this._widgetsByName[widget.getName()] = widget);

		widget !== _this._bindTo(widget, 'focus', function() {
			_this.__self._currentInstance = _this;
		}) && _this
			._bindTo(widget, {
				'ready-change' : _this._onWidgetReadyChange,
				'remove'       : _this._onWidgetRemove
			});

		widget._hasVal() &&
			widget.bind('initial-value-change', _this._onWidgetInitialValueChange, _this);

	},

	_onWidgetReadyChange : function(e, widget) {

		var _this = this,
			widgetId = widget.getId(),
			widgetData = _this._widgetsDataById[widgetId], isReady = widget.isReady();

		if(widgetData.isReady != isReady) {
			_this._unreadyCounter += (widgetData.isReady = isReady)? -1 : 1;
			isReady?
				delete _this._unreadyWidgetIds[widgetId] :
				_this._unreadyWidgetIds[widgetId] = true;
			_this.trigger('ready-change', _this);
		}

	},

	_onWidgetInitialValueChange : function(e, isInitialValueChanged) {

		var counter = this._changedCounter;
		this._changedCounter = counter + (isInitialValueChanged? 1 : -1);
		counter + this._changedCounter == 1 && this.trigger('ready-change', this);

	},

	_onWidgetRemove : function(e, widget) {

		var _this = this,
			widgetId = widget.getId(),
			widgetData = _this._widgetsDataById[widgetId];

		if(widgetData) {
			delete _this._widgetsDataById[widgetId];
			!!widget.getName() && delete _this._widgetsByName[widget.getName()];
			if(!widgetData.isReady) {
				_this._unreadyCounter--;
				delete _this._unreadyWidgetIds[widgetId];
			}
			widget._hasVal() && _this._changedCounter++;
			_this.trigger('ready-change', _this);
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