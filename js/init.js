$(function() {
	var time = new Date().getTime();
	$('form.' + JZ.CSS_CLASS_WIDGET).jz();
	document.title = new Date().getTime() - time;
});