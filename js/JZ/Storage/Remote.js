JZ.Storage.Remote = $.inherit(JZ.Storage, {

	filter : function(value, callback) {

		var params = this._params;
		$.ajax($.extend({
			success  : function(data) {
				callback(value, data);
			},
			error    : function() {
				callback(value, []);
			},
			dataType : 'json',
			data     : (function() {
				var result = {};
				result[params.name] = value;
				$.each(params.widgets, function() {
					result[this.getName()] = this.val();
				});
				return result;
			})()
		}, params.ajax));

	}

});