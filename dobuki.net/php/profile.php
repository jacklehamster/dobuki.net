<?php
namespace Dobuki;

interface Profile {
    function show_picture(string $username, string $format);
    function save(string $profile_picture);
}

class DokProfile implements Profile {
    private $database;
    private $session;

    function __construct(Database $database, Session $session) {
        $this->database = $database;
        $this->session = $session;
    }

    public function show_picture(string $username, string $format) {
        $content_type = 'image/png';
        $column = $format==='thumbnail.png' ? 'thumbnail' : 'picture';
        $query_result = $this->database->query("
            SELECT profiles.id,
              if($column IS NULL, picture, $column) as picture,
              $column IS NULL as missing_format,
              etag, last_modified
            FROM profiles
            INNER JOIN users ON users.id = profiles.id
            WHERE username=:user AND picture IS NOT NULL
            LIMIT 1
        ", [
            ':user' => $username,
        ], false);

        $row = count($query_result) > 0 ? $query_result[0] : null;
        $picture = $row ? $row['picture'] : null;

        if ($picture !== null) {
            $last_modified = gmdate("D, d M Y H:i:s", time() + strtotime($row['last_modified'])) . " GMT";
            if($row['missing_format']) {
                $imagick = new \Imagick();
                $imagick->readImageBlob($row['picture']);
                try {
                    $imagick->scaleImage(80, 80);
                    $picture = $imagick->getImageBlob();
                } catch (\ImagickException $e) {
                }

                $update_result = $this->database->query("
                    UPDATE profiles SET $column = :image_blob
                    WHERE id=:id
                ", [
                    ':id' => $row['id'],
                    ':image_blob' => $picture,
                ], true);
            } else {
                $picture = $row['picture'];
            }
            $etag = "{$row['etag']}-$format";
        }

        if ($picture === null) {
            header('Content-Type: image/jpeg');
            header('ETag: ' . md5('-----DEFAULT PROFILE----'));
            $file = 'public/assets/defaultprofile.jpg';
            readfile($file);
        } else {
            header("Content-Type: $content_type");
            header("ETag: $etag");
            header("Last-Modified: $last_modified");

            $passed_last_modified = @$_SERVER['HTTP_IF_MODIFIED_SINCE'];
            $passed_etag = @$_SERVER['HTTP_IF_NONE_MATCH'];
            if ($etag === $passed_etag || $last_modified = $passed_last_modified) {
                header("HTTP/1.1 304 Not Modified");
            } else {
                echo $picture;
            }
        }
    }

    public function save(string $profile_picture) {
        $data = $profile_picture;
        $data = substr($data,strpos($data,",")+1);
        $data = base64_decode($data);
        $query_result = $this->database->query("
            INSERT INTO profiles (id, picture, etag)
            VALUES (:id, :picture, :etag)
            ON DUPLICATE KEY UPDATE
                picture = :picture,
                etag = :etag,
                thumbnail = NULL
        ", [
            ':id' => $this->session->get_id(),
            ':picture' => $data,
            ':etag' => md5($data),
        ], true);

        if ($query_result > 0) {
            $this->session->set_refresh_now();
            return [
                'success' => true,
                'result' => $query_result,
            ];
        } else {
            return [
                'success' => false,
                'message' => 'Failed to save profile',
                'result' => $query_result,
            ];
        }
    }
}
