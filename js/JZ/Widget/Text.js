JZ.Widget.Text = $.inherit(JZ.Widget, {

    _bindEvents : function() {

        this._element
            .bind('focus', this._onFocus, this)
            .bind('blur', this._onBlur, this)
            .bind('change keyup', this._onChange, this);

    },

    _onFocus : function() {

        this.addClass(this.__self.CSS_CLASS_FOCUSED);

    },

    _onBlur : function() {

        this.removeClass(this.__self.CSS_CLASS_FOCUSED);

    },

    _onChange : function() {

        this._updateValue();

    },

    _hasValue : function() {

        return true;

    },

    _extractValueFromElement : function() {

        return this._element.val();

    },

    _enableElements : function() {

        this._element.attr('disabled', false);

    },

    _disableElements : function() {

        this._element.attr('disabled', true);

    }

});