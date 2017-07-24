<!DOCTYPE html>
<html>
<head>
    <title><?= $this->title ?></title>
    <meta name="google" content="notranslate"/>
    <meta name="description" content="<?= $this->description ?>"/>
    <meta charset="UTF-8"/>
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="viewport" content="user-scalable=no,width=device-width, initial-scale=1.0,minimum-scale=1.0"/>
    <meta name="theme-color" content="<?= $this->theme_color ?>" />
    <link rel="preload" href="/comic_andy.ttf" as font/>
    <link rel="stylesheet" type="text/css" href="<?= $this->stylesheet ?>"/>
    <link rel="shortcut icon" href="<?= $this->favicon ?>" />
    <script src="https://unpkg.com/react@latest/dist/react.js"></script>
    <script src="https://unpkg.com/react-dom@latest/dist/react-dom.js"></script>
    <script src="/components.js"></script>
</head>

<body>
    <div id="root"></div>
    <? $this->renderContent() ?>
    <? include_once("analyticstracking.php") ?>
</body>