---
title: Comment rediriger le trafic entrant de caddy server vers apache2
description: Rediriger le trafic entrant de caddy vers apache en utilisant un reverse proxy dans caddy pour diriger le trafic entrant sur le port 80 vers apache qui écoutera sur le port 81
---
# Rediriger le trafic entrant de caddy vers apache.

Le problèle est que caddy et apache ne peuvent pas tourner en même temps sur le même port 80. Je dois choisir qui sera mon serveur web "principal" et qui sera le secondaire. Dans mon cas caddy est le serveur principal et apache le secondaire. Certaines applications que j'utilise ne fonctionnent bien pas avec caddy et nécessitent apache. J'ai donc besoin de faire tourner les deux en même temps.

## Modifier le fichier des ports d’Apache

- D'abord, éviter le conflit entre Caddy et Apache en changeant le port d'Apache.

```shell
nano /etc/apache2/ports.conf 
```

- changer les ports d'écoute de apache 80 et 443 par autre chose comme 81 et 444 par ex.

```shell
Listen 81
<IfModule ssl_module>
    Listen 444
</IfModule>
<IfModule mod_gnutls.c>
    Listen 444
</IfModule>
```


## Configurer un hôte virtuel pour Adminer

Ici adminer est une application php qui nécessite apache pour fonctionner. Je vais donc créer un fichier de configuration pour ce site spécifique.

- Dans sites-available on fait le fichier custom_adminer.conf (pour apache) :

```shell
sudo nano /etc/apache2/sites-available/custom_adminer.conf
```

```shell
<VirtualHost *:81> # le port d'écoute d'apache que je viens de changer
    ServerName 192.168.0.100 # ip locale du serveur ou nom de domaine
    DocumentRoot /etc/adminer  # chemin vers le dossier de l'application
</VirtualHost>
```

- Activer le site et tester la configuration

```shell
sudo a2ensite custom_adminer.conf
```

- Vérifier les erreurs de configuration

```shell
sudo apache2ctl configtest
```

- Redémarrer apache

```shell
sudo service apache2 restart
```

- Vérifier que Apache écoute sur le port 81

```shell
sudo netstat -tulnp | grep 81
```

## Modifier et activer la configuration Apache spécifique à Adminer

- Puis, affiner la configuration d'Apache pour permettre l'accès à Adminer.

```shell
nano /etc/apache2/conf-enabled/adminer.conf
```

- Ajouter les directives suivantes :

```shell
Alias /adminer /etc/adminer

<Directory /etc/adminer>
    Require all granted
    DirectoryIndex conf.php
</Directory>
```

- redémarrer apache pour appliquer les changements

```shell
sudo service apache2 restart
```

## Configurer un reverse proxy avec Caddy

- Dans Caddyfile on peut crée un reverse proxy pour apache
- https://caddyserver.com/docs/quick-starts/reverse-proxy

- Ouvrir le fichier de configuration de caddy

```shell
sudo nano /etc/caddy/Caddyfile
```

- Ajouter la directive de reverse proxy pour apache

```shell 
adminer.mondomaine.ext {
	header {
		-Server
		# ici mes directoves de header et CSP....
	}
    # la directive pour le reverse proxy
	reverse_proxy localhost:81
}
```

- Redémarrer caddy

```shell
sudo systemctl restart caddy
```

## Conclusion

Le reverse proxy est maintenant actif et permet de faire tourner apache et caddy en même temps
en redirigeant ce que l'on veut du port 80 entrant vers caddy vers le port 81 d'apache...
On peut donc utiliser des application avec apache et d'autre avec caddy en même temps. L'avantage est surtout que Caddy se charge automatiqument de la gestion des certificats SSL et de la redirection http vers https...