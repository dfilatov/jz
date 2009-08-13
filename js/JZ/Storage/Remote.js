JZ.Storage.Remote = $.inherit(JZ.Storage, {

	filter : function(value, callback) {

		if(!value) {
			return callback([]);
		}
		var params = {};
		params[this._params.name] = value;
		$.post(this._params.url, params, callback, this._params.type || 'json');

	}

});