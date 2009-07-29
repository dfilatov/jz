JZ.Widget.Container.Form = $.inherit(JZ.Widget.Container, {

	__constructor : function(element, classElement, params) {

		this.__base(element, classElement, params);

		this._submits = [];
		this._widgetsDataById = {};
		this._unreadyCounter = 0;

	},

	init : function() {

		this.__base();
		this._fillWidgetsData();
		this.addClass(this.__self.CSS_CLASS_INITED);
		this.trigger('init');

	},

	_fillWidgetsData : function() {

		(function(widget) {
			var children = widget._children, child, i = 0;
			while(children && (child = children[i++])) {
				arguments.callee.call(this, child);
			}
			this._widgetsDataById[widget.getId()] = {
				widget  : widget,
				isReady : widget.isReady()
			};
			widget.bind('change', this._onWidgetChange, this);
			if(widget instanceof JZ.Widget.Button.Submit) {
				this._submits.push(widget);
			}
		}).call(this, this);

	},

	_onWidgetChange : function(event, widget) {

		var widgetData = this._widgetsDataById[widget.getId()], isReady = widget.isReady();
		if(widgetData.isReady == isReady) {
			return;
		}
		this._unreadyCounter = this._unreadyCounter + (isReady ? -1 : 1);
		widgetData.isReady = isReady;

		this._updateSubmits();

	},

	_updateSubmits : function() {

		if(!this._submits.length) {
			return;
		}

		var submits = this._submits, submit, i = 0, fnName = this._unreadyCounter == 0 ? 'enable' : 'disable';
		while(submit = submits[i++]) {
			submit[fnName]();
		}

	}

});