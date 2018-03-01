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
    <meta property="og:title" content="Dobuki Art and Games">
    <meta property="og:description" content="All the games and projects from Dobuki Studio.">
    <meta property="og:image" content="https://www.dobuki.net/assets/851x351.png">
    <meta property="og:url" content="http://www.dobuki.net">
    <meta property="og:site_name" content="Dobuki Art and Games">
    <meta name="twitter:title" content="Dobuki Art and Games">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:image" content="https://www.dobuki.net/assets/851x351.png">
    <meta name="twitter:image:alt" content="Dobuki Family">
    <meta name="twitter:site" content="@dobukistudio">

    <link href="https://fonts.googleapis.com/css?family=Concert+One|Fredoka+One" rel="stylesheet" media="none" onload="if(media!='all')media='all'">
    <link rel="prefetch"  href="/assets/dobuki.png" as "image"/>
    <link rel="prefetch" href="/assets/login.svg" as "image"/>
    <link rel="shortcut icon" href="<?= $this->favicon ?>" />
    <link rel="stylesheet" type="text/css" href="/components.css" media="none" onload="if(media!='all')media='all'"/>
    <? $this->insertStyleSheet() ?>
</head>

<body>
    <div id="root">
        <div style="background-color: #F0FCFF">
            <div class="banner">
                <div style="flex: 1; background-size: contain; background-repeat: no-repeat;
                background-position: center; background-image: url(/assets/banner.jpg)">
            </div>
        </div>
        <div style="padding: 20px 100px; display: flex; justify-content: center;
            text-align: center; flex-wrap: wrap;">
        <iframe frameBorder="0" style="margin-bottom: 20px"
                src="https://itch.io/embed/198002?bg_color=cefafd&amp;fg_color=222222&amp;link_color=186ae7&amp;border_color=bebebe"
                width="800" height="167" ></iframe>

        <iframe frameBorder="0"
                src="https://itch.io/embed/18395?bg_color=000000&amp;fg_color=9899ae&amp;link_color=5c5ffa&amp;border_color=333333"
                width="280" height="167" ></iframe>
        <iframe frameBorder="0"
                src="https://itch.io/embed/170227?bg_color=ecefe6&amp;fg_color=222222&amp;link_color=b0cc2e&amp;border_color=c0ca9f"
                width="280" height="167" ></iframe>
        <iframe frameBorder="0"
                src="https://itch.io/embed/170228?bg_color=e1daf6&amp;fg_color=222222&amp;link_color=d2d079&amp;border_color=a589c1"
                width="280" height="167" ></iframe>
        <iframe frameBorder="0"
                src="https://itch.io/embed/116068?bg_color=edf7f8&amp;fg_color=222222&amp;link_color=5c99fa&amp;border_color=c1c5c5"
                width="280" height="167" ></iframe>
        <iframe frameBorder="0"
                src="https://itch.io/embed/136767?bg_color=e79797&amp;fg_color=222222&amp;link_color=f0b214&amp;border_color=ff2525"
                width="280" height="167" ></iframe>
        <iframe frameBorder="0"
                src="https://itch.io/embed/122302?bg_color=eeffff&amp;fg_color=222222&amp;link_color=49a2ac&amp;border_color=bebebe"
                width="280" height="167" ></iframe>
        </div>

        <div style="display: flex; font-family: 'Concert One', cursive; align-items: center;
            justify-content: center; text-align: center; vertical-align: middle;">
        <h2>More games <a target="_blank" href="https://dobuki.weebly.com/">here</a></h2>
        </div>
    </div>
    <div style="text-align: right; font-size: 10px">
        Site by <a rel="author" href="https://plus.google.com/u/4/107340140805357940387">
            Jack Le Hamster</a>
    </div>
</body>
</html>

<script src="/cache-grab/https://unpkg.com/react@15/dist/react.min.js"></script>
<script src="/cache-grab/https://unpkg.com/react-dom@15/dist/react-dom.min.js"></script>
<script src="/components.js"></script>
<? $this->insertScript() ?>
<? $this->renderContent() ?>
<script src="/cache-grab/https://code.jquery.com/jquery-3.2.1.min.js"></script>
<script src="/cache-grab/https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.8.0/js/md5.min.js"></script>
<script src="/login.js"></script>
<? include "vendor/analyticstracking.php" ?>