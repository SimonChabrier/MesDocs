---
title: Caddyfile Directives
description: Configuration type du Caddyfile pour servir des sites et applications web avec Caddy Serveur
comments: true
---

# Caddyfile Directives

Configuration type du Caddyfile

## Paramètres de base 

Configurer le port d'écoute du serveur web en haut du fichier Caddyfile

```shell
{
    admin off # désactive l'interface d'administration de Caddy
	http_port 80 # Port HTTP
	https_port 443 # Port HTTPS
}
```

à la suite de cette configuraiton je configure les domaines pour servir les sites et applications web.

## Configuration d'un domaine avec une application PHP

```shell
mondomaine.ext {
    # configuration des headers sécurisés
	header {
		-Server
		Set-Cookie: __Host-sess=123; path=/; Secure; HttpOnly; SameSite=Lax # exemple de configuration de cookie sécurisé
		Permissions-Policy "geolocation=(self), microphone=(), camera=()" # exemple de configuration de permissions
		Strict-Transport-Security "max-age=31536000; includeSubDomains" # exemple de configuration de HSTS (HTTP Strict Transport Security) veut dire que le navigateur doit toujours utiliser HTTPS
		X-Content-Type-Options "nosniff" # empêche le navigateur de deviner le type de contenu
		Referrer-Policy "no-referrer-when-downgrade" # empêche le navigateur de transmettre le referrer à un site HTTP
		Content-Security-Policy: "default-src 'self'; script-src 'self'; style-src 'self'; font-src 'self'; img-src 'self' data:;" # adapter aux besoins de l'application ici tout est bloqué sauf les ressources du site
		X-Frame-Options "DENY" # empêche le site d'être affiché dans un iframe
	}

    # stockage des logs de requêtes HTTP dans un fichier
	log {
		output file /var/log/caddy/requests.json {
			roll_size 2mb # taille maximale du fichier de logs
			roll_keep 2 # nombre de fichiers de logs à conserver (crée un .zip quand le fichier de log atteint la taille maximale roll_size)
			roll_keep_for 24h # durée de conservation des fichiers de logs
		}
	}

	root * /var/www/html/phpmyadmin/public # définir le dossier racine du site (le point d'ntrée de l'application - index.php)
	php_fastcgi unix//run/php/php8.2-fpm.sock # configuration du serveur PHP (version 8.2)
	encode gzip # compression des fichiers pour une meilleure performance
	file_server # activer le serveur de fichiers pour servir les fichiers statiques (assets, images, etc.)

    @blocked { # configuration pour bloquer l'accès à certains fichiers
		path /uploads/* # bloquer l'accès au dossier uploads et à tous ses fichiers et sous-dossiers (on ne pourra pas accéder à ces fichiers directement même si on connait le chemin il faudra impérativement que le fichier soit servi par unr route de l'application pour y accéder)
	}
	respond @blocked 403 # renvoyer une erreur 403 (Forbidden) si l'accès est bloqué
}
```

Configuration par exemple pour une application PHP (phpmyadmin) avec des headers sécurisés, stockage des logs de requêtes HTTP dans un fichier, configuration du serveur PHP, compression des fichiers et serveur de fichiers activé.


## Configuration d'un domaine avec redirection

```shell
mondomaine.ext {
    redir https://www.mondomaine.ext{uri}
}
```

Permet de rediriger les requêtes http://mondomaine.ext vers https://www.mondomaine.ext/uri

## Configuration d'un reverse proxy

```shell
mondomaine.ext {
    reverse_proxy localhost:3000
}
```

Permet de rediriger les requêtes http://mondomaine.ext vers le serveur local sur le port 3000
Par exemple pour rediriger les requêtes vers un serveur Node.js ou Mercure...


## Configuration d'un domaine avec un site statique

```shell
mondomaine.ext {
    root * /var/www/html/monsite
    file_server
    try_files {path} {path}/ /index.html   # servire le fichier index.html par défaut
}
```

## Bonus créer des configs

Permet de déclarer des configurations réutilisables directement dasn le CaddyFile.

```shell
# Les headers secudisés de base à importer là ou necessaire
(basic-headers) {
	header {
		-Server
		Set-Cookie: __Host-sess=123; path=/; Secure; HttpOnly; SameSite=Lax
		Permissions-Policy "geolocation=(self), microphone=(), camera=()"
		Strict-Transport-Security "max-age=31536000; includeSubDomains"
		X-Content-Type-Options "nosniff"
		Referrer-Policy "no-referrer-when-downgrade"
		Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://apis.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data:;"
		X-Frame-Options "DENY"
	}
}

# on les importe
mon-sous-domaine.mon-domaine.ext {
	import basic-headers

	root * /var/www/html/monsite
    file_server
    try_files {path} {path}/ /index.html   # servire le fichier index.html par défaut
}
```
