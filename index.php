<?php
header('Content-Type: application/json; charset=utf-8');

$rssAsString = file_get_contents($_GET['url']);
$rssAsXml = simplexml_load_string($rssAsString, 'SimpleXMLElement',  LIBXML_NOCDATA);

$rssAsJson = json_decode(json_encode($rssAsXml));

echo json_encode([
    "title" => $rssAsJson -> channel -> title,
    "item" => array_map(function($item) {
        $item -> link = $item -> guid;
        unset($item -> guid);
        return $item;
    }, $rssAsJson -> channel -> item)
], JSON_PRETTY_PRINT);
?>
