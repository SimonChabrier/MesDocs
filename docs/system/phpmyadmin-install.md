---
tite : phpMyAdmin Installation
description : Comment installer phpMyAdmin sur Ubuntu Server et Caddy Server
---

# Installation de phpMyAdmin compatible PHP 8.2

## Prérequis

- Serveur Ubuntu 20.04
- Serveur Web Caddy Server
- Récupérer la dernière version de phpMyAdmin compatible avec PHP 8.* 
- Lien téléchargement [phpMyAdmin compatible php 8.2](https://www.phpmyadmin.net/downloads/)
- Composer

## Installation de phpMyAdmin : phpMyAdmin 6.0+snapshot

Je me positionne dans le répertoire `/var/www/html` pour récupérer la dernière version de phpMyAdmin compatible avec PHP 8.*

**ici la verison que j'ai utilisé en janvier 2025**

```bash
wget https://files.phpmyadmin.net/snapshots/phpMyAdmin-6.0+snapshot-all-languages.zip
unzip phpMyAdmin-6.0+snapshot-all-languages.zip
sudo mv phpMyAdmin-6.0+snapshot-all-languages /usr/share/phpmyadmin
sudo chown -R www-data:www-data /usr/share/phpmyadmin
```


Aller dans le reperoire /usr/share/phpmyadmin

```bash
cd /usr/share/phpmyadmin
composer install
```

Créer un lien symbolique vers le répertoire `/var/www/html` pour accéder au contenu de phpMyAdmin dans `var/www/html` ça va permettre de voir et travailler dans le repertorie de `/usr/share/phpmyadmin`directement depuis `var/html/wwww` sans avoir à se déplacer dans le répertoire `/usr/share/phpmyadmin`.

C'est surtout la garantie pour le serveur web de ne pas de problème de droit d'accès...

J'aurais aussi pu tout installer directement dans le répertoire `/var/www/html` comme pour Matomo ça aurait été pareil...quoi qu'il en soit le lien symbolique ne duplique pas les fichiers et ne prend pas de place disque...c'est juste un raccourci.

```bash
sudo ln -s /usr/share/phpmyadmin /var/www/html/phpmyadmin
```

## Configuration de phpMyAdmin

Créer un fichier de configuration pour phpMyAdmin

```bash
sudo cp /usr/share/phpmyadmin/config.sample.inc.php /usr/share/phpmyadmin/config.inc.php
```

Ouvrir le fichier dans VsCode et modifier les lignes suivantes

Pour créer un mot e passe faire la commande suivante

```bash
openssl rand -out /dev/stdout 32 | base64 | head -c 32
```

```php
$cfg['blowfish_secret'] = 'on colle la clé ici entre les simple quote'; /* YOU MUST FILL IN THIS FOR COOKIE AUTH! */
```

## Configuration de Caddy Server

Créer un fichier de configuration pour phpMyAdmin

```bash
sudo nano /etc/caddy/Caddyfile
```

Ajouter la configuration minimale requise pour phpMyAdmin

```bash
mon-domaine-php-myadmin.ext {

    header {
		-Server
		Set-Cookie: __Host-sess=123; path=/; Secure; HttpOnly; SameSite=Lax
		Permissions-Policy "geolocation=(self), microphone=(), camera=()"
		Strict-Transport-Security "max-age=31536000; includeSubDomains"
		X-Content-Type-Options "nosniff"
		Referrer-Policy "no-referrer-when-downgrade"
		Content-Security-Policy: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data:;"
		X-Frame-Options "DENY"
	}

	root * /var/www/html/phpmyadmin/public
	php_fastcgi unix//run/php/php8.2-fpm.sock
	encode gzip
	file_server
}
```

Redémarrer Caddy Server

```bash
sudo systemctl restart caddy
```

## Accès à phpMyAdmin

Ouvrir un navigateur et accéder à l'adresse `https://mon-domaine-php-myadmin.ext`
Regarder si il y a des petits warning à régler...et c'est tout. IL peut y avoir des permission à règler sur le dossier /temp de phpMyAdmin. pour que le serveur web puisse écrire dedans.

Si besoin de modifier les droits d'accès sur le dossier `/temp` de phpMyAdmin on donne les droits au serveur web comme propriétaire et groupe propriétaire.

```bash
sudo chown -R www-data:www-data /usr/share/phpmyadmin/tmp
```

## Conclusion

C'est terminé je peux utiliser phpMyAdmin pour gérer mes bases de données MySQL et MariaDB.
Par contre pour Php8 je sui sobligé d'utiliser la version 6.0+snapshot de phpMyAdmin.
et de suivre cette procédure pour l'installer. C'est rapide et ça fonctionne bien.

