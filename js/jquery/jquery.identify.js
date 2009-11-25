/**
 * Identify plugin
 *
 * Copyright (c) 2009 Filatov Dmitry (alpha@zforms.ru)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * @version 1.0.0
 */

(function($) {

var idCounter = 1;

$.identify = function(obj) {
	return obj.__id || (obj.__id = idCounter++);
};

})(jQuery);