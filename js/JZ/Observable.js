JZ.Observable = $.inherit({

	bind : function(type, data, fn, ctx) {

        this._observers || (this._observers = {});

		if($.isFunction(data)) {
			ctx = fn;
			fn = data;
		}

		var i = 0, types = type.split(' '), typeNs;
		while(typeNs = types[i++]) {
			var hasNs = typeNs.indexOf('.') > -1;
			typeNs = hasNs? typeNs.split('.') : typeNs;
			type = hasNs? typeNs.shift() : typeNs;
			(this._observers[type] || (this._observers[type] = [])).push({
				ns   : hasNs? typeNs.sort().join('.') : null,
				fn   : fn,
				data : data,
				ctx  : ctx
			});
		}

		return this;

	},

	unbind : function(type, fn) {

        if(this._observers) {
            if(!arguments.length) {
                delete this._observers;
            }
            else {
                var i = 0, j, types = type.split(' '), observers, observer;
                while(type = types[i++]) {
                    var hasNs = type.indexOf('.') > -1,
                        ns = hasNs? type.split('.').sort() : null;
                    if(hasNs) {
                        type = ns.shift();
                        ns = new RegExp('(^|\\.)' + ns.sort().join('\\.(?:.*\\.)?') + '(\\.|$)');
                    }
                    if(type) {
                        observers = this._observers[type];
                        if(!observers) {
                            continue;
                        }
                        j = 0;
                        while(observer = observers[j++]) {
                            if((!fn || fn === observer.fn) &&
                               (!hasNs || (hasNs && observer.ns && ns.test(observer.ns)))) {
                                observers.splice(--j, 1);
                            }
                        }
                    }
                    else {
                        for(type in this._observers) {
                            observers = this._observers[type];
                            j = 0;
                            while(observer = observers[j++]) {
                                if((!fn || fn === observer.fn) && observer.ns && ns.test(observer.ns)) {
                                    observers.splice(--j, 1);
                                }
                            }
                        }
                    }
                }
            }
        }

		return this;

	},

	trigger : function(e, data) {

        if(this._observers) {
            typeof e === 'string' && (e = $.Event(e));

            var hasNs = e.type.indexOf('.') > -1,
                ns = hasNs? e.type.split('.') : null;

            if(hasNs) {
                e.type = ns.shift();
                ns = new RegExp('(^|\\.)' + ns.sort().join('\\.(?:.*\\.)?') + '(\\.|$)');
            }

            var observers = this._observers[e.type];
            if(observers) {
                var i = 0, observer, ret;
                while(observer = observers[i++]) {
                    if(hasNs && (!observer.ns || !ns.test(observer.ns))) {
                        continue;
                    }
                    e.data = observer.data;
                    ret = observer.fn.call(observer.ctx || window, e, data);
                    if(typeof ret !== 'undefined') {
                        e.result = ret;
                        if(ret === false) {
                            e.preventDefault();
                            e.stopPropagation();
                        }
                    }
                }
            }
        }

		return this;

	}

});