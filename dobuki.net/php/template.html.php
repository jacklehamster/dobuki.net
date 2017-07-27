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
    <link href="https://fonts.googleapis.com/css?family=Concert+One|Fredoka+One" rel="stylesheet">
    <link rel="prefetch"  href="/assets/dobuki.png" as "image"/>
    <link rel="prefetch"  href="/assets/signin.svg" as "image"/>
    <link rel="shortcut icon" href="<?= $this->favicon ?>" />
    <script src="https://unpkg.com/react@latest/dist/react.min.js"></script>
    <script src="https://unpkg.com/react-dom@latest/dist/react-dom.min.js"></script>
    <link rel="stylesheet" type="text/css" href="/components.css"/>
    <script src="/components.js"></script>
    <? $this->insertStyleSheet() ?>
    <? $this->insertScript() ?>
</head>

<body>
    <div id="root"></div>
    <? $this->renderContent() ?>
    <? include_once "vendor/analyticstracking.php" ?>
</body>
</html>