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

// SQL-Statement für das Einfügen vorbereiten
$insertSql = "INSERT INTO hitsound (artist, song, played_time) VALUES (:artist, :song, :played_time)";
$insertStmt = $pdo->prepare($insertSql);

// SQL-Statement für das Überprüfen auf Duplikate vorbereiten
$checkSql = "SELECT COUNT(*) FROM hitsound WHERE played_time = :played_time";
$checkStmt = $pdo->prepare($checkSql);

// Daten aus der API in die Datenbank einfügen, aber nur wenn es kein Duplikat gibt
foreach ($data['songList'] as $song) {
    if (isset($song['artist']['name']) && isset($song['title']) && isset($song['date'])) {
        // Konvertiere das Datum in das richtige Format für MySQL DATETIME
        $played_time = date('Y-m-d H:i:s', strtotime($song['date']));

        // Überprüfe, ob bereits ein Eintrag mit dieser played_time existiert
        $checkStmt->execute([':played_time' => $played_time]);
        $count = $checkStmt->fetchColumn();

        if ($count == 0) {
            // Füge den Song in die Datenbank ein, wenn kein Duplikat vorhanden ist
            $insertStmt->execute([
                ':artist' => $song['artist']['name'],
                ':song' => $song['title'],
                ':played_time' => $played_time
            ]);
        } else {
            echo "Skipping duplicate song: " . $song['title'] . " by " . $song['artist']['name'] . "\n";
        }
    } else {
        echo "Skipping song due to missing data.\n";
    }
}

echo "Songs successfully inserted into the database.";

?>
