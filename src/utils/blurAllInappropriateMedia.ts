export function blurAllInappropriateMedia():void {
    // Flouter les images
    const images = document.querySelectorAll("img");
    images.forEach((img) => {
      (img as HTMLElement).style.filter = "blur(20px)";
    });
  
    // Flouter les vidéos
    const videos = document.querySelectorAll("video");
    videos.forEach((video) => {
      (video as HTMLElement).style.filter = "blur(20px)";
    });
  
    // Flouter les arrière-plans
    const elementsWithBackground = document.querySelectorAll("[style*='background-image']");
    elementsWithBackground.forEach((el) => {
      (el as HTMLElement).style.filter = "blur(20px)";
    });
  
    // Ajouter un message d'avertissement
    const warningBanner = document.createElement("div");
    warningBanner.id = "warning-banner"; // ID ajouté pour pouvoir le supprimer plus tard
    warningBanner.style.position = "fixed";
    warningBanner.style.top = "0";
    warningBanner.style.left = "0";
    warningBanner.style.width = "100%";
    warningBanner.style.padding = "10px";
    warningBanner.style.backgroundColor = "rgba(255, 0, 0, 0.8)";
    warningBanner.style.color = "white";
    warningBanner.style.textAlign = "center";
    warningBanner.style.zIndex = "10000";
    warningBanner.style.fontSize = "18px";
    warningBanner.innerText = "Cette page contient des médias inappropriés. Ils ont été floutés.";
  
    document.body.appendChild(warningBanner);
  }