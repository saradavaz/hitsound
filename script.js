async function fetchMusicData() {
    const url = 'https://etl.mmp.li/hitsound/etl/unload.php';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Netzwerkantwort war nicht ok: ' + response.statusText);
        }
        const data = await response.json(); // Daten als JSON parsen
        console.log(data['Bern']); // Die Daten in der Konsole ausgeben
    } catch (error) {
        console.error('Es gab ein Problem mit der Fetch-Anfrage:', error);
    }
}
fetchMusicData();



const hitsData = {
    currentHits: [
        { title: "Hit 1", artist: "Künstler A" },
        { title: "Hit 2", artist: "Künstler B" },
        { title: "Hit 3", artist: "Künstler C" },
        { title: "Hit 4", artist: "Künstler D" },
    ],
    weeklyHits: [
        { title: "Hit 5", artist: "Künstler E" },
        { title: "Hit 6", artist: "Künstler F" },
        { title: "Hit 7", artist: "Künstler G" },
        { title: "Hit 8", artist: "Künstler H" },
    ],
    weeklyArtists: [
        "Künstler 1",
        "Künstler 2",
        "Künstler 3",
        "Künstler 4",
    ],
};

function displayHits() {
    const currentHitsContainer = document.getElementById('hits-container');
    hitsData.currentHits.forEach(hit => {
        const hitDiv = document.createElement('div');
        hitDiv.className = 'hit';
        hitDiv.innerHTML = `<strong>${hit.title}</strong> von ${hit.artist}`;
        currentHitsContainer.appendChild(hitDiv);
    });

    const weeklyHitsContainer = document.getElementById('weekly-hits');
    hitsData.weeklyHits.forEach(hit => {
        const hitDiv = document.createElement('div');
        hitDiv.className = 'hit';
        hitDiv.innerHTML = `<strong>${hit.title}</strong> von ${hit.artist}`;
        weeklyHitsContainer.appendChild(hitDiv);
    });

    const weeklyArtistsContainer = document.getElementById('weekly-artists');
    hitsData.weeklyArtists.forEach(artist => {
        const artistDiv = document.createElement('div');
        artistDiv.className = 'hit';
        artistDiv.innerHTML = `<strong>${artist}</strong>`;
        weeklyArtistsContainer.appendChild(artistDiv);
    });
}

document.addEventListener('DOMContentLoaded', displayHits);
