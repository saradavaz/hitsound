// Funktion, um die Musikdaten zu holen
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

// Funktion, um die Daten dynamisch anzuzeigen
function displayHits(data) {
    // Daten aus verschiedenen Zeitabschnitten kombinieren
    const allHits = [...data.morning, ...data.afternoon, ...data.yesterday_night];

    // Song-Play-Counts berechnen
    const songPlayCounts = countSongPlays(allHits);

    // Container für alle Hits auswählen
    const hitsContainer = document.getElementById('hits-container');
    hitsContainer.innerHTML = ''; // Container leeren, bevor neue Elemente hinzugefügt werden

    // Titel hinzufügen
    const hitsTitle = document.createElement('h3');
    hitsTitle.textContent = 'All Hits';
    hitsContainer.appendChild(hitsTitle);

    // Alle Hits in einer Schleife durchlaufen und anzeigen
    allHits.forEach(hit => {
        const hitDiv = document.createElement('div');
        hitDiv.className = 'hit';
        hitDiv.innerHTML = `<strong>${hit.song}</strong> von ${hit.artist} - <strong>Plays: ${songPlayCounts[hit.song]}</strong>`;
        hitsContainer.appendChild(hitDiv);
    });
}

// Event Listener zum Laden der Daten nach dem DOM-Content
document.addEventListener('DOMContentLoaded', fetchMusicData);
document.addEventListener('DOMContentLoaded', fetchMusicDataWeek);




async function fetchMusicDataWeek() {
    const url = 'https://etl.mmp.li/hitsound/etl/unloadWeek.php';

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Netzwerkantwort war nicht ok: ' + response.statusText);
        }
        const data = await response.json(); // Daten als JSON parsen
        displayHitsWeek(data); // Daten an die Anzeige-Funktion übergeben
    } catch (error) {
        console.error('Es gab ein Problem mit der Fetch-Anfrage:', error);
    }
}

function displayHitsWeek(data) {
    const hitsContainer = document.getElementById('weekly-hits');
    hitsContainer.innerHTML = ''; // Clear the container before adding new elements

    // Iterate over each date in the data object
    for (const date in data) {
        if (data.hasOwnProperty(date)) { // Check if the property is part of the object
            const hits = data[date]; // Access the array of hits for the specific date

            // Create a header for the date
            const dateHeader = document.createElement('h3');
            dateHeader.innerText = date; // Set the header text to the date
            hitsContainer.appendChild(dateHeader); // Append the date header

            // Check if hits is an array
            if (Array.isArray(hits)) {
                hits.forEach(hit => {
                    const hitDiv = document.createElement('div'); // Create a div for each hit
                    hitDiv.className = 'hit';
                    hitDiv.innerHTML = `<strong>${hit.song}</strong> von ${hit.artist}`;
                    hitsContainer.appendChild(hitDiv); // Append the hit div
                });
            } else {
                console.error('Expected hits to be an array, but got:', hits);
            }
        }
    }
}





// async function fetchMusicData() {
//     const url = 'https://etl.mmp.li/hitsound/etl/unload.php';
//     try {
//         const response = await fetch(url);
//         if (!response.ok) {
//             throw new Error('Netzwerkantwort war nicht ok: ' + response.statusText);
//         }
//         const data = await response.json(); // Daten als JSON parsen
//         console.log(data); // Die Daten in der Konsole ausgeben
//     } catch (error) {
//         console.error('Es gab ein Problem mit der Fetch-Anfrage:', error);
//     }
// }
// fetchMusicData();



// const hitsData = {
//     currentHits: [
//         { title: "Hit 1", artist: "Künstler A" },
//         { title: "Hit 2", artist: "Künstler B" },
//         { title: "Hit 3", artist: "Künstler C" },
//         { title: "Hit 4", artist: "Künstler D" },
//     ],
//     weeklyHits: [
//         { title: "Hit 5", artist: "Künstler E" },
//         { title: "Hit 6", artist: "Künstler F" },
//         { title: "Hit 7", artist: "Künstler G" },
//         { title: "Hit 8", artist: "Künstler H" },
//     ],
//     weeklyArtists: [
//         "Künstler 1",
//         "Künstler 2",
//         "Künstler 3",
//         "Künstler 4",
//     ],
// };

// function displayHits() {
//     const currentHitsContainer = document.getElementById('hits-container');
//     hitsData.currentHits.forEach(hit => {
//         const hitDiv = document.createElement('div');
//         hitDiv.className = 'hit';
//         hitDiv.innerHTML = `<strong>${hit.title}</strong> von ${hit.artist}`;
//         currentHitsContainer.appendChild(hitDiv);
//     });

//     const weeklyHitsContainer = document.getElementById('weekly-hits');
//     hitsData.weeklyHits.forEach(hit => {
//         const hitDiv = document.createElement('div');
//         hitDiv.className = 'hit';
//         hitDiv.innerHTML = `<strong>${hit.title}</strong> von ${hit.artist}`;
//         weeklyHitsContainer.appendChild(hitDiv);
//     });

//     const weeklyArtistsContainer = document.getElementById('weekly-artists');
//     hitsData.weeklyArtists.forEach(artist => {
//         const artistDiv = document.createElement('div');
//         artistDiv.className = 'hit';
//         artistDiv.innerHTML = `<strong>${artist}</strong>`;
//         weeklyArtistsContainer.appendChild(artistDiv);
//     });
// }

// document.addEventListener('DOMContentLoaded', displayHits);
