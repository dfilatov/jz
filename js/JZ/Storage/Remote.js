JZ.Storage.Remote = $.inherit(JZ.Storage, {

	filter : function(value, callback) {

		var params = this._params;
		$.ajax($.extend(params.ajax, {
			success  : callback,
			error    : function() {
				callback([]);
			},
			dataType : params.ajax.dataType || 'json',
			data     : (function() {
				var result = {};
				result[params.name] = value;
				$.each(params.widgets, function() {
					result[this.getName()] = this.getValue();
				});
				return result;
			})()
		}));

	}

});