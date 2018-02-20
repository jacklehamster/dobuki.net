<?php
namespace Dobuki;

interface Media {
    function upload(string $picture): array;
    public function get_image($md5);
}

class DokMedia implements Media {
    const IMGUR_AUTH_TOKEN = 'imgur_auth_token';
    const ALBUM_HASH = 'xbxrN';

    private $database;
    private $session;
    function __construct(Database $database, Session $session) {
        $this->database = $database;
        $this->session = $session;
    }

    public function get_image($md5) {
        $query_result = $this->database->query("
            SELECT url, type FROM media
            WHERE md5 = :md5
            LIMIT 1
        ", [
            ':md5' => $md5,
        ], false);

        $row = count($query_result) > 0 ? $query_result[0] : null;
        if ($row) {
            list($url, $content_type) = $row;
            header("Content-Type: $content_type");
            header("Cache-Control: max-age=2592000");
            echo file_get_contents($url);
        } else {
            header("HTTP/1.0 404 Not Found");
        }
    }

    public function upload(string $picture): array {
        if (!$picture) {
            return [
                'success' => false,
            ];
        }

        $base64 = substr($picture, strpos($picture,",") + 1);
        $data = base64_decode($base64);
        $md5 = md5($data);
        $query_result = $this->database->query("
            SELECT url FROM media 
            WHERE :md5 = md5
        ", [
            'md5' => $md5,
        ], false);

        if (count($query_result) === 0) {
            $access_token = $this->session->get_property(self::IMGUR_AUTH_TOKEN);
            if (!$access_token) {
                $client_id = 'aa1eed38c33f2c6';
                $refresh_token = '0c51c492e6499274b5dc7ce7187f447b5e5ab561';
                $client_secret = 'bf3c250a28331a613a81507fc720899d6ff89490';
                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, 'https://api.imgur.com/oauth2/token');
                curl_setopt($ch, CURLOPT_POST, true);
                curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
                    'client_id' => $client_id,
                    'refresh_token' => $refresh_token,
                    'client_secret' => $client_secret,
                    'grant_type' => 'refresh_token',
                ]));
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                $result = curl_exec($ch);
                curl_close($ch);
                $obj = json_decode($result);
                $access_token = $obj->access_token;
                $this->session->set_property(self::IMGUR_AUTH_TOKEN, $access_token);
            }

            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, 'https://api.imgur.com/3/image');
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                "Authorization: Bearer $access_token",
            ]);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
                'image' => $base64,
                'album' => self::ALBUM_HASH,
            ]));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            $result = curl_exec($ch);
            curl_close($ch);
            $obj = json_decode($result);

            $query_result = $this->database->query('
                INSERT INTO media (url, md5, type)
                VALUES (:url, :md5, :type) 
            ', [
                'url' => $obj->data->link,
                'md5' => $md5,
                'type' => $obj->data->type,
            ], true);

            return [
                'success' => true,
                'md5' => $md5,
                'url' => $obj->data->link,
                'data' => json_decode($result, true),
            ];

        }
        return [
            'success' => true,
            'md5' => $md5,
            'url' => $query_result[0]['url'],
        ];
    }
}
