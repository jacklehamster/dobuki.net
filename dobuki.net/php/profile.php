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
              $column IS NULL as missing_format
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
        }

        if ($picture === null) {
            header('Content-Type: image/jpeg');
            $file = 'public/assets/defaultprofile.jpg';
            readfile($file);
        } else {
            header("Content-Type: $content_type");
            echo $picture;
        }
    }

    public function save(string $profile_picture) {
        $data = $profile_picture;
        $data = substr($data,strpos($data,",")+1);
        $data = base64_decode($data);
        $query_result = $this->database->query("
            INSERT INTO profiles (id, picture)
            VALUES (:id, :picture)
            ON DUPLICATE KEY UPDATE
                picture = :picture,
                thumbnail = NULL
        ", [
            ':id' => $this->session->get_id(),
            ':picture' => $data,
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
