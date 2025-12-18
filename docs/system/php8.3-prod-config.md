---
title: Configuration PHP 8.3 pour Symfony en production
tags: Procédure pour configurer PHP 8.3 en production
comments: true
---

# Configuration PHP 8.3 pour Symfony en production

## 1. Identifier le fichier `php.ini` utilisé

### Ligne de commande (CLI)
```bash
php --ini
```
**Résultat attendu :**
```
Configuration File (php.ini) Path: /etc/php/8.3/cli
Loaded Configuration File:         /etc/php/8.3/cli/php.ini
```

### PHP-FPM (serveur web)
```bash
php-fpm8.3 -i | grep "Loaded Configuration"
```
**Résultat attendu :**
```
Loaded Configuration File => /etc/php/8.3/fpm/php.ini
```

> Les fichiers de configuration peuvent différer entre CLI et FPM. Symfony utilise celui de **FPM**.

---

## 2. Lien symbolique pour édition simplifiée

Je crée un lien vers le `php.ini` utilisé par FPM :

```bash
sudo mkdir -p /var/www/html/php8.3
sudo ln -s /etc/php/8.3/fpm/php.ini /var/www/html/php8.3/php.ini
```

Je vérifie :
```bash
ls -l /var/www/html/php8.3/php.ini
```
**Sortie :**
```
php.ini -> /etc/php/8.3/fpm/php.ini
```

---

## 3. Gestion des permissions

J’ajoute mon utilisateur au groupe `www-data` et je donne les droits d’écriture :

```bash
sudo usermod -aG www-data mon_nom_utilisateur
sudo chown root:www-data /etc/php/8.3/fpm/php.ini
sudo chmod 664 /etc/php/8.3/fpm/php.ini
```

> Je me reconnecte ou j’exécute `newgrp www-data` pour appliquer le changement.

---

## 4. Paramètres recommandés pour Symfony (production)

J’édite le fichier :
```bash
sudo nano /etc/php/8.3/fpm/php.ini
```

Je m’assure que les valeurs suivantes sont définies :

```ini
memory_limit = 512M
post_max_size = 32M
upload_max_filesize = 32M
max_execution_time = 60
max_input_time = 60
max_input_vars = 5000

realpath_cache_size = 4096K
realpath_cache_ttl = 600

[opcache]
; ========================================================================
; 🔧 Configuration OPcache optimisée pour Symfony 7.x (production PHP 8.3)
; ========================================================================

; Active le cache d’opcode Zend OPcache
opcache.enable=1
; Désactive OPcache pour la CLI (évite des incohérences avec bin/console)
opcache.enable_cli=0
; Mémoire allouée au cache d’opcodes (en Mo)
opcache.memory_consumption=256
; Mémoire dédiée aux chaînes internées (en Mo)
opcache.interned_strings_buffer=16
; Nombre maximum de fichiers PHP mis en cache
opcache.max_accelerated_files=20000
; Redémarre automatiquement le cache si plus de 10 % de mémoire est “gaspillée”
opcache.max_wasted_percentage=10
; Vérifie les modifications des fichiers PHP (nécessaire pour déploiement sans restart)
opcache.validate_timestamps=1
; Vérifie les changements toutes les 2 secondes
opcache.revalidate_freq=2
; Conserve les commentaires PHPDoc (obligatoire pour Doctrine et attributs)
opcache.save_comments=1
; Active la libération mémoire rapide (accélère les shutdown PHP-FPM)
opcache.fast_shutdown=1


date.timezone = Europe/Paris
```

---

## 4.1. Retrait des droits d’écriture
Pour des raisons de sécurité, je retire les droits d’écriture après modification :

```bash
sudo chmod 644 /etc/php/8.3/fpm/php.ini
```

## 5. Redémarrer PHP-FPM

J’applique les modifications :

```bash
sudo systemctl restart php8.3-fpm
```

Je vérifie le statut :

```bash
sudo systemctl status php8.3-fpm
```

---

## 6. Vérification finale (env de dev uniquement)

Je crée un fichier `info.php` dans `/var/www/html` :
```php
<?php phpinfo();
```

J’ouvre `http://localhost/info.php` et je vérifie :
- `Loaded Configuration File` pointe vers `/etc/php/8.3/fpm/php.ini`
- Les paramètres configurés sont actifs.

---

## 7. Notes

- `opcache.save_comments = 1` est **obligatoire** pour Symfony et Doctrine.  
- Je ne modifie jamais le fichier du CLI pour les besoins web.  
- En cas de multi-version PHP, j’isole chaque configuration :
  ```
  /var/www/html/php8.2/php.ini
  /var/www/html/php8.3/php.ini
  ```
