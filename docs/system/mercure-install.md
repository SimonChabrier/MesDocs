---
title: Installer un serveur Mercure
description: Guide d'installation d'un serveur Mercure sur Ubuntu Server 20.04
---

# Installer un serveur Mercure

## Infos

Mercure est un protocole de communication en temps réel basé sur HTTP/2 et conçu pour faciliter la mise en place d’applications réactives. Contrairement aux WebSockets, il repose sur un modèle publication/abonnement (pub/sub), ce qui simplifie l'implémentation du temps réel sans nécessiter de connexions persistantes complexes.

Dans un projet Symfony, Mercure dispose d’un bundle dédié qui facilite son intégration. Il permet de mettre à jour l’interface utilisateur en temps réel dès qu’une donnée est modifiée dans la base de données, sans rechargement de page. C'est particulièrement utile pour des fonctionnalités comme :

- ✅ Les notifications instantanées
- ✅ La mise à jour dynamique des tableaux de bord
- ✅ Les chats en direct

- lien vers la doc officielle : [https://mercure.rocks/docs/hub](https://mercure.rocks/docs/hub)
- lien vers le bundle Symfony : [https://symfony.com/doc/current/mercure.html](https://symfony.com/doc/current/mercure.html)

Son principal avantage réside dans sa simplicité et son efficacité, notamment grâce à son support natif dans Symfony et API Platform...

## Installer Mercure

- à la racine du serveur / creer un repertoire mercure

```shell
sudo mkdir mercure
```

- se placer dans le repertoire mercure

```shell
cd mercure
```

-récupèrer l'archive du projet

```shell
sudo wget https://github.com/dunglas/mercure/releases/download/v0.14.5/mercure_0.14.5_Linux_x86_64.tar.gz
```

- extraire l'archive

```shell
sudo tar -xvf mercure_0.14.5_Linux_x86_64.tar.gz
```

- supprimer les fichiers extraits et l'archive

```shell
sudo rm mercure_0.14.5_Linux_x86_64.tar.gz
sudo rm README.md
sudo rm LICENSE
sudo rm COPYRIGHT
```

- Aller voir ensuite ma doc LancerMercureEtCaddyServeur.md pour configurer et lancer le serveur mercure et le serveur caddy
