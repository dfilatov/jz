JZ.Storage.Local = $.inherit(JZ.Storage, {

	__constructor : function(params) {

		this.__base(params);
		this._searchList = $.map(params.list, function(item) {
			return params.itemProcessor.toString(item).toLowerCase();
		});

	},

	isEmpty : function() {

		return !this._searchList.length;

	},

	filter : function(val, callback) {

		var searchVal = val.toLowerCase(), searchList = this._searchList,
            params = this._params;
		callback(val, searchVal == ''? params.list : $.grep(params.list, function(val, i) {
			return searchList[i].indexOf(searchVal) > -1;
		}));

	}

});