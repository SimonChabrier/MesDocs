---
title: Installer un Hub Mercure
description: Guide d'installation et de comfigurationd'un serveur Hub sur Ubuntu Server 20.04
---

# Installer un Hub Mercure

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

- ⚠️ Version utilisée ***0.18.1 de Janvier 2025***

`Préalablement avoirfait un reverse proxy dans caddy sur le Caddyfile du serveur web pour rediriger les requêtes du domaine mercure vers le port 3000 du serveur.`

- Ajouter ça à minima dans le Caddyfile de caddy pour rediriger les requêtes du domaine mercure vers le port 3000 du serveur.

```txt
mon-domaine-mercure.ext {
	reverse_proxy localhost:3000
}
```

- Redémarrer CaddyServer

```shell
sudo systemctl restart caddy
```

- Se connecter en SSH sur le serveur

```shell
ssh mon_nom_utilisateur@mon_domaine_ou_IP
```

- Créer un dossier pour Mercure dasn /usr/local

```shell
sudo mkdir /usr/local/mercure
```

- Se placer dans le dossier

```shell
cd /usr/local/mercure
```

## Choisir la version de Mercure

- Vérifier l'architecture du serveur (X86_64 ou ARM64)

```shell
uname -m
```

lien vers les releases : [Realeases Mercure](https://github.com/dunglas/mercure/releases)
***`Dérouler la liste des archives pour trouver la dernière verison compatible avec le système.`***

## Téléchargement de l'archive

```shell
sudo wget 'lien_vers_la_dernière_version_de_mercure_correspondant_à_votre_architecture'
```

- Décompresser l'archive

```shell
sudo tar -xzf nom_de_l'archive
```

- Donner les droits sur le dossier

```shell
sudo chown -R mon_utilisateur:www-data /usr/local/mercure
```

## Test la version de développement

- On a pas encore changé les configurations par défaut, on peut donc lancer Mercure pour voir si tout fonctionne

- Lancer la commande suivante pour lancer Mercure avec son dev.Caddyfile

```shell
MERCURE_PUBLISHER_JWT_KEY='!ChangeThisMercureHubJWTSecretKey!' MERCURE_SUBSCRIBER_JWT_KEY='!ChangeThisMercureHubJWTSecretKey!' ./mercure run --config dev.Caddyfile
```

- Si problème avec le port 80 vérifier qu'on a bien cette sytaxe dans le Dev.Caddyfile ici :

```txt
{$MERCURE_SERVER_NAME:http://mon-domaine-mercure.ext:3000} 
```

- Repasser la commande et regarder les logs serveur pour voir si tout est ok.

- Vérifier l'url de Mercure

```http
http://mon-domaine-mercure/
```

- Si tout est ok on voit déjà les logs serveur dasn la console suite à la commande et le lien a redirigé vers http://mon-domaine-mercure/.well-known/mercure/ui/ pour voir l'interface html de test de Mercure. La config du dev.Caddyfile est bonne.

## Test la version de production

- Arrêter Mercure avec `Ctrl + C`

- lancer le serveur de production avec la commande 

```shell
sudo SERVER_NAME=:3000 MERCURE_PUBLISHER_JWT_KEY='!ChangeThisMercureHubJWTSecretKey!' MERCURE_SUBSCRIBER_JWT_KEY='!ChangeThisMercureHubJWTSecretKey!' ./mercure run 
```

- Si problème avec le port 443 vérifier qu'on a bien cette sytaxe dans le Caddyfile ici :

```txt
{$MERCURE_SERVER_NAME:https://mon-domaine-mercure.ext:3000} 
```

- Repasser la commande et regarder les logs serveur pour voir si tout est ok.

- Si tout est ok on aura plus l'interface html de test de Mercure, on peut donc tester avec un client Mercure comme Insomnia ou Postman mais si il n'y a pas d'erreur dans les logs serveur c'est que tout est ok. La confi du Caddyfile est bonne l'url https://mon-domaine-mercure/ est bien redirigée vers le serveur Mercure et retourne le contenu html contenu dans le Cadddyfile de production.

## Préparer des variables d'environnement globales

Pour ne pas intervenir sur la configuration des fichiers Caddyfile et dev.Caddyfile à chaque fois je vais délarer des variables d'environnement pour les clés JWT et le nom du serveur directement dans `/etc/environment`

- Ouvrir le fichier

```shell
sudo nano /etc/environment
```

- Ajouter les lignes suivantes

```shell
MERCURE_SERVER_NAME=:3000
MERCURE_PUBLISHER_JWT_ALG=HS256
MERCURE_SUBSCRIBER_JWT_ALG=HS256
MERCURE_PUBLISHER_JWT_KEY=!ChangeThisMercureHubJWTSecretKey!
MERCURE_SUBSCRIBER_JWT_KEY=!ChangeThisMercureHubJWTSecretKey!
MERCURE_PUBLISHER_JWT_KEY_DEV=!ici_un_vrai_token_secure!
MERCURE_SUBSCRIBER_JWT_KEY_DEV=!ici_un_vrai_token_secure!
```

- Enregistrer et quitter le fichier

## Mofifier le dev.Caddyfile

- Remplacer les valeurs des clés JWT par les variables d'environnement de dev

```shell
sudo nano dev.Caddyfile
```

```javascript
mercure {
		publisher_jwt {env.MERCURE_PUBLISHER_JWT_KEY_DEV} {env.MERCURE_PUBLISHER_JWT_ALG}
		subscriber_jwt {env.MERCURE_SUBSCRIBER_JWT_KEY_DEV} {env.MERCURE_SUBSCRIBER_JWT_ALG}
	}
```

- Enregistrer et quitter le fichier

## Automatiser le lancement de Mercure

Je me crée un service systemd pour lancer Mercure au démarrage du serveur
J'en profite pour faire un servie pour lancer soir le mode dev soit le mode prod en fonction des besoins.

- Créer le fichier de service

```shell
sudo nano /etc/systemd/system/mercure.service
```

- Ajouter les lignes suivantes

```shell
[Unit]
Description=Lance le serveur Mercure de PROD
After=network.target

[Service]
Type=simple
WorkingDirectory=/usr/local/mercure
ExecStart=sudo -E /usr/local/mercure/mercure run
Restart=always
RestartSec=10
User=root
Group=www-data

[Install]
WantedBy=multi-user.target
```

- ExecStart fonctionne parce que je lui dit de prendre en compte les variables d'environnement avec `-E`

- Enregistrer et quitter le fichier

- Créer le fichier de service pour le mode dev

```shell
sudo nano /etc/systemd/system/mercure.dev.service
```

- Ajouter les lignes suivantes

```shell
[Unit]
Description=Lance le serveur Mercure de DEV
After=network.target

[Service]
Type=simple
WorkingDirectory=/usr/local/mercure
ExecStart=sudo -E /usr/local/mercure/mercure run --config dev.Caddyfile
Restart=always
RestartSec=10
User=root
Group=www-data

[Install]
WantedBy=multi-user.target
```

- Enregistrer et quitter le fichier

C'est le même principe que pour le service de prod mais avec l'option `--config dev.Caddyfile` pour lancer Mercure en mode dev.

- Recharger les services systemd

```shell
sudo systemctl daemon-reload
```

- Activer les services

```shell
sudo systemctl enable mercure
sudo systemctl enable mercure.dev
```

- Démarrer les services (l'un ou l'autre pas les deux en même temps bien sûr)

```shell
sudo systemctl start mercure
sudo systemctl start mercure.dev
```

## Finalisation avec un lien symbolique 

Pour pourvoir éditer facilement les fichier .dev.Caddyfile et Caddyfile je vais créer un lien symbolique dans le dossier /etc/caddy et /var/www/html/mercure

- Créer le lien symbolique

```shell
sudo ln -s /usr/local/mercure /var/www/html/mercure
```

Comme ça je peux éditer directement les fichiers de configuration de mercure dans le dossier /usr/local/mercure depuis le dossier /var/www/html/mercure avec code-server et VsCode.

## 🚩 Attention

- Ne pas oublier de changer les clés JWT par des vraies clés sécurisées

Dans la config des Caddyfile et dev.Caddyfile de Mercure

Pour le dev.caddyfile il ne faut pas mettre le `https://` devant le nom de domaine mais juste `http://` c'est le reverse proxy qui s'occupe de la redirection et de la génération du certificat SSL.

```txt
{$MERCURE_SERVER_NAME:http://mon-domaine-mercure.ext:3000} 
````

Par contre dans le Caddyfile de production il faut bien mettre le `https://` devant le nom de domaine

```txt
{$MERCURE_SERVER_NAME:https://mon-domaine-mercure.ext:3000} 
```

- Si `$MERCURE_SERVER_NAME` n'est pas défini alors alors c'est  `http://mon-domaine-mercure.ext:3000` qui sera utilisé par défaut. C'est important parce que sinon on peut avoir des problèmes avec les pots 80 en dev ou 443 en prod quand on teste Mercure juste avec les commandes de lancement sans les fichiers de configuration.


## Conclusion 

C'est terminé, les problèmes rencontrés sont les conflits au départ avec les ports 80 et 443, il faut bien penser à respecter cette procédure nottament avec les http et https et la déclaration de `{$MERCURE_SERVER_NAME:http://mon-domaine-mercure.ext:3000}` et `{$MERCURE_SERVER_NAME:https://mon-domaine-mercure.ext:3000}` dans les dev.Caddyfile et Caddyfile. 

L'installation est propre les variables sont bien déclarées dans `/etc/environment` pour les changer facilement et les services systemd sont bien configurés pour lancer Mercure au démarrage du serveur. 

