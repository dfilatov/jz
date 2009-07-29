<?php

$files = array(
    "js/jquery/jquery.context.js",
    "js/jquery/jquery.inherit.js",
    "js/jquery/jquery.debounce.js",
    "js/JZ.js",
    "js/JZ/Observable.js",
    "js/JZ/Widget.js",
    "js/JZ/Widget/Text.js",
    "js/JZ/Widget/Text/Number.js",
    "js/JZ/Widget/Button.js",
    "js/JZ/Widget/Button/Submit.js",
    "js/JZ/Widget/Container.js",
    "js/JZ/Widget/Container/Form.js",
    "js/JZ/Value.js",
    "js/JZ/Dependence.js",
    "js/JZ/Dependence/Composition.js",
    "js/JZ/Dependence/Composition/AND.js",
    "js/JZ/Dependence/Composition/OR.js",
    "js/JZ/Builder.js",
    "js/init.js"
);

$result = "";
foreach($files as $file) {
    $result .= file_get_contents($file);
}
print($result);

?>