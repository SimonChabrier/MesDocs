---
title: Ajouter Matomo à Vitepress
description: Intégrer Matomo pour le suivi des statistiques dans un projet Vitepress.
---

# Ajouter Matomo à Vitpress

- A la main la configuration minimale est la suivante :

```javascript
head: [
      // Ajout du favicon (obligatoire si tu veux éviter l'erreur 404)
      ['link', { rel: 'icon', href: '/favicon.ico' }],
      // Ajout du script Matomo
      ['script', {},`
        var _paq = window._paq = window._paq || [];
          _paq.push(['trackPageView']);
          _paq.push(['enableLinkTracking']);
          (function() {
            var u="https://mon_domaine_matomo.mondomaine.ext";
            _paq.push(['setTrackerUrl', u+'matomo.php']);
            _paq.push(['setSiteId', '4']);
            var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
            g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
          })();
      `]
    ],
```

Remplace `mon_nom_de_sous-domaine_matomo.mon_domaine.fr` par l'URL de ton serveur Matomo.
Rebuilder...
