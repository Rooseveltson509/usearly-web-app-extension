export function unblurAllMedia(): void {
    // Déflouter toutes les images
    const images = document.querySelectorAll("img");
    images.forEach((img) => {
      (img as HTMLElement).style.filter = "";
    });
  
    // Déflouter toutes les vidéos
    const videos = document.querySelectorAll("video");
    videos.forEach((video) => {
      (video as HTMLElement).style.filter = "";
    });
  
    // Déflouter les arrière-plans avec des images
    const elementsWithBackground = document.querySelectorAll("[style*='background-image']");
    elementsWithBackground.forEach((el) => {
      (el as HTMLElement).style.filter = "";
    });
  
    // Supprimer la bannière d'avertissement
    const warningBanner = document.querySelector("#warning-banner");
    if (warningBanner) {
      warningBanner.remove();
    }
  }