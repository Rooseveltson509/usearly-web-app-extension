// Liste noire de domaines connus pour adultes
const adultDomains = [
    "pornhub.com",
    "xvideos.com",
    "redtube.com",
    "xnxx.com",
    "youporn.com",
    "brazzers.com",
    "adultfriendfinder.com",
    "livejasmin.com"
];
// https://www.airbnb.fr/rooms/52621429?adults=2&category_tag=Tag%3A4104&children=0&enable_m3_private_room=true&infants=0&pets=0&photo_id=1667039872&search_mode=flex_destinations_search&check_in=2025-01-03&check_out=2025-01-08&source_impression_id=p3_1732287557_P3IQ3z7DTBGIxxhx&previous_page_section_name=1000
// Liste de mots-clés sensibles dans les URLs
const adultKeywords = ["porn", "xxx", "sex", "erotic", "nsfw"];

/**
 * Vérifie si le site actuel doit être bloqué.
 * @param url L'URL complète de la page web.
 * @returns true si le site est inapproprié, sinon false.
 */
export function isAdultSite(url: string): boolean {
    const domain = new URL(url).hostname.toLowerCase();

    // Vérifie si le domaine ou l'URL contient des contenus sensibles
    if (
        adultDomains.some((blockedDomain) => domain.includes(blockedDomain)) ||
        adultKeywords.some((keyword) => url.toLowerCase().includes(keyword))
    ) {
        return true;
    }

    return false;
}
