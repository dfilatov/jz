JZ.Widget.Input.Text.Combo = $.inherit(JZ.Widget.Input.Text, {

	__constructor : function() {

		this.__base.apply(this, arguments);

		this._isListShowed = this._preventOnBlur = this._preventOnFocus = this._preventUpdate = this._focusOnBlur = false;
		this._hilightedIndex = -1;
		this._itemsCount = 0;
		this._lastSearchVal = this._keyDownValue = this._updateList = this._reposTimer = this._lastOffset = null;

	},

	_init : function() {

		this.__base()._element.attr('autocomplete', 'off');
		this._params.arrow && this._params.arrow.attr('tabIndex', -1);
		this._updateList = $.debounce(function(val) {

			if(!this._params.showListOnEmpty && this._element.val() === '') {
				return this._hideList();
			}

			var searchVal = typeof val == 'undefined'? this._element.val() : val;
			if(this._lastSearchVal === this._element.val() && typeof val == 'undefined') {
				return this._showList();
			}
			this._lastSearchVal = searchVal;
			this._getStorage().filter(searchVal, $.bindContext(this._onStorageFilter, this));

		}, this._params.debounceInterval);

		return this;

	},

	_onStorageFilter : function(val, list) {

		if(this._lastSearchVal != val) {
			return;
		}

		this._itemsCount = list.length;
		this._hilightedIndex = -1;

		if(!list.length) {
			return this._hideList();
		}

		var elementVal = this._element.val(), _this = this;
		this._getList().html($.map(list, function(itemVal, i) {
			elementVal == itemVal && (_this._hilightedIndex = i);
			var startIndex = itemVal.toLowerCase().indexOf(val.toLowerCase());
			return '<li' + (elementVal == itemVal?
				' class="' + _this.__self.CSS_CLASS_SELECTED + '"' : '') +
				'>' + (startIndex > -1?
					itemVal.substr(0, startIndex) +
						'<strong>' + itemVal.substr(startIndex, val.length) + '</strong>' +
					itemVal.substr(startIndex + val.length) :
					itemVal) +
				'</li>';
		}).join(''));
		this._showList();

	},

	_bindEvents : function() {

		this
			.__base()
			._bindToElement('keydown', this._onKeyDown)
			._bindToElement('keyup', this._onKeyUp);

		var arrow = this._params.arrow;
		arrow && this
			._bindTo(arrow, 'mousedown', this._onArrowMouseDown)
			._bindTo(arrow, 'mouseup', this._onArrowMouseUp)
			._bindTo(arrow, 'click', this._onArrowClick);

		return this;

	},

	_onFocus : function() {

		if(!this._preventOnFocus) {
			this.__base.apply(this, arguments);
			if(!this._preventUpdate) {
				if(this._params.showAllOnFocus) {
					this._updateList('');
					this._lastSearchVal = this._element.val();
				}
				else {
					this._updateList();
				}
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
			setTimeout($.bindContext(function() {
				this
					.focus()
					._refocus();
			}, this), 0);
		}

	},

	_onArrowMouseDown : function() {

		if(!this.isEnabled()) {
			return;
		}

		this._preventOnBlur = true;
		this._params.arrow.addClass(this.__self.CSS_CLASS_ARROW_PRESSED);

	},

	_onArrowMouseUp : function() {

		if(!this.isEnabled()) {
			return;
		}

		this._params.arrow.removeClass(this.__self.CSS_CLASS_ARROW_PRESSED);

	},

	_onArrowClick : function() {

		if(!this.isEnabled()) {
			return;
		}

		if(this._isListShowed) {
			this._hideList();
			this._preventOnFocus = true;
			this.focus();
		}
		else {
			this._preventUpdate = true;
			this
				.focus()
				._refocus()
				._updateList('');
			this._preventOnBlur = false;
		}
		return false;

	},

	_onKeyDown : function(event) {

		this._keyDownValue = this._element.val();

		if(event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
			return;
		}

		switch(event.keyCode) {
			case 13:
				if(this._isListShowed) {
					this._itemsCount = 0;
		            this._hilightedIndex = -1;
					this
                        .setValue(this._lastSearchVal = this._keyDownValue)
                        ._hideList();
					return false;
				}
			break;

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

		event.keyCode != 9 && this._keyDownValue != this._element.val() && this._updateList();

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

		this.setValue(this._lastSearchVal = this._getList().find('li').eq(index).text());

		var element = this._element[0];
		if(element.createTextRange && !element.selectionStart) {
			var range = element.createTextRange();
			range.move('character', this._element.val().length);
        	range.select();
		}

		return this;

	},

	_showList : function() {

		if(this._isListShowed || !this._isFocused || !this._itemsCount ||
			(this._itemsCount == 1 && this._hilightedIndex == 0)) {
			return;
		}

		this._getListContainer().removeClass(this.__self.CSS_CLASS_INVISIBLE);
		this._reposList();
		this._isListShowed = true;

	},

	_hideList : function() {

		if(!this._isListShowed) {
			return;
		}

		this._reposTimer && clearTimeout(this._reposTimer);
		this._getListContainer().addClass(this.__self.CSS_CLASS_INVISIBLE);
		this._isListShowed = false;

	},

	_reposList : function() {

		var offset = this._element.offset(),
			offsetLeft = offset.left,
			offsetTop = offset.top + this._element.outerHeight();

		if(!(this._lastOffset && this._lastOffset.left == offsetLeft && this._lastOffset.top == offsetTop)) {
			this._lastOffset = { left : offsetLeft, top : offsetTop };
			this._getListContainer()
				.css({
					width : this._element.outerWidth() + 'px',
					left  : offsetLeft + 'px',
					top   : offsetTop + 'px'
				});
		}

		this._params.reposList && (this._reposTimer = setTimeout($.bindContext(arguments.callee, this), 50));

	},

	_getListContainer : $.memoize(function(onlyForDestruct) {

		if(onlyForDestruct) {
			return $('<div/>');
		}

		var result = $('<div class="' + this.__self.CSS_CLASS_LIST + ' ' + this.__self.CSS_CLASS_INVISIBLE + '">' +
		   '<iframe frameborder="0" tabindex="-1" src="javascript:void(0)"/><ul/></div>');

		this._bindTo(result, 'mousedown', function(event) {
			this._preventUpdate = this._focusOnBlur = true;
			this
				.setValue(this._lastSearchVal = $(event.target).closest('li').text())
				.focus()
				._hideList();
			setTimeout($.bindContext(function() {
				this._focusOnBlur = false;
			}, this), 50);
			return false;
		});

		$('body').append(result);
		return result;

	}),

	_getList : $.memoize(function() {

		return this._getListContainer().find('ul');

	}),

	_getStorage : $.memoize(function() {

		var _this = this;
		return this._params.storage.source == 'remote'?
			new JZ.Storage.Remote($.extend({
					name : this._params.storage.name || this.getName(),
					widgets : $.map((this._params.storage.values || '').split(','), function(name) {
						return _this._form.getWidgetByName($.trim(name));
					})
				}, this._params.storage)) :
			new JZ.Storage.Local(this._params.storage);

	}),

	_refocus : function() {

		if(document.selection) {
			var range = this._element[0].createTextRange();
			range.collapse(true);
			range.moveStart('character', 1000);
			range.moveEnd('character', 1000);
			range.select();
		}
		return this;

	},

	_enableElements : function() {

		this.__base();
		this._params.arrow &&
			(this._params.arrow.removeClass(this.__self.CSS_CLASS_DISABLED))[0].tagName == 'INPUT' &&
			this._params.arrow.attr('disabled', false);

	},

	_disableElements : function() {

		this.__base();
		this._params.arrow &&
			(this._params.arrow.addClass(this.__self.CSS_CLASS_DISABLED))[0].tagName == 'INPUT' &&
			this._params.arrow.attr('disabled', true);

	},

	_getDefaultParams : function(params) {

		return $.extend(this.__base(), {
			showAllOnFocus   : false,
			showListOnEmpty  : true,
			reposList        : false,
			debounceInterval : (params || {}).storage.source == 'remote'? 200 : 50
		});

	},

	_destruct : function() {

		this.__base();
		this._getListContainer(true).remove();

	},

	_unbindAll : function() {

		this.__base();
		this._getListContainer(true).unbind();
		this._params.arrow && this._params.arrow.unbind();

	}

}, {

	CSS_CLASS_LIST          : JZ.CSS_CLASS_WIDGET + '-list',
	CSS_CLASS_ARROW_PRESSED : JZ.CSS_CLASS_WIDGET + '-comboarrow-pressed'

});