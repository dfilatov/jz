JQUERY_PLUGINS_SRC = $(foreach i, inherit debounce identify memoize fieldselection, js/jquery/jquery.$i.js)
CORE_SRC = js/JZ.js $(foreach i, \
	Observable \
	Widget \
	Widget/Container \
	Widget/Container/Form \
	Widget/Button \
	Widget/Button/Submit \
	Widget/Input \
	Widget/Input/Text \
	Widget/Input/Text/Number \
	Widget/Input/Text/Combo \
	Widget/Input/Select \
	Widget/Input/State \
	Widget/Container/StateGroup \
	Widget/Container/StateGroup/CheckBoxes \
	Widget/Container/StateGroup/RadioButtons \
	Widget/Container/Date \
	Widget/Container/Date/Time \
	Storage \
	Storage/Local \
	Storage/Remote \
	Value \
	Value/Number \
	Value/Multiple \
	Value/Date \
	Value/Date/Time \
	Dependence \
	Dependence/Composition \
	Dependence/Composition/OR \
	Dependence/Composition/AND \
	Dependence/Composition/NOT \
	Dependence/Required \
	Dependence/Valid \
	Dependence/Enabled \
	Builder \
	Resources, \
	js/JZ/$i.js) js/init.js

ALL_SRC = $(JQUERY_PLUGINS_SRC) $(CORE_SRC)

build: $(ALL_SRC)
	cat $^ > jz.js

.PHONY: build