JZ.Widget.Input.Text.Combo = $.inherit(JZ.Widget.Input.Text, {

	_bindEvents : function() {

		this.__base();
		this._element.keyup($.bindContext(this._updateList, this));

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

		this._updateList();

	},

	_hideList : function() {

		this._getList().addClass(this.__self.CSS_CLASS_HIDDEN);

	},

	_updateList : function() {

		this._getStorage().filter(this._element.val(), $.bindContext(function(list) {
			!!list.length && this._getList()
				.html('<ul>' +
					$.map(list, function(val) {
						return '<li>' + val + '</li>';
					}).join('') +
					'</ul>')
				.removeClass(this.__self.CSS_CLASS_HIDDEN);
			this._getList()[(!!list.length? 'remove' : 'add') + 'Class'](this.__self.CSS_CLASS_HIDDEN);
		}, this));

	},

	_getList : function(onlyForDestruct) {

		if(onlyForDestruct) {
			return $('<div/>');
		}

		var result = $('<div class="' + this.__self.CSS_CLASS_LIST + ' ' + this.__self.CSS_CLASS_HIDDEN + '"></div>')
			.mousedown($.bindContext(function(event) {
				this.setValue(this.createValue($(event.target).closest('li').text()));
			}, this));
		this._element.after(result);
		return (this._getList = function() {
			return result;
		})();

	},

	_getStorage : function() {

		var result = new JZ.Storage(this._params.storage);
		return (this._getStorage = function() {
			return result;
		})();

	},

	_destruct : function() {

		this.__base();
		this._getList(true).unbind();

	}

}, {

	CSS_CLASS_LIST : JZ.CSS_CLASS_WIDGET + '-list'

});