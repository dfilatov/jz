JZ.Widget.Button = $.inherit(JZ.Widget, {

	_enableElements : function() {

        this._element.attr('disabled', false);

    },

    _disableElements : function() {

        this._element.attr('disabled', true);

    }    

});