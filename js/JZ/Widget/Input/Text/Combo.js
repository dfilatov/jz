JZ.Widget.Input.Text.Combo = $.inherit(JZ.Widget.Input.Text, {

	__constructor : function() {

		this.__base.apply(this, arguments);

		this._element.attr('autocomplete', 'off');
		this._isListShowed = false;
		this._hilightedIndex = -1;
		this._itemsCount = 0;
		this._lastSearchVal = null;
		this._preventOnBlur = false;
		this._preventOnFocus = false;
		this._preventUpdate = false;
		this._focusOnBlur = false;

		this._params.arrow && this._params.arrow.attr('tabIndex', -1);

		this._updateList = $.debounce(function(val) {

			var searchVal = typeof val == 'undefined'? this._element.val() : val;
			if(this._lastSearchVal === this._element.val() && typeof val == 'undefined') {
				return this._showList();
			}
			this._lastSearchVal = searchVal;
			this._getStorage().filter(searchVal, $.bindContext(function(list) {
				this._itemsCount = list.length;
				this._hilightedIndex = -1;
				if(!!list.length) {
					this._getList().html($.map(list, function(val) {
						return '<li>' + val + '</li>';
					}).join(''));
					this._showList();
				}
				else {
					this._hideList();
				}
			}, this));

		}, 50);

	},

	_bindEvents : function() {

		this.__base();
		this._element
			.keydown($.bindContext(this._onKeyDown, this))
			.keyup($.bindContext(this._onKeyUp, this));
		this._params.arrow && this._params.arrow
			.mousedown($.bindContext(this._onArrowMouseDown, this))
			.click($.bindContext(this._onArrowClick, this));

	},

	_onFocus : function() {

		if(!this._preventOnFocus) {
			this.__base();
			if(!this._preventUpdate) {
				this._updateList();
			}
			else {
				this._preventUpdate = false;
			}
		}
		else {
			this._preventOnFocus = false;
		}

	},

	_onBlur : function() {

		if(!this._preventOnBlur) {
			this.__base();
			this._hideList();
		}
		else {
			this._preventOnBlur = false;
		}

		if(this._focusOnBlur) {
			this._focusOnBlur = false;
			setTimeout($.bindContext(this.focus, this), 0);
		}

	},

	_onArrowMouseDown : function() {

		 this._preventOnBlur = true;

	},

	_onArrowClick : function() {

		if(this._isListShowed) {
			this._hideList();
			this._preventOnFocus = true;
			this.focus();
		}
		else {
			this._preventUpdate = true;
			this
				.focus()
				._updateList('');
			this._preventOnBlur = false;
		}
		return false;

	},

	_onKeyDown : function(event) {

		if(event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
			return;
		}

		switch(event.keyCode) {
			case 38:
				this._prev();
				return false;

			case 40:
				this._next();
				return false;
		}

	},

	_onKeyUp : function(event) {

		if(!this._isFocused || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
			return;
		}

		switch(event.keyCode) {
			case 13:
				if(this._isListShowed) {
					this._hideList();
					return false;
				}
			break;

			case 38:
			case 40:
				return false;

			default:
				this._updateList();
		}

	},

	_prev : function() {

		this._isListShowed && this._hilightItemByIndex((this._hilightedIndex > 0? this._hilightedIndex : this._itemsCount) - 1);

	},

	_next : function() {

		this._isListShowed && this._hilightItemByIndex(this._hilightedIndex < this._itemsCount - 1? this._hilightedIndex + 1 : 0);

	},

	_hilightItemByIndex : function(index) {

		this._getList().find('li')
			.eq(this._hilightedIndex).removeClass(this.__self.CSS_CLASS_SELECTED).end()
			.eq(index).addClass(this.__self.CSS_CLASS_SELECTED);

		this._hilightedIndex = index;

		this._selectItemByIndex(index);

	},

	_selectItemByIndex : function(index) {

		if(!this._isListShowed) {
			return this;
		}

		return this.setValue(this.createValue(this._lastSearchVal = this._getList().find('li').eq(index).text()));

	},

	_showList : function() {

		if(this._isListShowed || !this._itemsCount) {
			return;
		}

		this._getListContainer().removeClass(this.__self.CSS_CLASS_HIDDEN);
		this._isListShowed = true;

	},

	_hideList : function() {

		if(!this._isListShowed) {
			return;
		}

		this._getListContainer().addClass(this.__self.CSS_CLASS_HIDDEN);
		this._isListShowed = false;

	},

	_getListContainer : function(onlyForDestruct) {

		if(onlyForDestruct) {
			return $('<div/>');
		}

		var result = $('<div class="' + this.__self.CSS_CLASS_LIST + ' ' + this.__self.CSS_CLASS_HIDDEN + '">' +
		   '<iframe frameborder="0" tabindex="-1" src="javascript:' + "'<body style=\\'background:none\;overflow:hidden\\'>'" +
		   '"></iframe><ul/></div>')
			.mousedown($.bindContext(function(event) {
				this._preventUpdate = true;
				this._focusOnBlur = true;
				this
					.setValue(this.createValue(this._lastSearchVal = $(event.target).closest('li').text()))
					.focus()
					._hideList();
			}, this));
		this._element.after(result);
		return (this._getListContainer = function() {
			return result;
		})();

	},

	_getList : function() {

		var result = this._getListContainer().find('ul');
		return (this._getList = function() {
			return result;
		})();

	},

	_getStorage : function() {

		var _this = this, result = this._params.storage.source == 'remote'?
			new JZ.Storage.Remote($.extend({
					name : this.getName(),
					widgets : $.map((this._params.storage.values || '').split(','), function(name) {
						return _this._form.getWidgetByName($.trim(name));
					})
				}, this._params.storage)) :
			new JZ.Storage.Local(this._params.storage);
		return (this._getStorage = function() {
			return result;
		})();

	},

	_destruct : function() {

		this.__base();
		this._getListContainer(true).unbind();

	}

}, {

	CSS_CLASS_LIST : JZ.CSS_CLASS_WIDGET + '-list'

});