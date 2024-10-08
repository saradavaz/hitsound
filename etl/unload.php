<?php

require_once 'config.php'; // Stellen Sie sicher, dass dies auf Ihre tatsächliche Konfigurationsdatei verweist

header('Content-Type: application/json');

try {
    $pdo = new PDO($dsn, $username, $password, $options);
    $cities = ['Bern', 'Chur', 'Zürich'];
    $results = [];

    foreach ($cities as $city) {
        // Bereitet eine SQL-Anfrage vor, um Wetterdaten für eine bestimmte Stadt zu holen, sortiert nach dem neuesten Datum
        $stmt = $pdo->prepare("SELECT * FROM hitsound");
        $stmt->execute(); // Führt die vorbereitete Anfrage mit der Stadt als Parameter aus
        $results[$city] = $stmt->fetchAll(); // Speichert die Ergebnisse im Array $results
    }

    echo json_encode($results); // Gibt die Wetterdaten im JSON-Format aus
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]); // Gibt einen Fehler im JSON-Format aus, falls eine Ausnahme auftritt
}
/*
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Include the config file
require_once 'config.php';

// Funktion, um die Daten per API abzurufen
function fetchMusicData() {
    $url = "https://il.srgssr.ch/integrationlayer/2.0/srf/songList/radio/byChannel/69e8ac16-4327-4af4-b873-fd5cd6e895a7";
    
    // Initialisiert eine cURL-Sitzung
    $ch = curl_init($url);
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

// Überprüfen, ob Daten vorhanden sind
if (isset($data['songList']) && is_array($data['songList'])) {
    // Establish database connection
    try {
        $pdo = new PDO($dsn, $username, $password, $options);
    } catch (PDOException $e) {
        die("Connection failed: " . $e->getMessage());
    }

    // SQL-Statement vorbereiten
    $sql = "INSERT INTO hitsound (artist, song, played_time) VALUES (:artist, :song, :played_time)";
    $stmt = $pdo->prepare($sql);

    // Beginne Transaktion
    $pdo->beginTransaction();
    try {
        foreach ($data['songList'] as $song) {
            if (isset($song['artist']['name']) && isset($song['title']) && isset($song['date'])) {
                $played_time = date('Y-m-d H:i:s', strtotime($song['date']));
                $stmt->execute([
                    ':artist' => $song['artist']['name'],
                    ':song' => $song['title'],
                    ':played_time' => $played_time
                ]);
            } else {
                echo "Skipping song due to missing data.\n";
            }
        }
        // Commit der Transaktion
        $pdo->commit();
        echo "Songs successfully inserted into the database.";
    } catch (Exception $e) {
        $pdo->rollBack();
        echo "Failed to insert data: " . $e->getMessage();
    }
} else {
    echo "No songs found in the API response.";
}
*/
?>
