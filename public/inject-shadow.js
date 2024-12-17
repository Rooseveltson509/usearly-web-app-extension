document.addEventListener('DOMContentLoaded', () => {

  const container = document.createElement('div');
  container.id = 'u-extension-container';
  document.body.appendChild(container);

  const shadowRoot = container.attachShadow({ mode: 'open' });
  console.log('Inject-shadow.js est bien injecté.');
  console.log('shadowRoot: ', shadowRoot);

  // Créez un élément <link> pour charger le fichier CSS
  const link = document.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('href', chrome.runtime.getURL('contentStyles.css'));

  fetch(chrome.runtime.getURL('contentStyles.css'))
  .then((response) => {
    if (response.ok) {
      console.log('Le fichier CSS est accessible.');
    } else {
      console.error('Erreur dans l’accès au fichier CSS.');
    }
  })
  .catch((err) => console.error('Erreur réseau:', err));


  // Ajoutez le <link> dans le Shadow DOM
  shadowRoot.appendChild(link);

  shadowRoot.innerHTML = `
<style>
@import url('https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100..900;1,100..900&display=swap');
</style>
    <div class="example">Shadow DOM Ready!</div>
  `;

  console.log('ShadowRoot après DOMContentLoaded:', container.shadowRoot);
});
