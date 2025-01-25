---
title: Créer un utilisateur de base de données sans interface graphique
description: Créer un utilisateur de base de données sans interface graphique avec Ubuntu 20.04 et MySQL ou MariaDB
---

# Créer un utilisateur de base de données sans interface graphique

Quand on installe son serveur on a pas toujours une interface graphique pour gérer les bases de données je me stocke ici les commandes de base si besoin de créer un utilisateur de base de données.

Les utilisateur sont ceux définis dans la base de données MySQL ou MariaDB.

## lister les utilisateurs 

```bash
sudo mysql -u root -p
SELECT User FROM mysql.user;
```

Saisir le mot de passe de l'utilisateur root à ce moment là pour se connecter à la base de données.

## Avec tous les droits sur toutes les bases de données

```bash
CREATE USER 'johndoe'@'localhost' IDENTIFIED BY 'lemotdepasse';
GRANT ALL PRIVILEGES ON *.* TO 'johndoe'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```

## Avec tous les droits sur une base de données

```bash
CREATE USER 'johndoe'@'localhost' IDENTIFIED BY 'lemotdepasse';
GRANT ALL PRIVILEGES ON nom_de_la_bdd.* TO 'johndoe'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```

## Avec des droits spécifiques sur une base de données

```bash
CREATE USER 'johndoe'@'localhost' IDENTIFIED BY 'lemotdepasse';
GRANT SELECT, INSERT, UPDATE, DELETE ON nom_de_la_bdd.* TO 'johndoe'@'localhost';
FLUSH PRIVILEGES;
```

## Supprimer un utilisateur

```bash
DROP USER 'johndoe'@'localhost';
FLUSH PRIVILEGES;
```

`à la fin il faut faire exit pour sortir de MySQL ou MariaDB`

## Conclusion

C'est utilise à l'installation du serveur lorsque l'on a pas encore d'interface graphique pour gérer les bases de données.