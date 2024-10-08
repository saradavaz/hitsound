<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Include the config file
require_once 'config.php';

// Funktion, um die Daten per API abzurufen
function fetchMusicData() {
    $url = "https://il.srgssr.ch/integrationlayer/2.0/srf/songList/radio/byChannel/69e8ac16-4327-4af4-b873-fd5cd6e895a7";
    
    // Initialisiert eine cURL-Sitzung
    $ch = curl_init($url);

    // Setzt Optionen
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    // Führt die cURL-Sitzung aus und erhält den Inhalt
    $response = curl_exec($ch);

    // Überprüft auf Fehler
    if(curl_errno($ch)) {
        echo 'Error:' . curl_error($ch);
    }

    // Schließt die cURL-Sitzung
    curl_close($ch);

    // Dekodiert die JSON-Antwort und gibt Daten zurück
    return json_decode($response, true);
}

// Abrufen der Daten
$data = fetchMusicData();



// Establish database connection
try {
    $pdo = new PDO($dsn, $username, $password, $options);
    } catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
    }

// SQL-Statement vorbereiten
$sql = "INSERT INTO hitsound (artist, song, played_time) VALUES (:artist, :song, :played_time)";
$stmt = $pdo->prepare($sql);

// Daten aus der API in die Datenbank einfügen
foreach ($data['songList'] as $song) {
    if (isset($song['artist']['name']) && isset($song['title']) && isset($song['date'])) {
        // Konvertiere das Datum in das richtige Format für MySQL DATETIME
        $played_time = date('Y-m-d H:i:s', strtotime($song['date']));

        // Füge den Song in die Datenbank ein
        $stmt->execute([
            ':artist' => $song['artist']['name'],
            ':song' => $song['title'],
            ':played_time' => $played_time
        ]);
    } else {
        echo "Skipping song due to missing data.\n";
    }
}

echo "Songs successfully inserted into the database.";

?>