---
title: Basic Auth pour sécuriser un site avec Caddy Serveur
description: Ajouter une couche de sécurité à un site web en utilisant l'authentification de base (Basic Auth) pour protéger l'accès à un site ou une application web statique ou dynamique.
---

# Basic Auth pour sécuriser un site avec Caddy Serveur

On peut ajouter une couche de sécurité à un site web en utilisant l'authentification de base (Basic Auth) pour protéger l'accès à un site ou une application web statique ou dynamique.

## Créer un mot de passe haché

```bash
sudo caddy hash-password
```

## Ajouter l'authentification de base au Caddyfile

```shell
mondomaine.ext {
    basic_auth /ma_zone_protégée {
        nom_utilisateur motdepasse_haché
    }
}
```

## Valider le Caddyfile

```shell
sudo caddy validate
```

## Recharger le Caddyfile

```shell
sudo caddy reload
```

## Tester l'authentification de base

Ouvrir le navigateur et accéder à l'URL du site protégé. Une fenêtre d'authentification s'affiche pour saisir le nom d'utilisateur et le mot de passe.

 