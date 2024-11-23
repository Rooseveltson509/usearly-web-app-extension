export interface AnalyzeMediaResponse {
  is_inappropriate: boolean;
  inappropriate_probability: number;
}

export async function analyzeImage(
  imageDataUrl: string
): Promise<AnalyzeMediaResponse> {
  try {
    // Préparez les données pour l'API
    const formData = new FormData();
    const blob = await fetch(imageDataUrl).then((res) => res.blob());
    formData.append("file", blob);

    // Appel à l'API locale (remplacez par votre URL si nécessaire)
    const response = await fetch("http://127.0.0.1:8000/detect-image/", {
      method: "POST",
      body: formData,
    });

    console.log("Statut HTTP :", response.status);

    if (!response.ok) {
      console.error("Réponse non OK de l'API :", await response.text());
      throw new Error(`Erreur HTTP : ${response.status}`);
    }

    const data: AnalyzeMediaResponse = await response.json();
    if (data.inappropriate_probability > 0.8) {
      console.log("Image considérée comme inappropriée :", data);
      return data; // Retourne la réponse telle quelle
    } else {
      console.log("Image considérée comme appropriée :", data);
      return data; // Retourne la réponse telle quelle
    }
    /* console.log("Résultat de l'analyse :", data);
    return data; */
  } catch (error) {
    console.error("Erreur lors de l'analyse de l'image :", error);
    throw error;
  }
}
