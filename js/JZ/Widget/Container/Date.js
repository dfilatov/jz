JZ.Widget.Container.Date = $.inherit(JZ.Widget.Container, {

	__constructor : function() {

		this.__base.apply(this, arguments);
		this._yearInput = this._monthInput = this._dayInput = null;

	},

	_init : function() {

		var element = $('<input type="hidden" name="' + this.getName() + '"/>');
		this._element.replaceWith(element);
		this._element = element;
		this
			.addChild(this._yearInput = this._createNumberInput('year', { maxLength : 4 }))
			.addChild(this._monthInput = this._createSelectInput('month'))
			.addChild(this._dayInput = this._createNumberInput('day', { maxLength : 2 }));
		this.__base();

	},

	_createNumberInput : function(postfix, params) {

		var element = $('<input' +
			' class="' + JZ.CSS_CLASS_WIDGET + '-' + postfix + '" ' +
			' maxlength="' + params.maxLength + '"/>');
		this._element.after(element);

		return new JZ.Widget.Input.Text.Number(
			element,
			null,
			params);

	},

	_createSelectInput : function(postfix, params) {

		var element = $('<select' +
			' class="' + JZ.CSS_CLASS_WIDGET + '-' + postfix + '">' +
				$.map(JZ.Resources.getMonthsByType('genitive'), function(name, i) {
					return '<option value="' + (i + 1) + '">' + name +'</option>';
				}).join('') +
			'</select>');
		this._element.after(element);

		return new JZ.Widget.Input.Select(
			element,
			null,
			params);

	},

	_hasValue : function() {

		return true;

	}

});