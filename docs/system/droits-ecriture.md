---
title: Autorisations d'écriture sur les fichiers et dossiers du serveur
description: Gérer les droits d'écriture sur les fichiers et dossiers du serveur, ajouter des utilisateurs à des groupes, et configurer les permissions pour les applications web.
comments: true
---

# Autorisations de production. 

- Le problème à résoudre est la gestion des droits sur les fichiers et dossiers du serveur, ajouter et modifier des autorisations et ajouter ou modifier des groupes pour partager des autorisations entre utilisateurs et groupes.

## Installe sur le serveur le paquet acl

```shell
sudo apt-get update
sudo apt-get install acl
```

## Ajouter un utilisateur à un groupe pour partager les droits 

```shell
sudo usermod -aG www-data nom_utilisateur
sudo usermod -aG caddy nom_utilisateur
```

- `a` pour ajouter, `G` pour groupe

## Vérifier les groupes d'un utilisateur

```shell
groups nom_utilisateur
```

Retourne les groupes de l'utilisateur nom_utilisateur

## Ajouter les droits sur un fichier pour un groupe et un utilisateur

```shell
sudo setfacl -m u:nom_utilisateur:rwx nom_fichier
```

## Au global pour les app du /var/www/html

```shell
sudo chown -R nom_utilisateur:www-data /var/www/html
```

Donne les droits à l'utilisateur simon et au groupe www-data sur le dossier /var/www/html et tous les sous dossiers et fichiers.
Donc pas de problème pour travailler depuis code-server et pour le serveur d'écrire dans les dossiers de cache et de log.
Pas de problème non plus pour www-data pour écrire dans les dossiers de cache et de log.
