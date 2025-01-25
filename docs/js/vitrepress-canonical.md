---
title = "Générer une URL canonique pour Vitrepress dynamiquement"
description = "Comment générer une URL canonique pour Vitrepress dynamiquement sans duplicate content et sans configuraiton complexe."
---

# Générer une URL canonique pour Vitrepress dynamiquement

## Introduction

Pour chaque page d'un site de doc je genère une URL canonique pour éviter les problèmes de duplicate content. Cela permet de dire aux moteurs de recherche que la page est une copie d'une autre page et que c'est cette dernière qui doit être indexée.


## Comment ça marche

Pour générer une URL canonique dynamiquement, j'utilise un script JavaScript qui va chercher l'URL de la page courante et la stocker dans une balise `link` avec l'attribut `rel="canonical"`.

A la fin de la génération dela configuration générale après la fermeture de la clé themeConfig {...} the dans le fichier `vitepress.config.mts` si TypeScript ou `vitepress.config.js`, j'ajoute le hook `transformPageData` qui va permettre de modifier les données de la page avant qu'elles ne soient rendues.

```javascript

export default defineConfig({
  // Configuration générale
  // ...
  themeConfig: {
    // Configuration du thème
  },
transformPageData(pageData) {
    // Construction de l'URL canonique
    const baseUrl = 'https://doc.mondomaine.ext';
    let canonicalUrl = `${baseUrl}/${pageData.relativePath}`

    // Remplacer .md par .html et ajouter le fragment si nécessaire
    canonicalUrl = canonicalUrl
      .replace(/\.md$/, '.html') // Remplacer les fichiers .md par .html
      .replace(/index\.html$/, '') // Retirer index.html à la racine
      + (pageData.headers?.length ? `#${pageData.headers[0].slug}` : ''); // Ajouter le fragment si nécessaire

    // Ajout de la balise canonical dans le frontmatter
    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push(['link', { rel: 'canonical', href: canonicalUrl }])
  }
}) // fermeture de 
```

## Conclusion

Chaque page de mon site de documentation a maintenant une URL canonique, ce qui aide les moteurs de recherche à identifier la version principale à indexer et à éviter les problèmes de contenu dupliqué.
