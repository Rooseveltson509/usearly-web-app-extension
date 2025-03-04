import { setTokens, setLoginTime, getTokens } from '../utils/storageUtil'; // Mise à jour pour chrome.storage

//const API_URL = 'https://usearlyapi.fly.dev/api/v1';
const API_URL = 'http://localhost:3000/api/v1';

  export async function login(email: string, password: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        console.error(`Échec de la connexion (${response.status}):`, response.statusText);
  
        // Optionnel : affiche un message utilisateur basé sur le code d'état HTTP
        if (response.status === 401) {
          //alert("Identifiants incorrects. Veuillez réessayer.");
        } else if (response.status >= 500) {
          //alert("Erreur serveur. Veuillez réessayer plus tard.");
        }
        return false;
      }
  
      const data = await response.json();
  
      if (data.accessToken) {
        setTokens(data.accessToken); // Stocke uniquement l'accessToken
        console.log("Connexion réussie. Token stocké.");
        setLoginTime(); // Met à jour l'heure de connexion
        return true;
      }
  
      console.error("Aucun accessToken reçu.");
      alert("Une erreur inattendue est survenue. Veuillez réessayer.");
      return false;
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      alert("Impossible de se connecter. Veuillez vérifier votre connexion réseau.");
      return false;
    }
  }
  
  
  export async function isUserAuthenticated(): Promise<boolean> {
    return new Promise(async (resolve) => {
      chrome.runtime.sendMessage({ action: 'isAuthenticated' }, async (response) => {
        if (chrome.runtime.lastError) {
          console.error("Erreur de communication avec le script de fond :", chrome.runtime.lastError.message);
          resolve(false);
        } else {
          const loginTime = await getLoginTime();
          if (loginTime) {
            const elapsedTime = Date.now() - loginTime;
            const FIVE_HOURS_IN_MS = 24 * 60 * 60 * 1000; // 24 hours before the login time expires in milliseconds since the last.
            //const FIVE_HOURS_IN_MS = 5 * 60 * 60 * 1000; 
  
            if (elapsedTime >= FIVE_HOURS_IN_MS) {
              //console.log(`Temps écoulé ::: ${elapsedTime / 1000} secondes. Déconnexion.`);
              logout(); // Déconnectez si 20 secondes sont écoulées
              resolve(false);
            } else {
              console.log(`Temps restant avant déconnexion ::: ${(FIVE_HOURS_IN_MS - elapsedTime) / 1000} secondes.`);
              resolve(response?.isAuthenticated ?? false);
            }
          } else {
            resolve(false); // Aucun login enregistré
          }
        }
      });
    });
  }
  

// Récupère l'heure de connexion
export async function getLoginTime(): Promise<number | null> {
  return new Promise((resolve) => {
    chrome.storage.local.get(['loginTime'], (result) => {
      resolve(result.loginTime || null);
    });
  });
}


export function logout(): void {
  chrome.storage.local.remove(["accessToken", "refreshToken", "loginTime"], () => {
    if (chrome.runtime.lastError) {
      console.error("Erreur lors de la déconnexion :", chrome.runtime.lastError.message);
    } else {
      console.log("Déconnexion réussie, données supprimées.");
    }
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

