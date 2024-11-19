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
const API_URL_DEV = 'https://1073-2a01-cb08-512-d600-29df-3525-253f-fd48.ngrok-free.app/api/v1';


export async function login(email: string, password: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL_DEV}/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      //mode: 'cors'
    });
    const data = await response.json();
    if (data.token) {
        console.log("data: ", data)
      await setToken(data.token); // Stocke le token avec chrome.storage
      return true;
    } else {
      throw new Error('Authentification échouée');
    }
  } catch (error) {
    console.error('Erreur de connexion:', error);
    return false;
  }
}

export async function isUserAuthenticated(): Promise<boolean> {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ action: 'isAuthenticated' }, (response) => {
            if (chrome.runtime.lastError) {
                console.error("Erreur de communication avec le script de fond :", chrome.runtime.lastError.message);
                resolve(false); // Considérez l'utilisateur comme non authentifié en cas d'erreur
            } else {
                resolve(response?.isAuthenticated ?? false); // Assurez-vous que `response` est défini
            }
        });
    });
}


/* export function login(email: string, password: string): Promise<boolean> {
    return new Promise((resolve) => {
        const timeout = setTimeout(() => {
            console.error("Timeout pour la réponse du script de fond.");
            resolve(false); // Forcer la résolution après un délai
        }, 5000); // Timeout de 5 secondes

        chrome.runtime.sendMessage({ action: 'login', email, password }, (response) => {
            clearTimeout(timeout); // Annule le timeout si la réponse arrive à temps
            if (chrome.runtime.lastError) {
                console.error("Erreur de communication avec le script de fond :", chrome.runtime.lastError.message);
                resolve(false);
            } else {
                resolve(response?.success ?? false);
            }
        });
    });
} */



export function logout() {
  chrome.runtime.sendMessage({ action: "logout" }, (response) => {
    if (response.success) {
        console.log("Déconnexion réussie");
    }
});
    //chrome.runtime.sendMessage({ action: 'logout' });
}