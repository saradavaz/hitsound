<?php

require_once 'config.php'; // Verweis auf die Konfigurationsdatei

header('Content-Type: application/json');

try {
    $pdo = new PDO($dsn, $username, $password, $options);

    // Definiere Zeiträume für Morgen, Nachmittag und Nacht (im 24-Stunden-Format)
    $morning_start = '06:00:00';
    $morning_end = '12:00:00';
    $afternoon_start = '12:00:01';
    $afternoon_end = '18:00:00';
    $yesterday_night_start = '18:00:01'; // Gestern Nacht Start
    $yesterday_night_end = '23:59:59'; // Gestern Nacht Ende
    $this_night_start = '00:00:00'; // Heute Nacht Start
    $this_night_end = '05:59:59'; // Heute Nacht Ende

    // Heutiges Datum und das Datum von gestern abrufen
    $today = date('Y-m-d');
    $yesterday = date('Y-m-d', strtotime('-1 day'));

    // Aktuelle Uhrzeit abrufen
    $current_time = date('H:i:s');

    // SQL-Statement um Songs von heute zu holen
    $stmt_today = $pdo->prepare("SELECT * FROM hitsound WHERE DATE(played_time) = :today ORDER BY played_time");
    $stmt_today->execute(['today' => $today]);
    $today_songs = $stmt_today->fetchAll(PDO::FETCH_ASSOC);

    // SQL-Statement um die Nachmittagssongs von gestern zu holen (wenn aktuell morgen ist)
    if ($current_time < $morning_end) {
        $stmt_yesterday_afternoon = $pdo->prepare("SELECT * FROM hitsound WHERE DATE(played_time) = :yesterday AND TIME(played_time) >= :afternoon_start AND TIME(played_time) <= :afternoon_end ORDER BY played_time");
        $stmt_yesterday_afternoon->execute(['yesterday' => $yesterday, 'afternoon_start' => $afternoon_start, 'afternoon_end' => $afternoon_end]);
        $afternoon_songs = $stmt_yesterday_afternoon->fetchAll(PDO::FETCH_ASSOC);
    } else {
        $afternoon_songs = []; // Keine Nachmittagslieder von gestern, wenn es nicht Morgen ist
    }

    // SQL-Statement um die Nacht-Songs von gestern zu holen
    $stmt_yesterday_night = $pdo->prepare("SELECT * FROM hitsound WHERE DATE(played_time) = :yesterday AND TIME(played_time) >= :yesterday_night_start AND TIME(played_time) <= :yesterday_night_end ORDER BY played_time");
    $stmt_yesterday_night->execute(['yesterday' => $yesterday, 'yesterday_night_start' => $yesterday_night_start, 'yesterday_night_end' => $yesterday_night_end]);
    $yesterday_night_songs = $stmt_yesterday_night->fetchAll(PDO::FETCH_ASSOC);

    // SQL-Statement um die Nacht-Songs von heute zu holen (falls es noch Nacht ist)
    $stmt_this_night = $pdo->prepare("SELECT * FROM hitsound WHERE DATE(played_time) = :today AND TIME(played_time) >= :this_night_start AND TIME(played_time) <= :this_night_end ORDER BY played_time");
    $stmt_this_night->execute(['today' => $today, 'this_night_start' => $this_night_start, 'this_night_end' => $this_night_end]);
    $this_night_songs = $stmt_this_night->fetchAll(PDO::FETCH_ASSOC);

    // Debugging: Ausgabe der Anzahl der Songs für jede Kategorie
    error_log('Songs from today: ' . count($today_songs));
    error_log('Afternoon songs from yesterday: ' . count($afternoon_songs));
    error_log('Yesterday night songs: ' . count($yesterday_night_songs));
    error_log('This night songs: ' . count($this_night_songs));

    // Arrays für die verschiedenen Tageszeiten
    $morning_songs = [];

    // Sortiere die Songs von heute nach den Tageszeiten
    foreach ($today_songs as $song) {
        $play_time = date('H:i:s', strtotime($song['played_time'])); // Extrahiere die Uhrzeit

        if ($play_time >= $morning_start && $play_time <= $morning_end) {
            $morning_songs[] = $song;
        }
    }

    // Ergebnis als JSON ausgeben
    echo json_encode([
        'morning' => $morning_songs,
        'afternoon' => ($current_time < $morning_end) ? $afternoon_songs : $today_songs, // Include yesterday's afternoon if it's still morning
        'yesterday_night' => $yesterday_night_songs,
        'this_night' => $this_night_songs
    ]);

} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}

?>
