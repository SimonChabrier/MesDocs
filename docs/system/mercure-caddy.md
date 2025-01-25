---
title: Configuration de Mercure avec Caddy Serveur
description: Configuration de Mercure avec Caddy Serveur pour les SSE notifications en Symfony
---

# Configuration de Mercure avec Caddy Serveur

## Contexte à comprendre

Ici je suis dans /mercure/ qui est le répertoire d'installation de Mercure.
Mercure dispose de sa propre instance de Caddy Serveur pour gérer les requêtes entrantes et sortantes.
Je dois configurer le Caddyfile.dev spécifique à Mercure pour le lancer à partir de ce fichier de configuration customisé.

Ensuite il faut gérer un reverse_proxy pour rediriger les requêtes entrantes sur le domaine `mondomaine_mercure.mondomaine.ext` vers le port 3000 qui est le port par défaut de Mercure.
A ce momen tla je suis dasn /etc/caddy/ et je vais éditer le fichier Caddyfile pour ajouter la configuration du reverse proxy pour Mercure.

Caddy Serveur de Mercure et Caddy Serveur principal sont deux instances différentes de Caddy Serveur qui tournent sur le même serveur.

L'instance "Générale" de CaddyServeur se charge uniquement de diriger les requetes entrantes vers les bonnes instances de Caddy Serveur de Mercure et c'est lui qui répond.

Comme ça je sépare les responsabilités et je peux gérer les configurations de Mercure et de Caddy Serveur de manière indépendante.
C'est intéressant pour pouvoir faire des tests et des modifications du CaddyFile.dev de CaddyServer de Mercure sans impacter le serveur principal.


## Creer un sous domaine (ou un domaine) pour Mercure

`mondomaine_mercure.mondomaine.ext`

## Configuration CaddyServer

```bash
mondomaine_mercure.mondomaine.ext {
    reverse_proxy localhost:3000 # on redirige les requêtes entrantes sur le port 3000 qui est le port par défaut de Mercure
}
```

## Configuration Mercure

Mercure a son propre fichier de configuration Caddyfile. On le copie dans un fichier `Caddyfile.dev` pour le distinguer du fichier de configuration principal de Caddy Serveur.

```shell
sudo cp /etc/caddy/Caddyfile /mercure/Caddyfile.dev
```

- on va éditer le fichier Caddyfile :

```shell
sudo nano /mercure/Caddyfile.dev
```

- on va ajouter la configuration minimale et tout ouvrir pour les tests :

```shell
https://mondomaine_mercure.mondomaine.ext:3000 {
    route {
        mercure {
            # l'url de transport
            transport_url {$MERCURE_TRANSPORT_URL:bolt://mercure.db}
            # Publisher JWT key
            publisher_jwt !ChangeThisMercureHubJWTSecretKey! # la clé par défaut pour générer des tokens JWT signés pour les éditeurs mai son peut générer sa propre clé avec un outil comme jwt.io
            # Subscriber JWT key
            subscriber_jwt !ChangeThisMercureHubJWTSecretKey! # la clé par défaut pour générer des tokens JWT signés pour les abonnés mai son peut générer sa propre clé avec un outil comme jwt.io
	    cors_origins *
            publish_origins *
            demo
            anonymous
            subscriptions
	    {$MERCURE_EXTRA_DIRECTIVES}
        }
        respond "Not Found" 404
    }
}
```

Ici je cable donc mercure sur `https://mondomaine_mercure.mondomaine.ext:3000` qui va recevoir les requêtes entrantes sur le domaine `mondomaine_mercure.mondomaine.ext` grâce au reverse proxy de l'instance principale de Caddy Serveur.

## lancer l'instance du Caddy Serveur de Mercure

- On se place dans le répertoire de Mercure parce que c'est bien le serveur Caddy de Mercure qu'on veut lancer :

```shell
cd mercure
caddy run --config Caddyfile.dev
``` 

Si tout va bien on devrait avoir un message comme ça :

```shell
2021/03/21 16:47:34.000 INFO    using provided configuration    {"config_file": "Caddyfile.dev", "config_adapter": ""}
2021/03/21 16:47:34.000 INFO    admin endpoint started  {"address": "localhost:2019", "enforce_origin": false, "origins": ["localhost:2019"]}
2021/03/21 16:47:34.000 INFO    serving initial configuration
etc...
```

## Créer un service systemd 

- Pour lancer l'instance de Caddy Serveur pour Mercure au démarrage du serveur je crée le fichier de configuration du service systemd :

```shell
sudo nano /etc/systemd/system/mercure.service
```

- Ajouter les directives suivantes :

```shell
[Unit]
Description=Lance le serveur Mercure pour les SSE notifications
After=network.target

[Service]
Type=simple
WorkingDirectory=/mercure
ExecStart=/mercure/mercure run --config /mercure/Caddyfile.dev
Restart=always
RestartSec=10
User=root
Group=www-data

[Install]
WantedBy=multi-user.target
```

- Recharger les services systemd :

```shell
sudo systemctl daemon-reload
```

- Activer le service systemd :

```shell
sudo systemctl enable mercure.service
```

- Démarrer le service systemd :

```shell
sudo systemctl start mercure.service
```

- Vérifier que le service systemd est bien lancé :

```shell
sudo systemctl status mercure.service
```


# Conclusion

Le serveur Mercure est maintenant configuré et lancé avec son propre fichier de configuration Caddyfile.dev et son propre service systemd.
On peut tester avec Insomnia ou Postman en envoyant des requêtes POST sur l'url de Mercure pour voir si tout fonctionne bien.
Il faut utilier l'Aut Bearer avec le token JWT pour les requêtes POST.
Choisir le Conten-Type application/x-www-form-urlencoded et ajouter le token JWT dans le body de la requête POST.
Et passer deux clés dans le body de la requête POST : topic et data avec leur valeur respective.
Soumettre la requete POST et voir si le message est bien envoyé et reçu par le client abonné à ce topic.


