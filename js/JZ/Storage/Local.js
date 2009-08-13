JZ.Storage.Local = $.inherit(JZ.Storage, {

	__constructor : function(params) {

		this.__base(params);
		this._searchList = $.map(params.list, function(val) {
			return val.toLowerCase();
		});

	},

	filter : function(value, callback) {

		var searchVal = value.toLowerCase(), searchList = this._searchList;
		callback(searchVal == ''? this._params.list : $.grep(this._params.list, function(val, i) {
			return searchList[i].indexOf(searchVal) > -1;
		}));

	}

});