JZ.Widget.Container.Form = $.inherit(JZ.Widget.Container, {

	__constructor : function(element, classElement, params) {

		this.__base(element, classElement, params);

		this._widgetsDataById = {};
		this._unreadyCounter = 0;

	},

	init : function() {

		this.__base();
		this._setForm(this);
		this._checkDependencies();
		this.addCSSClass(this.__self.CSS_CLASS_INITED);
		this.trigger('init');

	},

	_checkDependencies : function() {

		var _this = this;
		$.each(this._widgetsDataById, function() {
			if(_this !== this.widget) {
				this.widget._checkDependencies();
			}
		});

	},

	_addWidget : function(widget) {

		this._widgetsDataById[widget.getId()] = {
			widget  : widget === this?
				widget :
				widget.bind('ready-change', $.bindContext(this._onWidgetReadyChange, this)),
			isReady : true
		};

	},

	_onWidgetReadyChange : function(event, widget) {

		var widgetData = this._widgetsDataById[widget.getId()], isReady = widget.isReady();
		if(widgetData.isReady == isReady) {
			return;
		}

		this._unreadyCounter = this._unreadyCounter + (isReady ? -1 : 1);
		widgetData.isReady = isReady;

		this.trigger('ready-change', this._unreadyCounter == 0);

	}

});