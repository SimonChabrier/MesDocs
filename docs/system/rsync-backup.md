---
title: Gestion des Sauvegardes Incrémentielles avec rsync et Automatisation viaune tâche cron
description: Mettre en place une solution de sauvegarde incrémentielle automatisée pour ton système à l'aide de rsync, avec une gestion des logs et une planification via une tâchecron.
---

# Gestion des Sauvegardes Incrémentielles avec rsync et Automatisation via cron

Objectif : Mettre en place une solution de sauvegarde incrémentielle automatisée pour mon système à l'aide de rsync, avec une gestion des logs et une planification via une tâche cron.

## Configuration de rsync pour les Sauvegardes

Installer rsync :

```shell
sudo apt install rsync
```

Créer un point de montage pour les sauvegardes  sur le disque de sauvegarde :

```shell
sudo mkdir /mnt/backup
```

Ajouter une entrée dans /etc/fstab pour monter le disque de sauvegarde au démarrage :

```shell
/dev/sdb1 /mnt/backup ext4 defaults 0 0
```

Monter le disque de sauvegarde :

```shell
sudo mount -a
```

Créer un répertoire pour les sauvegardes complètes :

```shell
sudo mkdir /mnt/backup/backupfull
```

## Commande de sauvegarde complète initiale :

Si je veux faire directement une sauvegarde complète pour tester la première fois :

```shell
/usr/bin/rsync -avvv -AAX --delete --inplace --no-whole-file --numeric-ids \
  --recursive --one-file-system \
  --info=progress2 --partial \
  --exclude={"/proc/*","/sys/*","/dev/*","/run/*","/tmp/*","swap.img"} \
  / /mnt/backup/backupfull/ \
  --no-ignore-errors >> /var/log/backup.log 2>> /var/log/backup_errors.log

```


`/usr/bin/rsync : Chemin vers l'exécutable rsync`

`-avv : Mode archive avec copie récursive et affichage verbeux détaillé`  

`-aAX : Préserve les attributs étendus et les ACL`  

`--delete : Supprime les fichiers de la destination absents de la source`  

`--inplace : Met à jour les fichiers directement sur la destination sans créer de copie temporaire`  

`--no-whole-file : Utilise la synchronisation delta pour transférer uniquement les parties modifiées`  

`--numeric-ids : Conserve les identifiants numériques des utilisateurs et groupes`  

`--recursive : Copie récursivement les répertoires et fichiers` 

`--one-file-system : Ne traverse pas les points de montage (reste sur le même système de fichiers)`

`--info=progress2 : Affiche la progression de la copie avec des informations détaillées`  

`--partial : Permet de reprendre une copie interrompue`
 
`--exclude={"/proc/*","/sys/*","/dev/*","/run/*","/tmp/*","swap.img"} : Exclut les répertoires système et le fichier swap.img`  

`/ : Spécifie la source (la racine du système)`  

`/mnt/backup/backupfull/$(date +\%Y-\%m-\%d_%H-%M-%S) : Spécifie la destination, en créant un dossier de sauvegarde horodaté`  

`--no-ignore-errors : Continue la synchronisation même en cas d'erreur`  

`>> /var/log/backup.log 2>&1 : Redirige la sortie standard et les erreurs vers le fichier de log`

J'exclu swap.img de la sauvegarde car il est inutile de sauvegarder le swap c'est un fichier temporaire qui sera recréé au prochain démarrage du système et il peut peser plusieurs Go.

- Voir les logs pour monitorer le travail de la commade de sauvegarde :

```shell
tail -f /var/log/backup.log
```

La sauvegarde se fait depuis la racine / vers le répertoire de sauvegarde /mnt/backup/backupfull/ avec une date et une heure dans le nom du répertoire donc je fait une sauvegarde totale...mais je pourrais aussi uniqument sauvegarder uniquement les app de mon serveur web par exemple...


## Planification avec cron de la sauvegarde incrémentielle

Je préfère utiliser cron pour planifier la sauvegarde c'est plus simple et plus rapide à mettre en place...mais on pourrait aussi utiliser systemd pour automatiser la sauvegarde.

Ouvrir la crontab pour éditer la tâche planifiée :

```shell
crontab -e
```

Ajouter cette entrée pour exécuter la commande de sauvegarde incrémentale chaque jour à 4h00 :

```shell
0 4 * * * /usr/bin/rsync -avvv -AAX --delete --inplace --no-whole-file --numeric-ids --recursive --one-file-system --info=progress2 --partial --exclude=/proc/* --exclude=/sys/* --exclude=/dev/* --exclude=/run/* --exclude=/tmp/* --exclude=swap.img / /mnt/backup/backupfull/ --no-ignore-errors >> /var/log/backup.log 2>> /var/log/backup_errors.log
```

## Gestion des Logs

Les logs de la sauvegarde sont enregistrés dans /var/log/backup.log. Je peux suivre l'exécution des sauvegardes en temps réel avec la commande :

```shell
tail -f /var/log/backup.log
```

## Recommencer à 0 si besoin...

Je peux supprimer le contenu du dossier de backupfull pour recomencer le processus de sauvegarde en cas de besoin :

```shell
sudo rm -rf /mnt/backup/backupfull/*
```

A ce moment là il faudra refaire la command de sauvegarde complète pour recommencer le processus de sauvegarde...et ensuite la cron job se chargera de faire les sauvegardes incrémentielles.

## Commandes complémentaires

-  Afficher les 20 dernières lignes contenant "rsync" dans les logs système

```shell
grep rsync /var/log/syslog | tail -20 
```
- Vider le fichier de log de backup

```shell
> /var/log/backup.log
```

- Afficher les détails (y compris la taille) du fichier de log de backup

```shell
ls -l /var/log/backup.log
```

- Afficher les 5 dernières sauvegardes (triées par date décroissante)

```shell
ls -lt /mnt/backup/backupfull/ | head -n 5
```

## Conclusion

Avec cette configuration, je dispose d'un système de sauvegarde incrémentielle automatisé et sécurisé pour mon système. Les sauvegardes sont planifiées et exécutées régulièrement, avec une gestion des logs pour suivre les opérations. Je stocke la sauvegarde sur un second disque monté en /mnt/backup...si le système crame j'aurais la possibilité de restaurer mon système en quelques minutes. Chaque jour la CRON job va lire le fichier de sauvegarde actuel, le comparer avec le dernier fichier de sauvegarde et ne copier que les fichiers qui ont été modifiés ou ajoutés depuis la dernière sauvegarde...le dossier prendra à nouveau la date et l'heure de la sauvegarde...et ainsi de suite...je peux aussi faire des sauvegardes incrémentielles sur plusieurs jours, semaines, mois...en fonction de mes besoins.


