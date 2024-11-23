/**
 * Analyse une image pour détecter si elle est inappropriée.
 * @param imageUrl URL de l'image à analyser.
 * @returns Une promesse qui résout à `true` si l'image est inappropriée, `false` sinon.
 */
async function checkImageForInappropriateness(imageUrl: string): Promise<boolean> {
    try {
      const formData = new FormData();
  
      // Télécharge l'image en tant que Blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();
  
      formData.append("file", blob, "image.jpg");
  
      // Envoi de la requête à votre API
      const apiResponse = await fetch("http://127.0.0.1:8000/detect-image/", {
        method: "POST",
        headers: {
          "accept": "application/json",
        },
        body: formData,
      });
  
      const result = await apiResponse.json();
      console.log("Résultat de l'analyse :", result);
  
      return result.is_inappropriate; // Retourne si l'image est inappropriée
    } catch (error) {
      console.error("Erreur lors de l'analyse de l'image :", error);
      return false;
    }
  }
  