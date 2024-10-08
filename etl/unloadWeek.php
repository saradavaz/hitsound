<?php

require_once 'config.php'; // Verweis auf die Konfigurationsdatei

header('Content-Type: application/json');

try {
    $pdo = new PDO($dsn, $username, $password, $options);

    // Heutiges Datum und das Startdatum der Woche (7 Tage zurück)
    $today = date('Y-m-d');
    $week_start = date('Y-m-d', strtotime('-6 days')); // Startdatum der Woche
    $week_end = $today; // Enddatum der Woche

    // SQL-Statement, um Songs von der letzten Woche zu holen
    $stmt_week = $pdo->prepare("
        SELECT * 
        FROM hitsound 
        WHERE DATE(played_time) BETWEEN :week_start AND :week_end 
        ORDER BY played_time
    ");
    $stmt_week->execute(['week_start' => $week_start, 'week_end' => $week_end]);
    $week_songs = $stmt_week->fetchAll(PDO::FETCH_ASSOC);

    // Debugging: Ausgabe der Anzahl der Songs für die Woche
    error_log('Songs from the last week: ' . count($week_songs));

    // Gruppiere die Songs nach Wochentagen
    $songs_by_day = [];
    foreach ($week_songs as $song) {
        $day = date('Y-m-d', strtotime($song['played_time']));
        if (!isset($songs_by_day[$day])) {
            $songs_by_day[$day] = [];
        }
        $songs_by_day[$day][] = $song;
    }

    // Ergebnis als JSON ausgeben
    echo json_encode($songs_by_day);

} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}

?>
