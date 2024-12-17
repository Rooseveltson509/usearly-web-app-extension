import { setTokens, removeTokens, setLoginTime, getTokens } from '../utils/storageUtil'; // Mise à jour pour chrome.storage
import { refreshAccessToken, verifyAccessToken } from './TokensServices';

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

  export async function login(email: string, password: string, rememberMe: boolean): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Permet d'envoyer et de recevoir les cookies
        body: JSON.stringify({ email, password, rememberMe }),
      });
  
      if (!response.ok) {
        // Si le code HTTP n'est pas dans la plage 200-299, lever une erreur
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur inconnue');
      }
      if (response.ok) {
        const data = await response.json();
        setTokens(data.accessToken, data.refreshToken || null); // Ajout des tokens
        console.log("Connexion réussie. Tokens stockés :", data);
        return true;
      }
      
      const data = await response.json();
      console.log("Données reçues :", data);
  
      if (data.accessToken) {
        setTokens(data.accessToken, data.refreshToken || null); // Stockez les tokens
        return true; // Connexion réussie
      } else {
        return false; // Aucun token reçu
      }
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      throw error; // Relancer l'erreur pour la gérer dans le composant
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

  // Si l'Access Token est invalide, tente de rafraîchir le token
  if (tokens.refreshToken) {
    console.log("Tentative de rafraîchissement du token d'accès.");
    const newAccessToken = await refreshAccessToken();

    if (newAccessToken) {
      // Mettre à jour les tokens
      await setTokens(newAccessToken, tokens.refreshToken);
      return true;
    } else {
      console.error("Échec du rafraîchissement du token. Déconnexion...");
      logout(); // Déconnecter si le refresh échoue
      return false;
    }
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

  if (tokens.accessToken) {
    const isValid = await verifyAccessToken(tokens.accessToken);
    if (isValid) {
      return tokens.accessToken;
    }
  }

  // Si l'Access Token n'est pas valide, tentez de le rafraîchir
  try {
    console.log('Tentative de rafraîchissement du token d\'accès.');
    const newAccessToken = await refreshAccessToken();

    if (newAccessToken) {
     setTokens(newAccessToken, tokens.refreshToken || null);
      return newAccessToken;
    }
    console.log('Tentative de rafraîchissement du token d\'accès.', newAccessToken);
  } catch (error) {
    console.error('Erreur lors de l\'obtention d\'un token valide :', error);
  }

  return null;
}

