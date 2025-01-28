---
title: Commandes de base de Caddy
description: Commandes de base pour gérer le serveur Caddy Serveur et son fichier de configuration Caddyfile
---

# Commandes de base de Caddy

Je me positionne sur le dossier qui contient caddy  et son fichier de configuration Caddyfile.

## Valiser le Caddyfile

```shell
sudo caddy validate
```

## Corriger le Caddyfile

Si le fichier de configuration Caddyfile n'est pas correct, on peut le corriger automatiquement avec la commande suivante :

```shell
sudo caddy fmt --overwrite
```

## Démarrer le serveur Caddy

```shell
sudo caddy start
```

## Arrêter le serveur Caddy

```shell
sudo caddy stop
```

## Redémarrer le serveur Caddy

```shell
sudo caddy restart
```

## Recharger le serveur Caddy après modification du Caddyfile

```shell
sudo caddy reload
```
