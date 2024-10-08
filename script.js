async function fetchMusicData() {
    const url = 'https://etl.mmp.li/hitsound/etl/unload.php';

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Netzwerkantwort war nicht ok: ' + response.statusText);
        }
        const data = await response.json(); // Daten als JSON parsen
        displayHits(data); // Daten an die Anzeige-Funktion übergeben
    } catch (error) {
        console.error('Es gab ein Problem mit der Fetch-Anfrage:', error);
    }
}

function displayHits(data) {
    const carousel = document.getElementById('song-carousel');
    carousel.innerHTML = ''; // Container leeren

    const timeFrames = {
        "Morning Hits": data.morning,
        "Afternoon Hits": data.afternoon,
        "Night Hits": data.yesterday_night
    };

    for (const [timeFrame, hits] of Object.entries(timeFrames)) {
        hits.forEach((songData, index) => {
            const hitDiv = document.createElement('div');
            hitDiv.className = 'song-box';
            hitDiv.innerHTML = `
                <h2>${index + 1}</h2>
                <p><strong>${songData.song}</strong> von ${songData.artist}</p>
            `;
            carousel.appendChild(hitDiv);
        });
    }
}

// Event Listener zum Laden der Daten nach dem DOM-Content
document.addEventListener('DOMContentLoaded', fetchMusicData);

async function fetchMusicDataWeek() {
    const url = 'https://etl.mmp.li/hitsound/etl/unloadWeek.php';

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Netzwerkantwort war nicht ok: ' + response.statusText);
        }
        const data = await response.json(); // Daten als JSON parsen
        displayHitsWeek(data); // Daten an die Anzeige-Funktion übergeben
        displayTopArtistsWeek(data); // Top-Künstler der Woche anzeigen
    } catch (error) {
        console.error('Es gab ein Problem mit der Fetch-Anfrage:', error);
    }
}

function displayHitsWeek(data) {
    const hitsContainer = document.getElementById('weekly-hits');
    hitsContainer.innerHTML = ''; // Container leeren

    const allSongs = []; // Array, um alle Songs zu sammeln

    for (const date in data) {
        if (data.hasOwnProperty(date)) {
            const hits = data[date]; 

            if (Array.isArray(hits)) {
                hits.forEach(hit => {
                    allSongs.push(hit); 
                });
            } else {
                console.error('Erwartet, dass hits ein Array ist, aber erhalten:', hits);
            }
        }
    }

    const songCounts = countSongPlays(allSongs);

    const sortedSongs = Object.entries(songCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4);

    sortedSongs.forEach(([song, count], index) => {
        const songDiv = document.createElement('div');
        songDiv.className = 'song-box';

        const songData = allSongs.find(s => s.song === song);
        songDiv.innerHTML = `
            <h2>${index + 1}</h2>
            <p><strong>${song}</strong> von ${songData.artist}</p>
            <p>${count} Mal gespielt</p>
        `;
        hitsContainer.appendChild(songDiv);
    });
}

function displayTopArtistsWeek(data) {
    const artistContainer = document.getElementById('weekly-artists');
    artistContainer.innerHTML = ''; 

    const allSongs = []; 

    for (const date in data) {
        if (data.hasOwnProperty(date)) {
            const hits = data[date]; 

            if (Array.isArray(hits)) {
                hits.forEach(hit => {
                    allSongs.push(hit); 
                });
            } else {
                console.error('Erwartet, dass hits ein Array ist, aber erhalten:', hits);
            }
        }
    }

    const artistCounts = countArtistPlays(allSongs);

    const sortedArtists = Object.entries(artistCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4);

    sortedArtists.forEach(([artist, count], index) => {
        const artistDiv = document.createElement('div');
        artistDiv.className = 'song-box';

        artistDiv.innerHTML = `
            <h2>${index + 1}</h2>
            <p><strong>${artist}</strong></p>
            <p>${count} Mal gespielt</p>
        `;
        artistContainer.appendChild(artistDiv);
    });
}

