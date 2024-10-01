let currentIndex = 0;
const itemsToShow = 2; // Anzahl der sichtbaren Elemente
const totalItems = document.querySelectorAll('.carousel-item').length;

function slideCarousel(direction) {
  const carousel = document.querySelector('.carousel');
  const itemWidth = document.querySelector('.carousel-item').offsetWidth + 20; // Add margin-right for spacing
  const maxOffset = itemWidth * (totalItems - itemsToShow); // Berechne die maximale Verschiebung

  // Update current index
  currentIndex += direction;

  // Grenzen für das Karussell festlegen
  if (currentIndex < 0) {
    currentIndex = totalItems - itemsToShow; // Gehe zum Ende
  } else if (currentIndex > totalItems - itemsToShow) {
    currentIndex = 0; // Zurück zum Anfang
  }

  // Berechne die neue Position des Karussells
  const offset = Math.min(currentIndex * itemWidth, maxOffset);

  // Bewege das Karussell
  carousel.style.transform = `translateX(${-offset}px)`;
}

// Funktion für den Listen-Button
function listenSong(songTitle) {
  alert(`Now playing: ${songTitle}`);
}
