// Enregistrement des tokens
/* export function setTokens(accessToken: string, refreshToken: string | null) {
  chrome.storage.local.set({ accessToken, refreshToken }, () => {
    console.log("Tokens enregistrés dans chrome.storage :", {
      accessToken,
      refreshToken,
    });
  });
}
 */



// Récupération des tokens
/* export function getTokens(): Promise<{ accessToken: string | null; refreshToken: string | null }> {
  return new Promise((resolve) => {
    chrome.storage.local.get(["accessToken", "refreshToken"], (result) => {
      console.log("Tokens récupérés depuis le stockage:", result);
      resolve({
        accessToken: result.accessToken || null,
        refreshToken: result.refreshToken || null,
      });
    });
  });
} */
/*   export function getTokens(): { accessToken: string | null; refreshToken: string | null } {
    const accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
    return { accessToken, refreshToken };
  } */

/*     export async function getTokens(): Promise<{ accessToken: string | null; refreshToken: string | null }> {
      return new Promise((resolve) => {
        chrome.storage.local.get(["accessToken", "refreshToken"], (result) => {
          console.log("Tokens récupérés depuis chrome.storage :", result);
          resolve({
            accessToken: result.accessToken || null,
            refreshToken: result.refreshToken || null,
          });
        });
      });
    } */
export function setTokens(accessToken: string) {
  chrome.storage.local.set({ accessToken }, () => {
    console.log("AccessToken enregistré dans chrome.storage");
  });
}

export async function getTokens(): Promise<{ accessToken: string | null }> {
  return new Promise((resolve) => {
    chrome.storage.local.get(['accessToken'], (result) => {
      resolve({ accessToken: result.accessToken || null });
    });
  });
}


// Suppression des tokens
export function removeTokens() {
  chrome.storage.local.remove(["accessToken", "refreshToken"], () => {
    console.log("Tokens supprimés de chrome.storage");
  });
}

// Stocke l'heure de connexion
export async function setLoginTime() {
  const currentTime = Date.now();
  chrome.storage.local.set({ loginTime: currentTime }, () => {
    console.log("Heure de connexion enregistrée :", currentTime);
  });
}
