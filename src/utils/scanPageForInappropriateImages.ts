/**
 * Analyse les images de la page et masque celles jugées inappropriées.
 */
async function scanPageForInappropriateImages(): Promise<void> {
    const images = document.querySelectorAll<HTMLImageElement>("img"); // Sélectionne toutes les balises <img>
  
    images.forEach(async (img) => {
      const isInappropriate = await checkImageForInappropriateness(img.src);
      if (isInappropriate) {
        img.style.filter = "blur(10px)"; // Applique un effet de flou
        console.log(`Image inappropriée détectée et masquée : ${img.src}`);
      }
    });
  }
  