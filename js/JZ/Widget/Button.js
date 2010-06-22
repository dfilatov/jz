JZ.Widget.Button = $.inherit(JZ.Widget, {

	_bindEvents : function() {

		return this
			.__base()
			._bindToElem('click', this._onClick);


	},

	_onClick : function(e) {

		this.trigger('click', { originalEvent : e });

	},

	_enableElements : function() {

		this._elem.attr('disabled', false);

	},

	_disableElements : function() {

		this._elem.attr('disabled', true);

	}

});