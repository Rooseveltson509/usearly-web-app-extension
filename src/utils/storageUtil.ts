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

const TWENTY_FIVE_HOURS_IN_MS = 24 * 60 * 60 * 1000;
let memoryCache: { accessToken: string | null } = { accessToken: null };
// Stocke l'accessToken
export function setTokens(accessToken: string) {
  memoryCache.accessToken = accessToken; // Cache en mémoire
  chrome.storage.local.set({ accessToken }, () => {
    console.log("AccessToken enregistré dans chrome.storage :", accessToken);
  });
}

export async function getTokens(): Promise<{ accessToken: string | null }> {
  if (memoryCache.accessToken) {
    console.log("AccessToken récupéré depuis le cache mémoire :", memoryCache.accessToken);
    return { accessToken: memoryCache.accessToken };
  }

  return new Promise((resolve) => {
    chrome.storage.local.get(['accessToken'], (result) => {
      console.log("AccessToken récupéré depuis chrome.storage :", result.accessToken);
      resolve({ accessToken: result.accessToken || null });
    });
  });
}

// Supprime les tokens
export function removeTokens(): void {
  chrome.storage.local.remove(["accessToken", "refreshToken"], () => {
    if (chrome.runtime.lastError) {
      console.error("Erreur lors de la suppression des tokens :", chrome.runtime.lastError.message);
    } else {
      console.log("Tokens supprimés de chrome.storage");
    }
  });
}

// Stocke l'heure de connexion
export function setLoginTime(): void {
  const currentTime = Date.now();
  chrome.storage.local.set({ loginTime: currentTime }, () => {
    if (chrome.runtime.lastError) {
      console.error("Erreur lors de l'enregistrement de l'heure de connexion :", chrome.runtime.lastError.message);
    } else {
      console.log("Heure de connexion enregistrée :", currentTime);
    }
  });
}

export async function isTokenExpired(): Promise<boolean> {
  const { accessToken } = await getTokens();
  const { loginTime } = await new Promise<{ loginTime: number | null }>((resolve) => {
    chrome.storage.local.get(['loginTime'], (result) => {
      resolve({ loginTime: result.loginTime || null });
    });
  });

  if (!accessToken || !loginTime) {
    return true; // Pas de token ou pas d'heure de connexion
  }

  const currentTime = Date.now();
  const elapsedTime = currentTime - loginTime;

  const tokenLifetime = 3600000; // Exemple : 1 heure en millisecondes
  return elapsedTime > tokenLifetime;
}
