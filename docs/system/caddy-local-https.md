---
title: Obtenir un certificat SSL local avec Caddy pour HTTPS
description: Comment obtenir un certificat SSL local avec Caddy pour HTTPS sur votre serveur local.
comments: true
---

# Obtenir un certificat SSL local avec Caddy pour HTTPS

Sur Ubuntu le certificat de Caddy n'est pas forcément directment reconnu pa rles navigateurs, il faut l'ajouter manuellement. La manipulation st assez simple et l'onjectif est de developper en local avec des certificats SSL et des noms de domaines locaux en https.

## Générer un certificat SSL local avec Caddy

```shell
sudo caddy trust
```

- la commande `sudo caddy trust` permet de générer un certificat SSL local pour le domaine `localhost` et de lui faire confiance.

## Ajouter le certificat à Chrome avec Ubuntu

- Ouvrir `chrome://certificate-manager`.
- Cliquer sur `Gérer les certificats`.
- Aller dans l'onglet `Autorités`.

## Importer le certificat racine de Caddy

- Cliquer sur `Importer`.
- Sélectionner le fichier `/etc/ssl/certs/` et chercher le certificat nommé par exemple : `Caddy_Local_Authority_-_2025_ECC_Root.pem`.
- coher : `Faire confiance à cette autorité pour identifier des sites web`
- Valider avec `OK`.

## Redémarrer Chrome

- Dans la barre d'adresse de Chrome, saisir `chrome://restart` et valider avec `Entrée`.

## Tester le certificat SSL local

- Ouvrir un navigateur et saisir l'URL `https://mon-domaine.localhost`.


## Ajouter le certificat à Firefox avec Ubuntu

- Ouvrir `about:preferences#privacy`.
- Décendre jusqu'à `Certificats`.
- Cliquer sur `Afficher les certificats`.
- Aller dans l'onglet `Autorités`.

## Importer le certificat racine de Caddy

- Même principe que pour Chrome.
- Cochher : `Faire confiance à cette CA pour identifier des sites web`.
- Valider avec `OK`.

## Redémarrer Firefox

- Dans la barre d'adresse de Firefox, saisir `about:restartrequired` et valider avec `Entrée`.

## Tester le certificat SSL local

- Ouvrir un navigateur et saisir l'URL `https://mon-domaine.localhost`.

