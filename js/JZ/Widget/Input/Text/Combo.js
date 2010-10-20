JZ.Widget.Input.Text.Combo = $.inherit(JZ.Widget.Input.Text, {

	__constructor : function() {

		var _this = this;

		_this.__base.apply(_this, arguments);

		_this._isListShowed = _this._preventOnBlur = _this._preventOnFocus =
			_this._preventUpdate = _this._focusOnBlur = false;
		_this._items = _this._lastSearchVal = _this._keyDownValue = _this._updateList =
			 _this._reposTimer = _this._lastOffset = null;
		_this._hilightedIndex = -1;

	},

	_init : function() {

		var _this = this;
		_this.__base()._elem.attr('autocomplete', 'off');
		_this._params.arrow && _this._params.arrow.attr('tabIndex', -1);
		_this._updateList = $.debounce(function(val) {

			if(_this._elem) { // widget not destructed
				if(!_this._params.showListOnEmpty && _this._elem.val() === '') {
					return _this._hideList();
				}
				var searchVal = typeof val == 'undefined'? _this._elem.val() : val;
				_this._getStorage().filter(_this._lastSearchVal = searchVal, $.proxy(_this._onStorageFilter, _this));
			}

		}, _this._params.debounceInterval);

		return _this;

	},

	_onStorageFilter : function(searchVal, list) {

		var _this = this;
		if(_this._lastSearchVal == searchVal) {

			_this._items = list;
			_this._hilightedIndex = -1;

			if(!list.length) {
				return _this._hideList();
			}

			var elemVal = _this._elem.val(),
				listElem = _this._getList(),
				itemProcessor = _this._getItemProcessor(),
				html = [],
				i = 0, item, len = list.length,
				isSelected;

			while(i < len) {
				item = list[i];
				html.push('<li onclick="return ', i++, '"');
				if(isSelected = itemProcessor.isSelected(item, elemVal)) {
					html.push(' class="', _this.__self.CSS_CLASS_SELECTED, '"');
					_this._hilightedIndex = i - 1;
				}
				html.push('>');
				itemProcessor.toHtml(item, elemVal, html);
				html.push('</li>');
			}

			listElem
				.html(html.join(''))
				.css('height', 'auto');

			_this._showList();

			list.length > _this._params.listSize &&
				listElem.css('height', listElem.find('li:first').outerHeight() * _this._params.listSize);

		}

	},

	_bindEvents : function() {

		var _this = this,
			keyDown = $.browser.opera? 'keypress' : 'keydown',
			keyBinds = { 'keyup' : _this._onKeyUp },
			arrow = _this._params.arrow;

		keyBinds[keyDown] = _this._onKeyDown;
		_this
			.__base()
			._bindToElem(keyBinds);

		arrow && _this
			._bindTo(arrow, {
				'mousedown' : _this._onArrowMouseDown,
				'mouseup'   : _this._onArrowMouseUp,
				'click'     : _this._onArrowClick
			});

		return _this;

	},

	_onFocus : function() {

		var _this = this;
		if(_this._preventOnFocus) {
			_this._preventOnFocus = false;
		}
		else {
			_this.__base();
			if(_this._preventUpdate) {
				_this._preventUpdate = false;
			}
			else {
				if(_this._params.showAllOnFocus) {
					_this._updateList('');
					_this._lastSearchVal = _this._elem.val();
				}
				else {
					_this._updateList();
				}
			}
		}

	},

	_onBlur : function() {

		var _this = this;
		if(!_this._preventOnBlur) {
			_this.__base();
			_this._hideList();
		}
		else {
			_this._preventOnBlur = false;
		}

		if(_this._focusOnBlur) {
			_this._focusOnBlur = false;
			setTimeout(function() {
				_this
					.focus()
					._refocus();
			}, 0);
		}

	},

	_onArrowMouseDown : function() {

		if(this.isEnabled()) {
			this._preventOnBlur = true;
			this._params.arrow.addClass(this.__self.CSS_CLASS_ARROW_PRESSED);
		}

	},

	_onArrowMouseUp : function() {

		this.isEnabled() &&
			this._params.arrow.removeClass(this.__self.CSS_CLASS_ARROW_PRESSED);

	},

	_onArrowClick : function(e) {

		e.preventDefault();

		var _this = this;
		if(_this.isEnabled()) {
			if(_this._isListShowed) {
				_this._hideList();
				_this._preventOnFocus = true;
				_this.focus();
			}
			else {
				_this._preventUpdate = true;
				_this
					.focus()
					._refocus()
					._updateList('');
				_this._preventOnBlur = false;
			}
		}

	},

	_onKeyDown : function(e) {

		var _this = this;

		if(_this._keyDownValue === null) {
			_this._keyDownValue = _this._elem.val();
			if(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
				return;
			}

			switch(e.keyCode) {
				case 13:
					if(_this._isListShowed) {
						_this
							.val(_this._lastSearchVal = _this._keyDownValue)
							._hideList();
						return false;
					}
				break;

				case 38:
					_this._prev();
					return false;

				case 40:
					_this._next();
					return false;
			}
		}

	},

	_onKeyUp : function(e) {

		if(!this._isFocused || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
			return;
		}

		e.keyCode != 9 && this._keyDownValue != this._elem.val() && this._updateList();
		this._keyDownValue = null;

	},

	_prev : function() {

		this._isListShowed &&
			this._hilightItemByIndex((this._hilightedIndex > 0? this._hilightedIndex : this._items.length) - 1);

	},

	_next : function() {

		this._isListShowed &&
			this._hilightItemByIndex(this._hilightedIndex < this._items.length - 1? this._hilightedIndex + 1 : 0);

	},

	_hilightItemByIndex : function(index) {

		var _this = this,
			listElem = _this._getList(),
			itemElems = listElem.find('li').eq(_this._hilightedIndex)
				.removeClass(_this.__self.CSS_CLASS_SELECTED)
				.end(),
			hilightedElem = itemElems.eq(_this._hilightedIndex = index).addClass(_this.__self.CSS_CLASS_SELECTED),
			itemHeight = hilightedElem.outerHeight(),
			topIndex = Math.ceil(listElem.scrollTop() / itemHeight),
			newTopIndex = topIndex;

		if(index >= topIndex + _this._params.listSize) {
			newTopIndex = index + 1 - _this._params.listSize;
		}
		else if(index < topIndex) {
			newTopIndex = index;
		}

		topIndex == newTopIndex || listElem.scrollTop(itemHeight * newTopIndex);

		_this
			._selectItemByIndex(index)
			._keyDownValue = _this.val();

	},

	_selectItemByIndex : function(index) {

		if(this._isListShowed) {
			var item = this._items[index];
			if(item) {
				var node = this
						.val(this._lastSearchVal = this._getItemProcessor().val(item))
						._elem[0];
				if(node.createTextRange && !node.selectionStart) {
					var range = node.createTextRange();
					range.move('character', this._elem.val().length);
					range.select();
				}
			}
		}

		return this;

	},

	_showList : function() {

		var _this = this;
		if(_this._isListShowed || !_this._isFocused || !_this._items.length ||
			(_this._items.length == 1 && _this._hilightedIndex == 0)) {
			return;
		}

		_this._getListContainer().removeClass(_this.__self.CSS_CLASS_INVISIBLE);
		_this._reposList();
		_this._isListShowed = true;

	},

	_hideList : function() {

		var _this = this;
		if(_this._isListShowed) {
			_this._reposTimer && clearTimeout(_this._reposTimer);
			_this._getListContainer().addClass(_this.__self.CSS_CLASS_INVISIBLE);
			_this._isListShowed = false;
		}

	},

	_reposList : function() {

		var _this = this,
			offset = _this._elem.offset(),
			offsetLeft = offset.left,
			offsetTop = offset.top + _this._elem.outerHeight();

		if(!(_this._lastOffset && _this._lastOffset.left == offsetLeft && _this._lastOffset.top == offsetTop)) {
			_this._lastOffset = { left : offsetLeft, top : offsetTop };
			_this._getListContainer()
				.css({
					width : _this._elem.outerWidth() + 'px',
					left  : offsetLeft + 'px',
					top   : offsetTop + 'px'
				});
		}

		_this._params.reposList && (_this._reposTimer = setTimeout($.proxy(_this._reposList, _this), 50));

	},

	_getListContainer : $.memoize(function() {

		var _this = this,
			res = $('<div class="' + _this.__self.CSS_CLASS_LIST + ' ' + _this.__self.CSS_CLASS_INVISIBLE + '">' +
		   		'<iframe frameborder="0" tabindex="-1" src="javascript:void(0)"/><ul/></div>');

		_this._bindTo(res, 'mousedown', function(e) {
			var itemNode = $(e.target).closest('li')[0];

			_this._preventUpdate = _this._focusOnBlur = true;
			itemNode?
				_this
					._selectItemByIndex(itemNode.onclick())
					.focus()
					._hideList() :
				_this._preventOnBlur = true;

			setTimeout(function() {
				_this._focusOnBlur = false;
			}, 50);

			return false;
		});

		return res.appendTo('body');

	}),

	_getList : $.memoize(function() {

		return this._getListContainer().find('ul');

	}),

	_getItemProcessor : $.memoize(function() {

		var itemProcessor = this._params.itemProcessor,
			defaultItemProcessor = this.__self._itemProcessor;
		return new (itemProcessor === defaultItemProcessor?
			itemProcessor :
			$.inherit(defaultItemProcessor, itemProcessor));

	}),

	_getStorage : $.memoize(function() {

		var _this = this,
			params = $.extend({
				name : _this._params.storage.name || this.getName(),
				widgets : $.map((_this._params.storage.values || '').split(','), function(name) {
					name = $.trim(name);
					return name? _this._form.getWidgetByName(name) : null;
				})
			}, _this._params.storage),
			source = _this._params.storage.source;

		return typeof source == 'string'?
		    (_this._params.storage.source == 'remote'?
			    new JZ.Storage.Remote(params) :
			    new JZ.Storage.Local(params)) :
			new source(params);

	}),

	_refocus : function() {

		if(document.selection) {
			var range = this._elem[0].createTextRange(),
				len = this._elem.val().length;
			range.collapse(true);
			range.moveStart('character', len);
			range.moveEnd('character', len);
			range.select();
		}
		return this;

	},

	_enableElems : function() {

		this.__base();
		this._enableArrow(true);
	},

	_disableElems : function() {

		this.__base();
		this._enableArrow(false);

	},

	_enableArrow : function(enable) {

		var arrowElem = this._params.arrow;
		arrowElem &&
			(arrowElem[(enable? 'remove' : 'add') + 'Class'](this.__self.CSS_CLASS_DISABLED))[0].tagName == 'INPUT' &&
			arrowElem.attr('disabled', !enable);

	},

	_getDefaultParams : function(params) {

		return $.extend(this.__base(), {
			listSize         : 15,
			showAllOnFocus   : false,
			showListOnEmpty  : true,
			reposList        : false,
			debounceInterval : params.storage.source == 'remote'? 200 : 50,
			itemProcessor    : this.__self._itemProcessor
		});

	},

	_destruct : function() {

		this._hideList();
		this.__base();
		this._getListContainer().remove();

	},

	_unbindAll : function() {

		this.__base();
		this._params.arrow && this._params.arrow.unbind();

	}

}, {

	CSS_CLASS_LIST          : JZ.CSS_CLASS_WIDGET + '-list',
	CSS_CLASS_ARROW_PRESSED : JZ.CSS_CLASS_WIDGET + '-comboarrow-pressed',

	_itemProcessor : $.inherit({

		toHtml : function(item, searchVal, buffer) {

			var startIndex = item.toLowerCase().indexOf(searchVal.toLowerCase()),
				searchValLen = searchVal.length;

			startIndex > -1?
				buffer.push(
					item.substr(0, startIndex),
					'<strong>',
					item.substr(startIndex, searchValLen),
					'</strong>',
					item.substr(startIndex + searchValLen)) :
				buffer.push(item);

		},

		val : function(item) {

			return item;

		},

		isSelected : function(item, searchVal) {

			return this.val(item).toLowerCase() === searchVal.toLowerCase();

		}

	})

});