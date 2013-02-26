JZ.Storage.Remote = $.inherit(JZ.Storage, {

	__constructor : function(params) {

		this.__base(params);
		this._checkInitialList = true;

	},

	filter : function(value, callback) {

		var params = this._params;

		if(this._checkInitialList) {
			this._checkInitialList = false;
			if(params.list) {
				callback(value, params.list);
				delete params.list;
			}
			return;
		}

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