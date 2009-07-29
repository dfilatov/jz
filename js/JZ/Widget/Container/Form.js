JZ.Widget.Container.Form = $.inherit(JZ.Widget.Container, {

	__constructor : function(element, classElement, params) {

		this.__base(element, classElement, params);

		this._widgetsDataById = {};
		this._unreadyCounter = 0;

	},

	init : function() {

		this.__base();
		this._setForm(this);
		this.addCSSClass(this.__self.CSS_CLASS_INITED);
		this.trigger('init');

	},

	_checkDependencies : function() {},

	_addWidget : function(widget) {

		this._widgetsDataById[widget.getId()] = {
			widget  : widget.bind('change enable disable', this._onWidgetChange, this),
			isReady : widget.isReady()
		};

	},

	_onWidgetChange : function(event, widget) {

		var widgetData = this._widgetsDataById[widget.getId()], isReady = widget.isReady();
		if(widgetData.isReady == isReady) {
			return;
		}
		this._unreadyCounter = this._unreadyCounter + (isReady ? -1 : 1);
		widgetData.isReady = isReady;

		this.trigger('ready-change', this._unreadyCounter == 0);

	}

});