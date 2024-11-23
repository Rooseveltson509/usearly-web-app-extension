/**
 * Analyse une image capturée via votre API
 * @param base64Image L'image capturée au format base64
 * @returns {Promise<boolean>} Retourne `true` si l'image est inappropriée
 */
export async function analyzeCapturedImage(base64Image: string): Promise<boolean> {
    try {
      // Transformer l'image en Blob
      const blob = await (await fetch(base64Image)).blob();
  
      const formData = new FormData();
      formData.append("file", blob, "screenshot.png");
  
      const response = await fetch("http://127.0.0.1:8000/detect-image/", {
        method: "POST",
        headers: { "accept": "application/json" },
        body: formData,
      });
  
      const result = await response.json();
      console.log("Résultat de l'analyse :", result);
  
      return result.is_inappropriate; // Retourne si l'image est inappropriée
    } catch (error) {
      console.error("Erreur lors de l'analyse de l'image :", error);
      return false;
    }
  }
  