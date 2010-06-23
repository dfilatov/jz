JZ.Widget.Container.Date = $.inherit(JZ.Widget.Container, {

	__constructor : function() {

		this.__base.apply(this, arguments);
		this._yearInput = this._monthInput = this._dayInput = this._oldElem = null;

	},

	reset : function() {

		return JZ.Widget.prototype.reset.call(this);

	},

	_init : function() {

		var elem = $('<input type="hidden" name="' + this.getName() + '" value="' + this._elem.val() + '"/>')
			.data('jz', this);
		this._elem.replaceWith(elem);
		this._oldElem = this._elem;
		this._elem = elem;
		this._addChildInputs();
		return this.__base();

	},

	_addChildInputs : function() {

		this.addChild(
			this._yearInput = this._createNumberInput('year', { size : 4 }),
			this._monthInput = this._createSelectInput('month'),
			this._dayInput = this._createNumberInput('day', { size : 2 }));

	},

	_createNumberInput : function(postfix, params) {

		var elem = $('<input' +
			(this._params.onlyMonths && postfix == 'day'? ' type="hidden"' : '') +
			' class="' + JZ.CSS_CLASS_WIDGET + '-' + postfix + '" ' +
			' size="' + params.size + '"' +
			' maxlength="' + params.size + '"/>');
		this._elem.after(elem);

		return new JZ.Widget.Input.Text.Number(elem, null, params);

	},

	_createSelectInput : function(postfix, params) {

		var elem = $('<select' +
			' class="' + JZ.CSS_CLASS_WIDGET + '-' + postfix + '">' +
				$.map(JZ.Resources.getMonthsByType(this._params.onlyMonths? 'normal' : 'genitive'), function(name, i) {
					return '<option value="' + (i + 1) + '">' + name +'</option>';
				}).join('') +
			'</select>');
		this._elem.after(elem);

		return new JZ.Widget.Input.Select(elem, null, params);

	},

	_bindChildEvents : function(widget) {

		this
			._bindTo(widget, {
				'value-change' : this._onChildChange,
				'blur'         : this._onChildBlur
			});

	},

	_onChildChange : function() {

		this._setVal(this._createVal(
			this._yearInput.getValue() + '-' + this._monthInput.getValue() + '-' + this._dayInput.getValue()), true);

	},

	_onChildBlur : function() {

		!this._getVal().isEmpty() && this._updateChildValues();

	},

	_updateChildValues : function(val) {

		val = val || this._getVal();

		var widgets = [this._yearInput, this._monthInput, this._dayInput],
			vals = [val.getYear(), val.getMonth(), val.getDay()];
		$.each(widgets, function(i) {
			this.getValue() != vals[i] && this.setValue(vals[i]);
		});

		return val;

	},

	_initValue : function() {

		this.__base();
		this._setValToElem(this._getVal());

	},

	_setValToElem : function(val) {

		this._updateChildValues(val);
		return this.__base(val);

	},

	_hasValue : function() {

		return true;

	},

	_createVal : function(val) {

		return new JZ.Value.Date(val);

	},

	_getDefaultParams : function() {

		return $.extend(this.__base(), {
			onlyMonths : false
		});

	},

	_destruct : function() {

		this._applyFnToChildren('remove', [true]);
		this._elem.replaceWith(this._oldElem);
		this._elem = this._oldElem.val(this._elem.val());
		JZ.Widget.prototype._destruct.call(this);

	}

});