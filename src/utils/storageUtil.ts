// Enregistrement du token
export function setToken(token: string) {
    chrome.storage.local.set({ token: token }, () => {
      console.log("Token enregistré dans chrome.storage");
    });
  }
  
  // Récupération du token
  export function getToken(): Promise<string | null> {
    return new Promise((resolve) => {
      chrome.storage.local.get(["token"], (result) => {
        console.log("Token récupéré depuis le stockage:", result.token);
        resolve(result.token || null);
      });
    });
  }
  
  // Suppression du token
  export function removeToken() {
    chrome.storage.local.remove("token", () => {
      console.log("Token supprimé de chrome.storage");
    });
  }
  