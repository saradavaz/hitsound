// Funktion, um die Musikdaten der Homepage zu holen und 6 Songs im Karussell anzuzeigen
async function fetchMusicData() {
    const url = 'https://etl.mmp.li/hitsound/etl/unload.php';

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Netzwerkantwort war nicht ok: ' + response.statusText);
        }
        const data = await response.json();
        displayHits(data); // Daten im Karussell auf der Homepage anzeigen
        displayWeeklyHits(data); // Top Hits der Woche auf der Homepage anzeigen
        displayTopArtistsWeek(data); // Top Artists der Woche auf der Homepage anzeigen
    } catch (error) {
        console.error('Es gab ein Problem mit der Fetch-Anfrage:', error);
    }
}

// Anzeige der Songs im Karussell auf der Homepage (max. 6 Songs)
function displayHits(data) {
    const carousel = document.getElementById('song-carousel');
    carousel.innerHTML = ''; // Container leeren

    const timeFrames = {
        "Morning Hits": data.morning,
        "Afternoon Hits": data.afternoon,
        "Night Hits": data.yesterday_night
    };

    let songCount = 0; // Zähler für die Anzahl der angezeigten Songs
    const maxSongs = 4; // Maximal 4 Songs anzeigen

    for (const [timeFrame, hits] of Object.entries(timeFrames)) {
        hits.forEach((songData, index) => {
            if (songCount < maxSongs) { // Nur bis zu 6 Songs anzeigen
                const hitDiv = document.createElement('div');
                hitDiv.className = 'song-box';
                hitDiv.innerHTML = `
                    <h2>${index + 1}</h2>
                    <p><strong>${songData.song}</strong> von ${songData.artist}</p>
                `;
                carousel.appendChild(hitDiv);
                songCount++; // Zähler erhöhen
            }
        });
        if (songCount >= maxSongs) break; // Sobald 6 Songs erreicht sind, Schleife beenden
    }
}

// Funktion, um die Top Songs der Woche auf der Homepage anzuzeigen
function displayWeeklyHits(data) {
    const hitsContainer = document.getElementById('weekly-hits');
    hitsContainer.innerHTML = ''; // Container leeren

    const allSongs = [];

    for (const date in data) {
        if (data.hasOwnProperty(date)) {
            const hits = data[date];
            if (Array.isArray(hits)) {
                hits.forEach(hit => allSongs.push(hit));
            }
        }
    }

    const songCounts = countSongPlays(allSongs);

    const sortedSongs = Object.entries(songCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4); // Top 4 Songs der Woche

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

// Funktion, um die Top Artists der Woche auf der Homepage anzuzeigen
function displayTopArtistsWeek(data) {
    const artistContainer = document.getElementById('weekly-artists');
    artistContainer.innerHTML = ''; // Container leeren

    const allSongs = [];

    for (const date in data) {
        if (data.hasOwnProperty(date)) {
            const hits = data[date];
            if (Array.isArray(hits)) {
                hits.forEach(hit => allSongs.push(hit));
            }
        }
    }

    const artistCounts = countArtistPlays(allSongs);

    const sortedArtists = Object.entries(artistCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4); // Top 4 Artists der Woche

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

// Hilfsfunktion, um die Wiedergaben der Songs zu zählen
function countSongPlays(songs) {
    const songCounts = {};
    songs.forEach(song => {
        const songName = song.song;
        songCounts[songName] = (songCounts[songName] || 0) + 1;
    });
    return songCounts;
}

// Hilfsfunktion, um die Wiedergaben der Artists zu zählen
function countArtistPlays(songs) {
    const artistCounts = {};
    songs.forEach(song => {
        const artistName = song.artist;
        artistCounts[artistName] = (artistCounts[artistName] || 0) + 1;
    });
    return artistCounts;
}

// Event Listener zum Laden der Daten nach dem DOM-Content für die Homepage
document.addEventListener('DOMContentLoaded', fetchMusicData);
// Funktion, um die Musikdaten der Woche zu holen und die Diagramme darzustellen
async function fetchMusicDataWeek() {
    const url = 'https://etl.mmp.li/hitsound/etl/unloadWeek.php';

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Netzwerkantwort war nicht ok: ' + response.statusText);
        }
        const data = await response.json();
        displayArtistsChart(data); // 8 beste Artists anzeigen
        displaySongsChart(data); // 10 beste Songs anzeigen
    } catch (error) {
        console.error('Es gab ein Problem mit der Fetch-Anfrage:', error);
    }
}

