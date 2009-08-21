JZ.Resources = {

	lang : $(document.documentElement).attr('lang') || 'ru',

	months : {
		ru : {
			'normal'   : ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
			'genitive' : ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
		},
		en : {
			'normal'   : ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'],
			'genitive' : ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']
		}
	},

	daysOfWeek : {
		ru : ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'],
		en : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
	},

	numberSeparators : {
		ru : ',',
		en : '.'
	},

	getDaysOfWeek : function() {

		return this.daysOfWeek[this.lang];

	},

	getMonthsByType : function(type) {

		return this.months[this.lang][type];

	},

	getNumberSeparator : function() {

		return this.numberSeparators[this.lang];

	}

};