---
title: Installer et configurer MailHog pour tester l'envoi d'email
description: Installer et configurer MailHog pour tester l'envoi d'email sur Ubuntu Server 20.04 LTS. Ce MailCatcher permet de capturer et visualiser les emails envoyés par les applications web en développement très facilement, avec un service sécurisé et isolé.
comments: true
---

# Installer et configurer MailHog pour tester l'envoi d'email

## Installer MailHog

Télécharger le binaire :

```shell
wget https://github.com/mailhog/MailHog/releases/download/v1.0.0/MailHog_linux_amd64 -O /usr/local/bin/mailhog
```

Rendre le fichier exécutable :

```shell
sudo chmod +x /usr/local/bin/mailhog
```

## Créer un utilisateur système dédié à MailHog

Créer un compte système sans accès shell pour isoler le service :

```shell
sudo useradd -r -s /usr/sbin/nologin -M -U mailhog
```

Créer les répertoires nécessaires et ajuster les permissions :

```shell
sudo mkdir -p /var/lib/mailhog /var/log/mailhog /run/mailhog
sudo chown -R mailhog:mailhog /usr/local/bin/mailhog /var/lib/mailhog /var/log/mailhog /run/mailhog
```

## Créer un service systemd pour MailHog

```shell
sudo nano /etc/systemd/system/mailhog.service
```

Contenu du fichier :

```ini
[Unit]
Description=MailHog
After=network.target

[Service]
ExecStart=/usr/local/bin/mailhog
Restart=always
User=mailhog
Group=mailhog
RuntimeDirectory=mailhog
RuntimeDirectoryMode=0755
ExecStartPre=/bin/sleep 10

# Durcissement du service
PrivateTmp=true
NoNewPrivileges=true
ProtectSystem=full
ProtectHome=yes
ProtectKernelTunables=yes
ProtectControlGroups=yes
RestrictAddressFamilies=AF_INET AF_INET6 AF_UNIX
ReadOnlyPaths=/etc
ReadWritePaths=/var/lib/mailhog /var/log/mailhog /run/mailhog
CapabilityBoundingSet=
AmbientCapabilities=

[Install]
WantedBy=multi-user.target
```

## Activer et démarrer le service MailHog

```shell
sudo systemctl daemon-reload
sudo systemctl enable mailhog
sudo systemctl start mailhog
```

Vérifier le statut :

```shell
systemctl status mailhog
```

## Accéder à l'interface web de MailHog

Créer un sous-domaine (ex. `mailhog.mondomaine.ext`) et pointer son enregistrement DNS vers l’adresse IP du serveur.

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

Accéder à l’interface web :  
`http://mailhog.mondomaine.ext`

## Configurer Symfony pour utiliser MailHog

Dans le fichier `.env.local` :

```shell
MAILER_DSN=smtp://localhost:1025
```

---

MailHog est maintenant isolé, sécurisé et fonctionnel pour tester l’envoi d’emails sans limitation de volume ni de quota.
