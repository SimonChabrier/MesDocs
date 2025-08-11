---
title : Installer Caddy Serveur sur Ubuntu Server 20.0.4
description : Guide d'installation Caddy Serveur sur Ubuntu Server 20.0.4
comments: true
---

# Prérequis

https://caddyserver.com/

## Intaller Caddy Serveur

- télécharger les paquets nécessaires et installer Caddy Serveur

```shell
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

- voir les caractéristques du service Caddy Serveur

```shell
nano /lib/systemd/system/caddy.service
```

C'est là qu'on voit cont nom pour lui passer des permissions nottament sur le groupe www-data 
qui est utilisé pour exécuter des processus web et avoir des permissions d'écriture sur les fichiers du serveur web.

- Ajouter l'utilisateur caddy (qui est le nom utilisé par le service) au groupe www-data qui est le groupe utilisé par le serveur web.

```shell
sudo usermod -a -G www-data caddy
sudo systemctl restart caddy
```

- vérifier si le service Caddy Serveur est actif

```shell
sudo systemctl status caddy
```

- penser à désactiver le service apache2 si on utilise Caddy Serveur (car il a besoin du port 80) ou sinon changer son port d'écoute par exemple pour 81 et 444 (voir pa page 
[ici](/docs/system/caddy-apache.md))

```shell
sudo systemctl disable apache2
```

