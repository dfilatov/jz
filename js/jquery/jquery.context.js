(function($) {

$.proxy || ($.proxy = function( fn, proxy, thisObject ) {
	if ( arguments.length === 2 ) {
		if ( typeof proxy === "string" ) {
			thisObject = fn;
			fn = thisObject[ proxy ];
			proxy = undefined;

		} else if ( proxy && !jQuery.isFunction( proxy ) ) {
			thisObject = proxy;
			proxy = undefined;
		}
	}

	if ( !proxy && fn ) {
		proxy = function() {
			return fn.apply( thisObject || this, arguments );
		};
	}

	// Set the guid of unique handler to the same of original handler, so it can be removed
	if ( fn ) {
		proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;
	}

	// So proxy can be declared as an argument
	return proxy;
	}
);

})(jQuery);