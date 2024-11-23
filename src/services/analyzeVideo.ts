import { analyzeImage } from "./analyzeImage";
import { captureVideoFrame } from "./captureVideoFrame";

export function analyzeVideo(videoElement: HTMLVideoElement) {
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