// Funktion, um die Top 8 Artists in einem Kreisdiagramm darzustellen
function displayArtistsChart(data) {
    const allSongs = [];

    // Über die Daten iterieren und alle Songs sammeln
    for (const date in data) {
        if (data.hasOwnProperty(date)) {
            const hits = data[date];
            if (Array.isArray(hits)) {
                hits.forEach(hit => allSongs.push(hit));
            }
        }
    }

    const artistCounts = countArtistPlays(allSongs);

    // Die 8 meistgespielten Artists nach Häufigkeit sortieren
    const sortedArtists = Object.entries(artistCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8);

    const artistNames = sortedArtists.map(([artist]) => artist);
    const playCounts = sortedArtists.map(([, count]) => count);

    // Einfarbige Palette mit Abstufungen von "987CEC" (Violett)
    const backgroundColors = [
        'rgba(152, 126, 236, 1)', // Volles Violett
        'rgba(152, 126, 236, 0.9)', // 90% Opazität
        'rgba(152, 126, 236, 0.8)',
        'rgba(152, 126, 236, 0.7)',
        'rgba(152, 126, 236, 0.6)',
        'rgba(152, 126, 236, 0.5)',
        'rgba(152, 126, 236, 0.4)',
        'rgba(152, 126, 236, 0.3)'  // 30% Opazität
    ];

    // Chart.js nutzen, um ein Kreisdiagramm zu erstellen
    const ctx = document.getElementById('artistsChart').getContext('2d');
    const artistsChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: artistNames,
            datasets: [{
                data: playCounts,
                backgroundColor: backgroundColors,
                borderColor: '#393937',
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: true,
                    position: 'right',
                    labels: {
                        font: {
                            family: 'Poppins',
                            size: 18
                        },
                        color: '#393937',
                        // Callback zum Erstellen abgerundeter Legendenfarben
                        generateLabels: function (chart) {
                            const original = Chart.overrides.pie.plugins.legend.labels.generateLabels;
                            const labelsOriginal = original.call(this, chart);

                            labelsOriginal.forEach(label => {
                                label.pointStyle = 'roundedRect'; // Abgerundete Ecken
                            });

                            return labelsOriginal;
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            return `${label}: ${value} Mal`;
                        }
                    }
                }
            },
            elements: {
                point: {
                    radius: 5
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Funktion, um die Top 10 Songs in einem Balkendiagramm darzustellen
function displaySongsChart(data) {
    const allSongs = [];

    // Über die Daten iterieren und alle Songs sammeln
    for (const date in data) {
        if (data.hasOwnProperty(date)) {
            const hits = data[date];
            if (Array.isArray(hits)) {
                hits.forEach(hit => allSongs.push(hit));
            }
        }
    }

    const songCounts = countSongPlays(allSongs);

    // Die 10 meistgespielten Songs nach Häufigkeit sortieren
    const sortedSongs = Object.entries(songCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    const songNames = sortedSongs.map(([song]) => song);
    const playCounts = sortedSongs.map(([, count]) => count);

    // Chart.js nutzen, um ein Balkendiagramm zu erstellen
    const ctx = document.getElementById('songsChart').getContext('2d');
    const songsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: songNames,
            datasets: [{
                label: 'Anzahl der Wiedergaben',
                data: playCounts,
                backgroundColor: '#98FF70',
                borderColor: '#393937',
                borderWidth: 1,
                borderRadius: {
                    topLeft: 20,
                    topRight: 20
                } // Abrundung oben
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        display: false // Kachelhintergrund entfernen
                    },
                    ticks: {
                        font: {
                            family: 'Poppins',
                            size: 18
                        },
                        color: '#393937'
                    },
                    title: {
                        display: true,
                        text: ' ',
                        font: {
                            family: 'Poppins',
                            size: 18
                        },
                        color: '#393937'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: 'Poppins',
                            size: 18
                        },
                        color: '#393937'
                    },
                    title: {
                        display: true,
                        text: ' ',
                        font: {
                            family: 'Poppins',
                            size: 18
                        },
                        color: '#393937'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `${context.dataset.label}: ${context.raw} Mal`;
                        }
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Hilfsfunktion, um die Wiedergaben der Artists zu zählen
function countArtistPlays(songs) {
    const artistCounts = {};
    songs.forEach(song => {
        const artistName = song.artist;
        artistCounts[artistName] = (artistCounts[artistName] || 0) + 1;
    });
    return artistCounts;
}

// Hilfsfunktion, um die Wiedergaben der Songs zu zählen
function countSongPlays(songs) {
    const songCounts = {};
    songs.forEach(song => {
        const songName = song.song;
        songCounts[songName] = (songCounts[songName] || 0) + 1;
    });
    return songCounts;
}

// Event Listener für die Charts
document.addEventListener('DOMContentLoaded', fetchMusicDataWeek);
