// Liste noire de domaines connus pour adultes
const forbiddenDomains = [
    "exampleporn.com",
    "violentsite.com",
    "adult-content.com",
    "badsites.net",
    "pornhub.com",
    "xvideos.com",
    "redtube.com",
    "xnxx.com",
    "youporn.com",
    "brazzers.com",
    "adultfriendfinder.com",
    "livejasmin.com",
    "airbnb.fr"
];

const forbiddenKeywords = [
    "porn",
    "violent",
    "xxx",
    "murder",
    "meurtre",
    "sexual",
    "assasin",
    "assassination",
    "pédophile",
    "pedophilia",
    "pedo",
    "tuer",
    "tuerie",
    "tue",
    "inappropriate",
    "nsfw",
    "sex",
    "erotic"
];

// https://www.airbnb.fr/rooms/52621429?adults=2&category_tag=Tag%3A4104&children=0&enable_m3_private_room=true&infants=0&pets=0&photo_id=1667039872&search_mode=flex_destinations_search&check_in=2025-01-03&check_out=2025-01-08&source_impression_id=p3_1732287557_P3IQ3z7DTBGIxxhx&previous_page_section_name=1000
// Liste de mots-clés sensibles dans les URLs

/**
 * Vérifie si le site actuel doit être bloqué.
 * @param url L'URL complète de la page web.
 * @returns true si le site est inapproprié, sinon false.
 */

export function shouldBlockUrl(url: string): boolean {
    try {
      // Créer une instance d'URL
      const parsedUrl = new URL(url);
  
      // Extraire le domaine (hostname)
      const domain = parsedUrl.hostname.toLowerCase();
  
      // Vérifier si le domaine est dans la liste interdite
      if (forbiddenDomains.some(forbiddenDomain => domain.includes(forbiddenDomain))) {
        console.log(`URL bloquée : Domaine interdit (${domain})`);
        return true;
      }
  
      // Extraire le chemin complet (path)
      const path = parsedUrl.pathname.toLowerCase();
  
      // Vérifier si un mot-clé interdit est dans le chemin
      if (forbiddenKeywords.some(keyword => path.includes(keyword))) {
        console.log(`URL bloquée : Mot-clé interdit dans le chemin (${path})`);
        return true;
      }
  
      // Extraire les paramètres de requête (query string)
      const query = parsedUrl.search.toLowerCase();
  
      // Vérifier si un mot-clé interdit est dans les paramètres de requête
      if (forbiddenKeywords.some(keyword => query.includes(keyword))) {
        console.log(`URL bloquée : Mot-clé interdit dans les paramètres (${query})`);
        return true;
      }
  
      // Si aucune condition de blocage n'est satisfaite, autoriser l'accès
      console.log(`URL autorisée : ${url}`);
      return false;
    } catch (error) {
      console.error(`Erreur lors de l'analyse de l'URL : ${error}`);
      return true; // Bloquer par défaut en cas d'erreur
    }
  }
  


/* export function isAdultSite(url: string): boolean {
    const domain = new URL(url).hostname.toLowerCase();

    // Vérifie si le domaine ou l'URL contient des contenus sensibles
    if (
        forbiddenDomains.some((blockedDomain) => domain.includes(blockedDomain)) ||
        forbiddenKeywords.some((keyword) => url.toLowerCase().includes(keyword))
    ) {
        return true;
    }

    return false;
} */
