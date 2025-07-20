---
title: Architecture d'une application Express.js
description: Guide pour structurer une application Express.js en suivant les bonnes pratiques de développement.
---

# Installation et gestion de l'application avec PM2

- Ici le problème est de lancer une application Node.js en production sur un serveur distant et de la gérer facilement. Dans mon cas je la lance sur mon home serveur pour pouvoir y accéder depuis n'importe où et pour pouvoir la tester dans un environnement de production.

## 1. Installation de PM2

PM2 est un gestionnaire de processus pour Node.js, qui permet de gérer facilement les applications en production, de les redémarrer automatiquement en cas de plantage, et de les exécuter en arrière-plan.

Pour installer PM2 globalement, utilise la commande suivante :

```bash
npm install pm2 -g
```

## 2. Utilisation de PM2

### 2.1. Démarrer une application

Pour démarrer une application avec PM2, utiliser la commande suivante :

```bash
pm2 start app.js --name "express-api"
```

### 2.2. Arrêter une application

Pour arrêter une application avec PM2, utiliser la commande suivante :

```bash
pm2 stop app.js --name "express-api"
```

`A chaque commande on a donc le nom de l'application qui est donné avec l'option --name et le dossier racine de l'application qui est donné en argument.
On se place à la racine de l'application pour lancer ces commandes ou alors on donne le chemin absolu de l'application sur le serveur.`

## Config serveur Caddy

```shell
sudo nano /etc/caddy/Caddyfile
```

- On ajoute un reverse proxy pour rediriger le trafic entrant sur le port 80 vers le port 3000 de l'application express-api :

```js
express-user-api.simschab.cloud {
	reverse_proxy localhost:3001
}
```

- On redémarre 

```shell
sudo systemctl restart caddy
```

## Conclusion

C'est terminé on peut se rendre sur le nom de domaine de l'application pour voir si elle est bien lancée et accessible depuis un navigateur.
Si on fait des mofiications sur l'application il suffit de redémarrer l'application avec PM2 pour que les modifications soient prises en compte.