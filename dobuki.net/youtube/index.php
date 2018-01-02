<?php

    $id = $_REQUEST['v'] ?? 'Wein-Dmy1ig';
    $code = $_REQUEST['code'] ?? 0;
    $type = $_REQUEST['type'] ?? null;
    $quality = $_REQUEST['quality'] ?? 0;

   $link = "https://www.youtube.com/watch?v=$id";
   $content = file_get_contents($link);
   if (preg_match_all("/url=(?P<url>https[^\\\\]+videoplayback[^\\\\]+)\\\\u0026/", $content, $matches)) {
        $urls = $matches['url'];
        $urls = array_map("urldecode", $urls);

        if($code) {
            header('Content-Type: text/plain');
        }

        $top_size = $quality ? 0 : PHP_INT_MAX;
        $url_to_fetch = null;
        if ($type==='audio') {
            $mime_type = 'audio/webm';
        } elseif ($type==='mp4') {
            $mime_type = 'video/mp4';
        } elseif ($type==='mobile') {
            $mime_type = 'video/3gpp';
        } else {
            $mime_type = 'video/webm';
        }
       $content_type = null;
        foreach($urls as $url) {
            $header = get_headers($url, 1);
            if($code) {
                echo("\n$url\n");
                print_r($header);
            } elseif ($header[0]==='HTTP/1.1 200 OK'
                    && $header['Content-Type']===$mime_type) {
                if (($quality && $header['Content-Length'] > $top_size)
                    || (!$quality && $header['Content-Length'] < $top_size)) {

                    $content_type = $header['Content-Type'];
                    header("Access-Control-Allow-Origin: *");
                    header("Content-Type: $content_type");
                    $url_to_fetch = $url;
                    $top_size = $header['Content-Length'];

                }
            }
        }

        if($url_to_fetch) {
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url_to_fetch);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_WRITEFUNCTION, function($curl, $data) {
                echo $data;
                return strlen($data);
            });
            $result = curl_exec($ch);
            curl_close($ch);
        }
   }
