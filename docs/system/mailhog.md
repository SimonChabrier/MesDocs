---
title: Installer et configurer MailHog pour tester l'envoi d'email
description: Installer et configurer MailHog pour tester l'envoi d'email sur Ubuntu Server 20.04 LTS. ce MailCatcher permet de capturer et visualiser les emails envoyés par les applications web en développement très facilement.
---

# Installer et configurer MailHog pour tester l'envoi d'email

## Installer MailHog

```shell
wget https://github.com/mailhog/MailHog/releases/download/v1.0.0/MailHog_linux_amd64 -O /usr/local/bin/mailhog
```

- DOnner les permissions d'exécution au fichier `mailhog` :

```shell
sudo chmod +x /usr/local/bin/mailhog
```

## Créer un service systemd pour MailHog


```shell
sudo nano /etc/systemd/system/mailhog.service
```

```shell
[Unit]
Description=MailHog
After=network.target

[Service]
ExecStart=/usr/local/bin/mailhog
Restart=always
User=nobody
Group=nogroup
ExecStartPre=/bin/sleep 10

[Install]
WantedBy=multi-user.target
```

## Activer et démarrer le service MailHog

```shell
sudo systemctl enable mailhog
sudo systemctl start mailhog
```

## Accéder à l'interface web de MailHog

Créer un sous domaine par exemple `mailhog.mondomaine.ext` et ajouter un enregistrement DNS pour pointer vers l'adresse IP du serveur.

## Configurer CaddyServeur pour MailHog

```shell
mailhog.mondomaine.ext {
    reverse_proxy localhost:8025
}
```

## Valider et recharger la configuration de Caddy

```shell
sudo caddy validate
sudo caddy reload
```

## Afficher les emails envoyés

Ouvrir le navigateur et accéder à l'URL de MailHog : `http://mailhog.mondomaine.ext`

## Config symfony pour MailHog

- Dans le fichier `.env.local` ajouter la configuration suivante :

```shell
MAILER_DSN=smtp://localhost:1025
```

Fin, tout est ok et fonctionnel pour tester l'envoi d'email avec MailHog en développement sans limitation de volume ni de quota...

