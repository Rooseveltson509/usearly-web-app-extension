import { analyzeImage } from "./analyzeImage";

export function captureVideoFrame(videoElement: HTMLVideoElement): string | null {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
  
    if (!context) {
      console.error("Impossible d'obtenir le contexte du canvas.");
      return null;
    }
  
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
  
    return canvas.toDataURL('image/png'); // Retourne un Data URL
  }
  
  function analyzeVideo(videoElement: HTMLVideoElement) {
    console.log("Capture d'une frame de la vidéo pour analyse...");
    const frameDataUrl = captureVideoFrame(videoElement);
  
    if (frameDataUrl) {
      analyzeImage(frameDataUrl)
        .then((result) => {
          if (result.is_inappropriate) {
            console.warn("La vidéo contient un contenu inapproprié !");
            alert("Contenu inapproprié détecté dans la vidéo.");
          } else {
            console.log("La vidéo est appropriée.");
          }
        })
        .catch((error) => {
          console.error("Erreur lors de l'analyse de la vidéo :", error);
        });
    }
  }
  