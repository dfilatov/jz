JZ.Widget.Input.Text.Combo = $.inherit(JZ.Widget.Input.Text, {

	_bindEvents : function() {

		this.__base();
		this._element.keydown(function(event) {
			
		});

	},

	_onFocus : function() {

		this.__base();
		this._showList();

	},

	_onBlur : function() {

		this.__base();
		this._hideList();

	},

	_showList : function() {

		this._getList()
			.html('<ul>' +
				$.map(this._params.list.values, function(val) {
					return '<li>' + val + '</li>';
				}).join('') +
				'</ul>')
			.removeClass(this.__self.CSS_CLASS_HIDDEN);

	},

	_hideList : function() {

		this._getList().addClass(this.__self.CSS_CLASS_HIDDEN);

	},

	_getList : function() {

		var result = $('<div class="' + this.__self.CSS_CLASS_LIST + ' ' + this.__self.CSS_CLASS_HIDDEN + '"></div>')
			.mousedown($.bindContext(function(event) {
				this.setValue(this.createValue($(event.target).closest('li').text()));
			}, this));
		this._element.after(result);
		return (this._getList = function() {
			return result;
		})();

	}

}, {

	CSS_CLASS_LIST : JZ.CSS_CLASS_WIDGET + '-list'

});