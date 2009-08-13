$(function() {
	$('form.' + JZ.CSS_CLASS_WIDGET).each(function() {
		JZ.build($(this));
	});
	JZ.trigger('init');
});