import { setTokens, removeTokens, setLoginTime, getTokens } from '../utils/storageUtil'; // Mise à jour pour chrome.storage
import { verifyAccessToken } from './TokensServices';

const API_URL = 'https://usearly-api.vercel.app/api/v1';

// Fonction de connexion
/* export async function login(email: string, password: string, rememberMe: boolean): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }), // Envoie l'indicateur "rememberMe"
    });
    const data = await response.json();

    if (response.ok && data.accessToken && data.refreshToken) {
      console.log('Connexion réussie, stockage des tokens.', data);

      // Stocke les tokens
      setTokens(data.accessToken);

      // Enregistrez les tokens en fonction de "Se souvenir de moi"
      if (rememberMe) {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
      } else {
        sessionStorage.setItem('accessToken', data.accessToken);
        sessionStorage.setItem('refreshToken', data.refreshToken);
      }

      return true;
    } else {
      console.error('Échec de la connexion :', data.message);
      throw new Error(data.message || 'Authentification échouée.');
    }
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    return false;
  }
} */

  export async function login(email: string, password: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        console.error("Échec de la connexion :", response.statusText);
        return false;
      }
  
      const data = await response.json();
  
      if (data.accessToken) {
        setTokens(data.accessToken); // Stockez uniquement accessToken
        console.log("Connexion réussie. Token stocké.");
        return true;
      }
  
      console.error("Aucun accessToken reçu.");
      return false;
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      return false;
    }
  }
  
  

  
// Vérifie si l'utilisateur est encore authentifié
export async function isUserAuthenticated(): Promise<boolean> {
  const tokens = await getTokens();

  if (!tokens.accessToken) {
    console.log("Aucun accessToken trouvé. Redirection vers la connexion...");
    return false; // Aucun token : l'utilisateur n'est pas authentifié
  }

  // Vérifie si l'Access Token est valide
  const isValid = await verifyAccessToken(tokens.accessToken);
  if (isValid) {
    return true; // Token valide
  }

  console.log("Aucun token valide. Redirection vers la connexion...");
  return false; // Aucun accessToken ni refreshToken valide
}

// Déconnecte l'utilisateur
export async function logout() {
  console.log('Déconnexion de l\'utilisateur.');

  // Supprimez les tokens du stockage
  removeTokens();

  // Supprimez également l'indication "rememberMe" si elle existe
  chrome.storage.local.remove(['rememberMe'], () => {
    console.log('Indicateur "Se souvenir de moi" supprimé.');
  });
}

// Récupère un token valide (soit l'Access Token actuel, soit un nouveau)
export async function getValidToken(): Promise<string | null> {
  const tokens = await getTokens();

  // Vérifie si l'accessToken existe
  if (tokens.accessToken) {
    return tokens.accessToken;
  }

  console.warn("Aucun accessToken valide trouvé.");
  return null;
}

