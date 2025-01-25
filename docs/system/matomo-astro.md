---
title: "Ajouter Matomo à Astro"
description: "Ce guide explique comment ajouter et configurer Matomo dans un projet Astro pour suivre les visites sur plusieurs domaines en utilisant un fichier JSON et en injectant dynamiquement le code de suivi dans les pages."
---

# Ajouter Matomo à Astro

## Suivi site unique

```shell
pnpm dlx astro add @jop-software/astro-matomo
```

## Configurer Matomo dans un projet Astro

Dans le fichier `astro.config.mjs` ajouter la configuration suivante :

```javascript
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import matomo from "@jop-software/astro-matomo";

// https://astro.build/config
export default defineConfig({
  site: "https://mon_nom_de_domaine.fr", // URL principale
  base: "/", // Racine du repository
  trailingSlash: "always", // Toutes les URLs se terminent par un slash
  integrations: [
    tailwind(),
    matomo({
      baseUrl: "https://mon_nom_de_sous-domaine_matomo.mon_domaine.fr/", // URL du ton serveur Matomo
      siteId: 1, // ID du site Matomo (le même pour tous les domaines)
      jsTrackerUrl: "https://mon_nom_de_sous-domaine_matomo.mon_domaine.fr/matomo.js", // Tracker JS pour tous les domaines
      phpTrackerUrl: "https://mon_nom_de_sous-domaine_matomo.mon_domaine.fr/matomo.php", // URL du tracker PHP
    }),
  ],
});
```

- ici la configuration permet de suivre les visites sur les domaines `simschab.cloud`, `simonchabrier.fr` et `simonchabrier.com` avec le même siteId.

- Ajouter les sites dans Matomo


## Suivre plusieurs domaines

SI on a une instance unique d'une applicaiotn mais déployée sur plusieurs domaines, on peut suivre les visites sur chaque domaine en fonction du domaine courant.

## Configuration 

### Faire un fichier de configuration pour les domaines dans le dossier public

Le plus simple est de créer un fichier `tracking.json` dans le dossier `public` du projet Astro.
On récupère les code de suivi sur Matomo et on `enlève les balises script`

```javascript
{
    "https://domaine_A.fr/": "var _paq=window._paq||[];_paq.push(['trackPageView']);_paq.push(['enableLinkTracking']);(function(){var u='//mod_domaine_matomo.ext/';_paq.push(['setTrackerUrl', u+'matomo.php']);_paq.push(['setSiteId', '3']);var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);})();",
    "https://domaine_B.com/": "var _paq=window._paq||[];_paq.push(['trackPageView']);_paq.push(['enableLinkTracking']);(function(){var u='//mod_domaine_matomo.ext/';_paq.push(['setTrackerUrl', u+'matomo.php']);_paq.push(['setSiteId', '3']);var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);})();",
    "https://domaine_C.cloud/": "var _paq=window._paq||[];_paq.push(['trackPageView']);_paq.push(['enableLinkTracking']);(function(){var u='//mod_domaine_matomo.ext/';_paq.push(['setTrackerUrl', u+'matomo.php']);_paq.push(['setSiteId', '3']);var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);})();",
}
```

## Dans le template 

### Dasn les balises head faire un appel ajax pour injecter le code de suivi en fontion du domaine courant.

```html
<head>

    <!--  toutes les autres balises head classde baseqiues -->
		<script>
			fetch("/tracking.json")
				.then(response => response.json())
				.then(trackingData => {
					const url = window.location.href;

					// Injection du script Matomo
					const trackingScript = trackingData[url];
					if (trackingScript) {
						const scriptElement = document.createElement("script");
						scriptElement.type = "text/javascript";
						scriptElement.async = true;
						scriptElement.innerHTML = trackingScript;
						document.head.appendChild(scriptElement);
					}

					// Injection du lien canonical qui aide les moteurs de recherche à identifier la version principale à indexer et à éviter les problèmes de contenu dupliqué.
					if (trackingData[url]) {
						const linkElement = document.createElement("link");
						linkElement.rel = "canonical";
						linkElement.href = url;
						document.head.appendChild(linkElement);
					}
				})
				.catch(error => console.error("Erreur chargement tracking.json :", error));
		</script>
	</head>
```

Voilà en fonction du domaine récupéré par `window.location.hostname` et qui correspond à la clé du fichier `tracking.json` on injecte le code de suivi matomo correspondant...

## Tester le suivi

Sur matomo dans la configuration de chaque domaine déclaré on peut aller vérifier si le suivi est bien actif et exécuté sur les pages du site et testant le code de suivi...