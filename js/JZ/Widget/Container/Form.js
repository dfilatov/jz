JZ.Widget.Container.Form = $.inherit(JZ.Widget.Container, {

	__constructor : function() {

		this.__base.apply(this, arguments);

		this._widgetsByName = {};
		this._widgetsDataById = {};
		this._unreadyCounter = 0;
		this._changedCounter = 0;

	},

	isReady : function() {

		return this._unreadyCounter == 0 && (!this._params.heedChanges || this._changedCounter > 0);

	},

	getWidgetByName : function(name) {

		return this._widgetsByName[name];

	},

	_init : function() {

		this.__base();
		this._setForm(this);
		this._checkDependencies();
		this.addCSSClass(this.__self.CSS_CLASS_INITED);
		this.trigger('init', this);

		if(this._unreadyCounter == 0) { // инициирующее событие
			this.trigger('ready-change', this);
		}

	},

	_bindChildEvents : function() {},

	_bindEvents : function() {

		this._element.submit($.bindContext(this._onSubmit, this));

	},

	_onSubmit : function() {

		if(this.isReady()) {
			this._beforeSubmit();
			this.trigger('before-submit');
			return !this._params.preventSubmit;
		}

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
		this.trigger('ready-change', this);

	},

	_onWidgetInitialValueChange : function(event, isInitialValueChanged) {

		var counter = this._changedCounter;
		this._changedCounter = this._changedCounter + (isInitialValueChanged ? 1 : -1);

		if(counter + this._changedCounter == 1) {
			this.trigger('ready-change', this);
		}

	}

});