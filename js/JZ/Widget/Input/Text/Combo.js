JZ.Widget.Input.Text.Combo = $.inherit(JZ.Widget.Input.Text, {

	__constructor : function() {

		var _this = this;

		_this.__base.apply(_this, arguments);

		_this._isListShowed = _this._preventOnBlur = _this._preventOnFocus =
			_this._preventUpdate = _this._focusOnBlur = false;
		_this._hiddenElem = _this._items = _this._lastSearchVal = _this._keyDownValue =
			_this._updateList = _this._reposTimer = _this._lastOffset = null;
		_this._hilightedIndex = -1;

	},

	_init : function() {

		var _this = this,
			elem = _this.__base()._elem.attr('autocomplete', 'off');

		elem.after(_this._hiddenElem = $('<input type="hidden" value="' + elem.val() + '"' +
			(elem.attr('id')? ' id="value-' + elem.attr('id') + '"' : '') + '/>'));
		if(elem.attr('name')) {
			_this._hiddenElem.attr('name', elem.attr('name'));
			elem.removeAttr('name');
		}

		_this._getArrowElem().attr('tabIndex', -1);
		_this._updateArrow();

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

	_extractName : function() {

		return (this._hiddenElem || this._elem).attr('name');

	},

	_createVal : function(val, preventMapping) {

		return this.__base(preventMapping? val : this._getValMapper().toVal(val));

	},

	_setVal : function(val, prevent) {

		this._hiddenElem.val(val.toString());

		return this.__base(val, prevent);

	},

	_setValToElem : function(val) {

		this.__base(this._createVal(this._getValMapper().toString(val), true));

	},

	_onStorageFilter : function(searchVal, list) {

		var _this = this;
		if(_this._lastSearchVal == searchVal) {
			_this._items = list;
			_this._hilightedIndex = -1;

			if(!list.length) {
				return _this._hideList();
			}

			var listElem = _this._getList(),
				itemProcessor = _this._getItemProcessor(),
				html = [],
				i = 0, item, len = list.length,
				isSelected;

			while(i < len) {
				item = list[i];
				html.push('<li');
				itemProcessor.isSelectable(item) && html.push(' class="', this.__self.CSS_CLASS_SELECTABLE, '"');
				html.push(' onclick="return ', i++, '"');
				if(isSelected = itemProcessor.isSelected(item, searchVal)) {
					_this._hilightedIndex = i - 1;
				}
				html.push('>');
				itemProcessor.toHtml(item, searchVal, html);
				html.push('</li>');
			}

			listElem
				.html(html.join(''))
				.css({ overflow : 'hidden', height : 'auto', width : 'auto' });

			_this._showList();

			var css = {
				overflow : 'auto',
				width    : Math.max(
					listElem.outerWidth(),
					_this._getMeasurerElem().outerWidth() - parseInt(listElem.parent().css('border-left-width'), 10) * 2)
			};

			list.length > _this._params.listSize &&
				(css.height = listElem.find('li:first').outerHeight() * _this._params.listSize);

			listElem.css(css);

			_this._hilightedIndex > -1?
				_this._hilightItemByIndex(_this._hilightedIndex) :
				listElem.scrollTop(0);

		}

	},

	_bindEvents : function() {

		var _this = this,
			keyDown = $.browser.opera? 'keypress' : 'keydown',
			keyBinds = { 'keyup' : _this._onKeyUp };

		keyBinds[keyDown] = _this._onKeyDown;
		_this
			.__base()
			._bindToElem(keyBinds);

		_this
			._bindTo(_this._getArrowElem(), {
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
		if(_this._preventOnBlur) {
			_this._preventOnBlur = false;
		}
		else {
			_this.__base();
			_this._hideList();
		}

		if(_this._focusOnBlur) {
			_this._preventUpdate = true;
			_this._focusOnBlur = false;
			setTimeout(function() {
				_this._refocus();
			}, 0);
		}

	},

	_onSelect : function() {

		this.trigger('select', this);

	},

	_onArrowMouseDown : function() {

		if(this.isEnabled()) {
			this._preventOnBlur = true;
			this._getArrowElem().addClass(this.__self.CSS_CLASS_ARROW_PRESSED);
		}

	},

	_onArrowMouseUp : function() {

		this.isEnabled() &&
			this._getArrowElem().removeClass(this.__self.CSS_CLASS_ARROW_PRESSED);

	},

	_onArrowClick : function(e) {

		e.preventDefault();

		var _this = this;
		if(_this.isEnabled()) {
			if(_this._isListShowed && !_this._lastSearchVal) {
				_this
					._hideList()
					._preventOnFocus = true;
				_this.focus();
			}
			else {
				_this._preventUpdate = true;
				_this
					._refocus()
					._updateList('');
				_this._preventOnBlur = false;
			}
		}

	},

	_onKeyDown : function(e) {

		var _this = this;

		_this._keyDownValue === null && (_this._keyDownValue = _this._elem.val());

		if(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
			return;
		}
		switch(e.keyCode) {
			case 13:
				return _this._onEnter();

			case 38:
				_this._next(-1);
				return false;

			case 40:
				_this._next(1);
				return false;
		}

	},

	_onKeyUp : function(e) {

		if(!this._isFocused || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
			return;
		}

		e.keyCode != 9 && this._keyDownValue !== null && this._keyDownValue != this._elem.val() && this._updateList();
		this._keyDownValue = null;

	},

	_onEnter : function() {

		var _this = this;
		if(_this._isListShowed) {
			_this._params.blurOnSelect && this.blur();
			_this
				._setVal(this._createVal(_this._lastSearchVal = _this._keyDownValue))
				._hideList()
				._onSelect();
			return false;
		}

	},

	_next : function(direction) {

		if(this._isListShowed) {
			var itemProcessor = this._getItemProcessor(),
				i = this._hilightedIndex,
				len = this._items.length;

			do {
				i += direction;
				if(i == len) {
					i = 0;
				}
				else if(i == -1) {
					i = len - 1;
				}

				if(itemProcessor.isSelectable(this._items[i])) {
					return this._hilightItemByIndex(i);
				}
			}
			while(i != this._hilightedIndex);
		}

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
			._keyDownValue = _this._elem.val();

	},

	_selectItemByIndex : function(index) {

		var _this = this;

		if(_this._isListShowed) {
			var item = _this._items[index];
			if(item) {
				_this._onSelectItem(item, _this._lastSearchVal = _this._getItemProcessor().val(item));
				var node = _this._elem[0];
				if(node.createTextRange && !node.selectionStart) {
					var range = node.createTextRange();
					range.move('character', this._elem.val().length);
					range.select();
				}
			}
		}

		return this;

	},

	_onSelectItem : function(item, val) {

		this._setVal(this._createVal(val));

	},

	_showList : function() {

		var _this = this;
		if(_this._isListShowed || !_this._isFocused || !_this._items.length) {
			return _this;
		}

		_this._getListContainer().removeClass(_this.__self.CSS_CLASS_INVISIBLE);
		_this._reposList();
		_this._isListShowed = true;

		return _this;

	},

	_hideList : function() {

		var _this = this;
		if(_this._isListShowed) {
			_this._reposTimer && clearTimeout(_this._reposTimer);
			_this._getListContainer().addClass(_this.__self.CSS_CLASS_INVISIBLE);
			_this._isListShowed = false;
		}

		return _this;

	},

	_reposList : function() {

		var _this = this,
			elem = _this._getMeasurerElem(),
			offset = elem.offset(),
			offsetLeft = offset.left,
			offsetTop = offset.top + elem.outerHeight();

		if(!(_this._lastOffset && _this._lastOffset.left == offsetLeft && _this._lastOffset.top == offsetTop)) {
			_this._lastOffset = { left : offsetLeft, top : offsetTop };
			_this._getListContainer()
				.css({
					left : offsetLeft + 'px',
					top  : offsetTop + 'px'
				});
		}

		_this._params.reposList && (_this._reposTimer = setTimeout($.proxy(_this._reposList, _this), 50));

	},

	_getListContainer : $.memoize(function() {

		var _this = this,
			params = _this._params,
			res = $('<div class="' + _this.__self.CSS_CLASS_LIST + ' ' + _this.__self.CSS_CLASS_INVISIBLE + '">' +
		   			(params.useIframeUnder? '<iframe frameborder="0" tabindex="-1" src="javascript:void(0)"/>' : '') +
				'<ul/></div>');

		_this._bindTo(res, 'mousedown', function(e) {
			var itemNode = $(e.target).closest('li')[0];
			if(itemNode && $(itemNode).hasClass(_this.__self.CSS_CLASS_SELECTABLE)) {
				_this
					._selectItemByIndex(itemNode.onclick())
					._hideList()
					._onSelect();
				_this._focusOnBlur = !params.blurOnSelect;
				params.blurOnSelect && _this.blur();
			} else {
				_this._preventOnBlur = _this._focusOnBlur = _this._preventUpdate = true;
			}

			_this._focusOnBlur && setTimeout(function() {
				_this._focusOnBlur = _this._preventUpdate  = false;
			}, 50);

			return !_this._focusOnBlur;
		});

		return res.appendTo('body');

	}),

	_getList : $.memoize(function() {

		return this._getListContainer().find('ul');

	}),

	_getArrowElem : $.memoize(function() {

		return this._classElem.find('.' + this.__self.CSS_CLASS_ARROW);

	}),

	_getMeasurerElem : $.memoize(function() {

		return this._params.measurer? this._classElem.find(this._params.measurer) : this._elem;

	}),

	_getItemProcessor : $.memoize(function() {

		var itemProcessor = this._params.itemProcessor,
			defaultItemProcessor = this.__self._itemProcessor;
		return new (itemProcessor === defaultItemProcessor?
			itemProcessor :
			$.inherit(defaultItemProcessor, itemProcessor))(this._params.caseSensitivity);

	}),

	_getValMapper : $.memoize(function() {

		var valMapper = this._params.valMapper,
			defaultValMapper = this.__self._valMapper;
		return new (valMapper === defaultValMapper?
			valMapper :
			$.inherit(defaultValMapper, valMapper))(this);

	}),

	_getStorage : function() {

		var _this = this;

		if(_this._storage) {
			return _this._storage;
		}

		var params = $.extend({
				name : _this._params.storage.name || _this.getName(),
				widgets : $.map((_this._params.storage.values || '').split(','), function(name) {
					name = $.trim(name);
					return name? _this._form.getWidgetByName(name) : null;
				})
			}, _this._params.storage),
			source = _this._params.storage.source;

		return _this._storage =  typeof source == 'string'?
			(_this._params.storage.source == 'remote'?
				new JZ.Storage.Remote(params) :
				new JZ.Storage.Local(params)) :
			new source(params);

	},

	setStorage : function(storage) {

		this._storage = storage;
		this._updateArrow();
		this._isFocused && this._updateList(this._params.showAllOnFocus? '' : undefined);

	},

	_refocus : function() {

		var elem = this._elem[0],
			len = elem.value.length;

		elem.focus();

		if($.browser.opera) {
			elem.setSelectionRange(len, len);
		}
		else if(elem.createTextRange) {
			var range = elem.createTextRange();
			range.move('character', len);
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
		this
			._hideList()
			._enableArrow(false);

	},

	_enableArrow : function(enable) {

		var arrowElem = this._getArrowElem();
		arrowElem[0] &&
			(arrowElem[(enable? 'remove' : 'add') + 'Class'](this.__self.CSS_CLASS_ARROW_DISABLED))[0].tagName == 'INPUT' &&
			arrowElem.attr('disabled', !enable);

	},

	_updateArrow : function() {

		this._getArrowElem()[(this._getStorage().isEmpty()? 'add' : 'remove') + 'Class'](this.__self.CSS_CLASS_HIDDEN);

	},

	_getDefaultParams : function(params) {

		return $.extend(this.__base(), {
			listSize         : 15,
			showAllOnFocus   : false,
			showListOnEmpty  : true,
			blurOnSelect     : false,
			reposList        : false,
			debounceInterval : params.storage.source == 'remote'? 200 : 50,
			itemProcessor    : this.__self._itemProcessor,
			valMapper        : this.__self._valMapper,
			caseSensitivity  : false,
			useIframeUnder   : $.browser.msie && $.browser.version == 6
		});

	},

	_destruct : function() {

		this._hiddenElem.attr('name') && this._elem.attr('name', this._hiddenElem.attr('name'));
		this._hiddenElem.remove();
		this._hiddenElem = null;

		var listContainer = this._getListContainer();
		this
			._hideList()
			.__base();
		listContainer.remove();

	},

	_unbindAll : function() {

		this.__base();
		this._getArrowElem.unbind();

	}

}, {

	CSS_CLASS_LIST           : JZ.CSS_CLASS_WIDGET + '-list',
	CSS_CLASS_ARROW          : JZ.CSS_CLASS_WIDGET + '-comboarrow',
	CSS_CLASS_ARROW_PRESSED  : JZ.CSS_CLASS_WIDGET + '-comboarrow-pressed',
	CSS_CLASS_ARROW_DISABLED : JZ.CSS_CLASS_WIDGET + '-comboarrow-disabled',

	_itemProcessor : $.inherit({

		__constructor : function(caseSensitivity) {

			this._caseSensitivity = caseSensitivity;

		},

		toHtml : function(item, searchVal, buffer) {

			var val = this.val(item);

			if(this.isSelectable(item)) {
				var startIndex = (this._caseSensitivity? val : val.toLowerCase())
						.indexOf((this._caseSensitivity? searchVal : searchVal.toLowerCase())),
					searchValLen = searchVal.length;

				startIndex > -1?
					buffer.push(
						val.substr(0, startIndex),
						'<strong>',
						val.substr(startIndex, searchValLen),
						'</strong>',
						val.substr(startIndex + searchValLen)) :
					buffer.push(val);
			}
			else {
				buffer.push(val);
			}

		},

		val : function(item) {

			return item;

		},

		isSelectable : function(item) {

			return true;

		},

		isSelected : function(item, searchVal) {

			if(!this.isSelectable(item)) {
				return false;
			}

			var val = this.val(item);
			return (this._caseSensitivity? val : val.toLowerCase()) ===
		   		(this._caseSensitivity? searchVal : searchVal.toLowerCase());

		}

	}),

	_valMapper : $.inherit({

		toVal : function(str) {

			return str;

		},

		toString : function(val) {

			return val;

		}

	})

});