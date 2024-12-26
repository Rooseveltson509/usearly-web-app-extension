import { getTokens } from "../utils/storageUtil";

const API_URL = 'https://usearlyapi.fly.dev/api/v1';

// Fonction de vérification du token
export async function verifyAccessToken(accessToken: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/user/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      console.log("AccessToken valide.");
      return true;
    } else if (response.status === 401) {
      console.error("AccessToken expiré ou invalide.");
      return false;
    } else {
      console.error("Erreur inattendue lors de la vérification du token :", response.status);
      return false;
    }
  } catch (error) {
    console.error("Erreur lors de la vérification du token :", error);
    return false;
  }
}

/*  
export async function refreshTokens(): Promise<boolean> {
  const { refreshToken } = await getTokens(); // Assurez-vous de le stocker dans le futur

  if (!refreshToken) {
    console.log("Aucun refreshToken disponible.");
    return false;
  }

  try {
    const response = await fetch(`${API_URL}/user/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      console.error("Échec du renouvellement du token :", response.statusText);
      return false;
    }

    const data = await response.json();
    if (data.accessToken) {
      setTokens(data.accessToken); // Met à jour l'accessToken
      setLoginTime(); // Met à jour l'heure de connexion
      return true;
    }

    return false;
  } catch (error) {
    console.error("Erreur lors du renouvellement du token :", error);
    return false;
  }
}

   */

