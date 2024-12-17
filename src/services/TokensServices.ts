import { getTokens } from "../utils/storageUtil";

const API_URL = 'https://usearly-api.vercel.app/api/v1';

// Fonction de vérification du token
export async function verifyAccessToken(accessToken: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/user/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`, // Vérifiez ici
        },
        mode: 'cors',
      });
  
      if (response.ok) {
        console.log("Token valide.");
        return true;
      } else {
        console.error("Token non valide ou expiré.");
        return false;
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du token :", error);
      return false;
    }
  }
  
  
  export async function refreshAccessToken(): Promise<string | null> {
    const tokens = await getTokens();
  
    if (!tokens.refreshToken) {
      console.error("Aucun refreshToken trouvé. Redirection vers la connexion.");
      return null;
    }
  
    try {
      const response = await fetch(`${API_URL}/user/refresh-token`, {
        method: 'POST',
        credentials: 'include', // Envoie les cookies pour le refresh
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("Token d'accès rafraîchi avec succès.");
        return data.accessToken;
      } else {
        console.error("Échec lors du rafraîchissement du token.");
        return null;
      }
    } catch (error) {
      console.error("Erreur lors de la requête de rafraîchissement :", error);
      return null;
    }
  }
  
  
  