// Helper Funktionen
function countSongPlays(songs) {
    const songCounts = {};
    songs.forEach(song => {
        const songName = song.song;
        songCounts[songName] = (songCounts[songName] || 0) + 1;
    });
    return songCounts;
}

function countArtistPlays(songs) {
    const artistCounts = {};
    songs.forEach(song => {
        const artistName = song.artist;
        artistCounts[artistName] = (artistCounts[artistName] || 0) + 1;
    });
    return artistCounts;
}

// Event Listener für die Wochen-Hits und Künstler
document.addEventListener('DOMContentLoaded', fetchMusicDataWeek);



/* //Funktion, um die Musikdaten zu holen
async function fetchMusicData() {
    const url = 'https://etl.mmp.li/hitsound/etl/unload.php';

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Netzwerkantwort war nicht ok: ' + response.statusText);
        }
        const data = await response.json(); // Daten als JSON parsen
        displayHits(data); // Daten an die Anzeige-Funktion übergeben
    } catch (error) {
        console.error('Es gab ein Problem mit der Fetch-Anfrage:', error);
    }
}

// Funktion, um die Anzahl der gespielten Lieder zu zählen
function countSongPlays(songs) {
    const songCounts = {};
    songs.forEach(song => {
        const songName = song.song;
        songCounts[songName] = (songCounts[songName] || 0) + 1;
    });
    return songCounts;
}

// Funktion, um die Anzahl der gespielten Künstler zu zählen
function countArtistPlays(songs) {
    const artistCounts = {};
    songs.forEach(song => {
        const artistName = song.artist;
        artistCounts[artistName] = (artistCounts[artistName] || 0) + 1;
    });
    return artistCounts;
}

// Funktion, um die Daten dynamisch anzuzeigen (mit Top 4 Songs pro Tageszeit)
function displayHits(data) {
    const hitsContainer = document.getElementById('hits-container');
    hitsContainer.innerHTML = ''; // Container leeren

    // Daten aus den Tageszeiten
    const timeFrames = {
        "Morning Hits": data.morning,
        "Afternoon Hits": data.afternoon,
        "Night Hits": data.yesterday_night
    };

    // Jede Tageszeit durchlaufen und Top 4 anzeigen
    for (const [timeFrame, hits] of Object.entries(timeFrames)) {
        // Song-Play-Counts berechnen
        const songPlayCounts = countSongPlays(hits);

        // Songs nach Anzahl der Wiedergaben sortieren und nur die Top 4 auswählen
        const sortedSongs = Object.entries(songPlayCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 4); // Nur die Top 4 Songs

        // Titel hinzufügen
        const timeFrameTitle = document.createElement('h3');
        timeFrameTitle.textContent = timeFrame;
        hitsContainer.appendChild(timeFrameTitle);

        // Rangliste der Top 4 Songs anzeigen
        sortedSongs.forEach(([song, count], index) => {
            const songData = hits.find(s => s.song === song);
            const hitDiv = document.createElement('div');
            hitDiv.className = 'hit';
            hitDiv.innerHTML = `<h4>Rang #${index + 1}</h4>
                                <strong>${song}</strong> von ${songData.artist} - <strong>${count} Mal gespielt</strong>`;
            hitsContainer.appendChild(hitDiv);
        });
    }
}

// Event Listener zum Laden der Daten nach dem DOM-Content
document.addEventListener('DOMContentLoaded', fetchMusicData);
document.addEventListener('DOMContentLoaded', fetchMusicDataWeek);

// Funktion, um die Anzahl der gespielten Lieder zu zählen (für Wochen-Hits)
function countSongPlaysWeek(songs) {
    const songCounts = {};
    songs.forEach(song => {
        const songName = song.song;
        songCounts[songName] = (songCounts[songName] || 0) + 1;
    });
    return songCounts;
}

// Funktion, um die Wochen-Hits anzuzeigen (wie gehabt)
async function fetchMusicDataWeek() {
    const url = 'https://etl.mmp.li/hitsound/etl/unloadWeek.php';

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Netzwerkantwort war nicht ok: ' + response.statusText);
        }
        const data = await response.json(); // Daten als JSON parsen
        displayHitsWeek(data); // Daten an die Anzeige-Funktion übergeben
        displayTopArtistsWeek(data); // Top-Künstler der Woche anzeigen
    } catch (error) {
        console.error('Es gab ein Problem mit der Fetch-Anfrage:', error);
    }
}

function displayHitsWeek(data) {
    const hitsContainer = document.getElementById('weekly-hits');
    hitsContainer.innerHTML = ''; // Container leeren

    const allSongs = []; // Array, um alle Songs zu sammeln

    // Über jedes Datum in den Daten iterieren
    for (const date in data) {
        if (data.hasOwnProperty(date)) { // Überprüfen, ob die Eigenschaft Teil des Objekts ist
            const hits = data[date]; // Array von Hits für das spezifische Datum abrufen

            if (Array.isArray(hits)) {
                hits.forEach(hit => {
                    allSongs.push(hit); // Jeden Song zu allSongs hinzufügen
                });
            } else {
                console.error('Erwartet, dass hits ein Array ist, aber erhalten:', hits);
            }
        }
    }

    // Die gespielten Lieder zählen
    const songCounts = countSongPlays(allSongs);

    // Die Songs nach Anzahl der Wiedergaben sortieren und nur die Top 4 auswählen
    const sortedSongs = Object.entries(songCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4); // Nur die Top 4 Songs

    // Die meistgespielten Lieder anzeigen
    sortedSongs.forEach(([song, count], index) => {
        const songDiv = document.createElement('div');
        songDiv.className = 'song-box'; // Klasse für Styling

        const songData = allSongs.find(s => s.song === song);
        songDiv.innerHTML = `<h4>Rang #${index + 1}</h4>
                             <p><strong>${song}</strong> von ${songData.artist}</p>
                             <p>${count} Mal gespielt</p>`;

        hitsContainer.appendChild(songDiv);
    });
}

// Funktion, um die meistgespielten Künstler der letzten Woche anzuzeigen
function displayTopArtistsWeek(data) {
    const artistContainer = document.getElementById('weekly-artists');
    artistContainer.innerHTML = ''; // Container leeren

    const allSongs = []; // Array, um alle Songs zu sammeln

    // Über jedes Datum in den Daten iterieren
    for (const date in data) {
        if (data.hasOwnProperty(date)) { // Überprüfen, ob die Eigenschaft Teil des Objekts ist
            const hits = data[date]; // Array von Hits für das spezifische Datum abrufen

            if (Array.isArray(hits)) {
                hits.forEach(hit => {
                    allSongs.push(hit); // Jeden Song zu allSongs hinzufügen
                });
            } else {
                console.error('Erwartet, dass hits ein Array ist, aber erhalten:', hits);
            }
        }
    }

    // Die gespielten Künstler zählen
    const artistCounts = countArtistPlays(allSongs);

    // Die Künstler nach Anzahl der Wiedergaben sortieren und nur die Top 4 auswählen
    const sortedArtists = Object.entries(artistCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4); // Nur die Top 4 Künstler

    // Die meistgespielten Künstler anzeigen
    sortedArtists.forEach(([artist, count], index) => {
        const artistDiv = document.createElement('div');
        artistDiv.className = 'song-box'; // Klasse für Styling

        artistDiv.innerHTML = `<h4>Rang #${index + 1}</h4>
                               <p><strong>${artist}</strong></p>
                               <p>${count} Mal gespielt</p>`;

        artistContainer.appendChild(artistDiv);
    });
}
*/