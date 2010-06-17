JZ.Widget.Button = $.inherit(JZ.Widget, {

	_bindEvents : function() {

		return this
			.__base()
			._bindToElement('click', this._onClick);


	},

	_onClick : function(e) {

		this.trigger('click', { originalEvent : e });

	},	

	_enableElements : function() {

		this._element.attr('disabled', false);

	},

	_disableElements : function() {

		this._element.attr('disabled', true);

	}

});