JZ.Widget.Container.Date = $.inherit(JZ.Widget.Container, {

	__constructor : function() {

		this.__base.apply(this, arguments);
		this._yearInput = this._monthInput = this._dayInput = this._oldElement = null;

	},

	reset : function() {

		return JZ.Widget.prototype.reset.call(this);

	},

	_init : function() {

		var element = $('<input type="hidden" name="' + this.getName() + '" value="' + this._element.val() + '"/>')
			.data('jz', this);
		this._element.replaceWith(element);
		this._oldElement = this._element;
		this._element = element;
		this._addChildInputs();
		return this.__base();

	},

	_addChildInputs : function() {

		this
			.addChild(this._yearInput = this._createNumberInput('year', { maxLength : 4 }))
			.addChild(this._monthInput = this._createSelectInput('month'))
			.addChild(this._dayInput = this._createNumberInput('day', { maxLength : 2 }));

	},

	_createNumberInput : function(postfix, params) {

		var element = $('<input' +
			(this._params.onlyMonths && postfix == 'day'? ' type="hidden"' : '') +
			' class="' + JZ.CSS_CLASS_WIDGET + '-' + postfix + '" ' +
			' maxlength="' + params.maxLength + '"/>');
		this._element.after(element);

		return new JZ.Widget.Input.Text.Number(element, null, params);

	},

	_createSelectInput : function(postfix, params) {

		var element = $('<select' +
			' class="' + JZ.CSS_CLASS_WIDGET + '-' + postfix + '">' +
				$.map(JZ.Resources.getMonthsByType(this._params.onlyMonths? 'normal' : 'genitive'), function(name, i) {
					return '<option value="' + (i + 1) + '">' + name +'</option>';
				}).join('') +
			'</select>');
		this._element.after(element);

		return new JZ.Widget.Input.Select(element, null, params);

	},

	_bindChildEvents : function(widget) {

		this
			._bindTo(widget, {
				'value-change' : this._onChildChange,
				'blur'         : this._onChildBlur
			});

	},

	_onChildChange : function() {

		this._setValue(this._createValue(
			this._yearInput.getValue() + '-' + this._monthInput.getValue() + '-' + this._dayInput.getValue()), true);

	},

	_onChildBlur : function() {

		!this._getValue().isEmpty() && this._updateChildValues();

	},

	_updateChildValues : function(value) {

		value = value || this._getValue();

		var widgets = [this._yearInput, this._monthInput, this._dayInput],
			values = [value.getYear(), value.getMonth(), value.getDay()];
		$.each(widgets, function(i) {
			this.getValue() != values[i] && this.setValue(values[i]);
		});

		return value;

	},

	_initValue : function() {

		this.__base();
		this._setValueToElement(this._getValue());

	},

	_setValueToElement : function(value) {

		this._updateChildValues(value);
		return this.__base(value);

	},

	_hasValue : function() {

		return true;

	},

	_createValue : function(value) {

		return new JZ.Value.Date(value);

	},

	_getDefaultParams : function() {

		return $.extend(this.__base(), {
			onlyMonths : false
		});

	},

	_destruct : function() {

		this._applyFnToChildren('remove', [true]);		
		this._element.replaceWith(this._oldElement);
		this._element = this._oldElement.val(this._element.val());
		JZ.Widget.prototype._destruct.call(this);

	}

});