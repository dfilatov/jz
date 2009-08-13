JZ.Observable = $.inherit({

	bind : function(type, data, fn, context) {

		jQuery.event.bindWithContext(this, type, data, fn, context);
		return this;

	},

	unbind : function(type, fn) {

		jQuery.event.remove(this, type, fn);
		return this;

	},

	trigger : function(event, data) {

		var all, handler, handlers, i, namespace, namespaces, ret, type;

		type = event.type || event;

		event = typeof event === 'object' ?
			// jQuery.Event object
				event.preventDefault ? event :
					// Object literal
				jQuery.extend(jQuery.Event(type), event) :
			// Just the event type (string)
				jQuery.Event(type);

		if(type.indexOf('!') >= 0) {
			event.type = type = type.slice(0, -1);
			event.exclusive = true;
		}

		// Clean up in case it is reused
		event.result = undefined;
		event.target = this;

		// Clone the incoming data, if any
		data = jQuery.makeArray(data);
		data.unshift(event);

		event.currentTarget = this;

		// Namespaced event handlers
		namespaces = event.type.split('.');
		event.type = namespaces.shift();

		// Cache this now, all = true means, any handler
		all = !namespaces.length && !event.exclusive;

		namespace = RegExp('(^|\\.)' + namespaces.slice().sort().join('.*\\.') + '(\\.|$)');

		handlers = ( jQuery.data(this, 'events') || {} )[event.type];

		if(handlers) {
			for(i in handlers) {
				handler = handlers[i];

				// Filter the functions by class
				if(all || namespace.test(handler.type)) {
					// Pass in a reference to the handler function itself
					// So that we can later remove it
					event.handler = handler;
					event.data = handler.data;

					ret = handler.apply(this, data);

					if(ret !== undefined) {
						event.result = ret;
						if(ret === false) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		return this;

	},

	_delete : function() {

		var i, name, object;

		i = arguments.length;

		while(i--) {
			name = arguments[i];
			object = this[name];
			object && object.destroy && object.destroy();
			delete this[name];
		}

	}

});

$.extend(JZ, new JZ.Observable());