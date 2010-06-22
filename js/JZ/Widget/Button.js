JZ.Widget.Button = $.inherit(JZ.Widget, {

	_bindEvents : function() {

		return this
			.__base()
			._bindToElem('click', this._onClick);


	},

	_onClick : function(e) {

		this.trigger('click', { originalEvent : e });

	},

	_enableElems : function() {

		this._elem.attr('disabled', false);

	},

	_disableElems : function() {

		this._elem.attr('disabled', true);

	}

});