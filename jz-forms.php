<?php

$files = array(
    "js/jquery/jquery.context.js",
    "js/jquery/jquery.inherit.js",
    "js/jquery/jquery.debounce.js",
    "js/jz-forms/JZ.js",
    "js/jz-forms/JZ/Observable.js",
    "js/jz-forms/JZ/Widget.js",
    "js/jz-forms/JZ/Widget/Text.js",
    "js/jz-forms/JZ/Widget/Container.js",
    "js/jz-forms/JZ/Widget/Container/Form.js",
    "js/jz-forms/JZ/Builder.js",
    "js/jz-forms/init.js"
);

$result = "";
foreach($files as $file) {
    $result .= file_get_contents($file);
}
print($result);

?>