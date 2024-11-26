// authService.ts

/* import { getToken, setToken, removeToken } from '../utils/storageUtil';

const API_URL = 'https://usearly-api.vercel.app/api/v1';

// Vérifie si l'utilisateur est authentifié
export function isUserAuthenticated(): boolean {
  return !!getToken();
}

// Gère la connexion de l'utilisateur
export async function login(email: string, password: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      mode: 'cors', // Ajoute le mode CORS pour gérer les requêtes cross-origin
    });
    const data = await response.json();
    if (data.token) {
      setToken(data.token);
      return true;
    } else {
      throw new Error('Authentification échouée');
    }
  } catch (error) {
    console.error('Erreur de connexion:', error);
    return false;
  }
}

// Gère la déconnexion de l'utilisateur
export function logout() {
  removeToken();
} */
// AuthService.ts

import { setToken } from '../utils/storageUtil'; // Mise à jour pour chrome.storage

const API_URL = 'https://usearly-api.vercel.app/api/v1';
const API_URL_DEV = 'https://5b91-217-128-226-57.ngrok-free.app/api/v1';


export async function login(email: string, password: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL_DEV}/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (data.token) {
      console.log("data: ", data);

      await setToken(data.token); // Stocke le token avec chrome.storage
      await setLoginTime(); // Stocke l'heure de connexion
      return true;
    } else {
      throw new Error('Authentification échouée');
    }
  } catch (error) {
    console.error('Erreur de connexion:', error);
    return false;
  }
}

// Stocke l'heure de connexion
export async function setLoginTime() {
  const currentTime = Date.now();
  chrome.storage.local.set({ loginTime: currentTime });
}

// Récupère l'heure de connexion
export async function getLoginTime(): Promise<number | null> {
  return new Promise((resolve) => {
    chrome.storage.local.get(['loginTime'], (result) => {
      resolve(result.loginTime || null);
    });
  });
}

// Vérifie si l'utilisateur est encore authentifié (déconnexion après 20 secondes pour le test)
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
          //const FIVE_HOURS_IN_MS = 20 * 1000; // 20 secondes pour le test
          const FIVE_HOURS_IN_MS = 5 * 60 * 60 * 1000;
          
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

// Déconnecte l'utilisateur
export function logout() {
  chrome.runtime.sendMessage({ action: "logout" }, (response) => {
    if (response?.success) {
      console.log("Déconnexion réussie");
    }
  });

  // Supprime les informations de connexion
  chrome.storage.local.remove(['authToken', 'loginTime'], () => {
    console.log("Données utilisateur supprimées");
  });
}