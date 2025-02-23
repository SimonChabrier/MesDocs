---
title: Matomo - Auto-heberger l'application
description: Simon Chabrier - Installer Matomo sur un serveur la procédure pour auto-heberger l'application.
---

# Installer Matomo sur un serveur et auto-heberger l'application

Ici le but est d'installer puis configurer matomo sur mon serveur pour suivre les visites de mes applications web en auto-hébergement sur mon home serveur.

- [Documentation Matomo](https://matomo.org/faq/on-premise/installing-matomo/)

## Téléchargement de Matomo

A la racine du domaine ou on veut déployer Matomo, télécharger et décompresser l'archive

```bash
wget https://builds.matomo.org/matomo.zip && unzip matomo.zip
```

## Configurer CaddyServer

- Exemple de configuration minimale pour CaddyServer qui respecte les directives de sécurité de Matomo :

`Ajouter les CSP et les headers de sécurité comme on le ferait pour un site web...Ici c'est la config minimale...`

```bash
mon_domaine_matomo.mondomaine.ext {

    root * /var/www/html/path_to_matomo
    php_fastcgi unix//run/php/php-fpm.sock
    file_server

	@blocked {
		path /.git/*
		path /core/*
		path /config/*
		path /lang/*
		path /tmp/*
	}
	respond @blocked 403
}
```

## Créer un sous domaine

Chez le registar ajouter un enregistrement A pour le domaine ou le sous domaine.

## Aller à l'adresse du sous domaine pour lancer l'installation de matomo

Dans le navigateur à la racine du domaine ou du sous domaine, suivre les étapes d'installation de matomo. Si il y a des erreurs de permisison il donne les commandes à passer pour les régler. Ensuite l'intallation se fait en quelques clics et c'est terminé, reste à faire les optimisations techniques et sécuritaires puis ajouter les sites à suivre et tester les codes de suivi...

## Amélioration des performances et config de séurité ;

On peut avoir des erreurs de performances si la base de données n'est pas configurée correctement. Se rendre dans les paramètres -> vérification du sytème -> pour vérifier le rapport de configuration. Si il y a des problèmes ils sont indiqués là.

## Configurer La Bdd et la Tâche Cron pour éviter les erreurs de performances.

Théoriquement ce sera créer un tâche cron pour l'optimisation de la base de données.
Eventuellement ajouter une configuration spécifique dans le fichier de configuration de matomo.
On etrouvera par xemple le fichier à éditer dans `/var/www/html/path_to_matomo/config/config.ini.php`

- Par exemple ajouter ça sous `[General]` :

```bash
force_ssl = 1
enable_browser_archiving_triggering = 0
```
Ca permet de forcer l'utilisation de SSL et de désactiver le déclenchement de l'archivage par le navigateur...`redemarrer le serveur web après modification du fichier de configuration`

- Si il faut augmenter le `max_allowed_packet` de la base de données :

```bash
sudo nano /etc/mysql/mariadb.conf.d/50-server.cnf
```

- Pour MariaDb, ajouter en haut du fichier ou modifier la ligne suivante sous [mysqld] (ajouter [mysqld] si il n'existe pas) :

```bash
max_allowed_packet=64M
```

- Remettre en route le serveur de base de données :

```bash
sudo systemctl restart mariadb
```

- Vérifier la nouvelle valeur :

```bash
mysql -u root -p
```

```sql
SHOW VARIABLES LIKE 'max_allowed_packet';
```

- Sortie attendue :

```sql
+--------------------+---------+
| Variable_name      | Value   |
+--------------------+---------+
| max_allowed_packet | 67108864 |
+--------------------+---------+
````

Rafraichir la page de vérification du système dans matomo pour voir si les erreurs ont disparues.


