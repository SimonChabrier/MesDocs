# Transfert de fichiers entre serveurs et hôtes

- Ici le problème est de transférer des fichiers entre un serveur et un hôte. Je veux pouvoir en ssh copier un fichier d'un serveur vers un hôte ou d'un hôte vers un serveur.

## Depuis un serveur vers un hôte
Dans un terminal me placer dans le dossier où je veux récupèrer le fichier et lancer la commande

```shell
scp nomUtilisateur@192.168.0.100:/etc/caddy/Caddyfile .
```

ça me logue sur le serveur et copie le fichier Caddyfile dans le dossier où je me trouve. (terrminal local)
ou ./ici/le/dossier/ou/je/veux/le/fichier/Caddyfile

```shell
scp nomUtilisateur@192.168.0.100:/etc/caddy/Caddyfile ./ici/
```

## Depuis un hôte vers un serveur

```shell
scp ./ici/le/fichier/Caddyfile nomUtilisateur@192.168.0.100:/etc/caddy/Caddyfile
```