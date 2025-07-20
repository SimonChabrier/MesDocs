---
title: Serveur VsCode avec Remote-SSH
description: Serveur VsCode pour utiliser l'extension Remote-SSH et accéder à un serveur distant depuis VsCode.
---
# Serveur VsCode pour utiliser l'extension Remote-SSH et accéder à un serveur distant depuis VsCode.

- Ici le problème réglé est la connexion à mon home serveur depuis mon poste de travail en utilisant l'extension Remote-SSH de VsCode.
que ce soit depuis le réseau local ou depuis l'extérieur. Comme ça je peux travailler sur mes projets depuis n'importe où et directement depuis VsCode sur le serveur.
Mois de manipulations et plus de confort nottament pour l'édition de fichiers comme par exmeple un Caddyfile ou un fichier de configuration php.ini...


## Installer code-server sur le serveur

- Se connecter au serveur en ssh
- Installer le serveur code-server :

```shell
curl -fsSL https://code-server.dev/install.sh | sh
```

- Lancer le serveur code-server :

```shell
code-server
```

- C'est un service donc on choisi si on veut qu'il démarre automatiquement au démarrage du serveur ou non...


## Fichier de configuration dasn Vs Code

cmd + maj + p 
- Chercher `Remote-SSH: ouvrir le fichier de configuration SSH...`  
- Renseigner la configuration pour que l'extension Remote-SSH puisse se connecter au serveur :

```shell
    Host vscode.simschab.cloud
    HostName vscode.simschab.cloud
    User simon
    IdentityFile ~/.ssh/id_rsa
    Port 22
```

- ou si user root

```shell
Host vscode.simschab.cloud
    HostName vscode.simschab.cloud
    User root
    IdentityFile ~/.ssh/id_rsa
    Port 22
```

- à ce moment là il faut saisir le mot de passe root pour se connecter au serveur.

`penser à autoriser la connectio au en tant que root dans le fichier sshd_config`

```shell    
sudo nano /etc/ssh/sshd_config
```

- Modifier la ligne `PermitRootLogin no` en `PermitRootLogin yes` pour autoriser la connexion en tant que root.


- On met donc le nom de domaine du serveur si il y en a un ou sinon l'IP du serveur à la place, le nom d'utilisateur qui va deamnder l'autorisaiton de se connecter au serveur, le chemin de la clé ssh privée et le port de connexion ssh par défaut (si on a changé le port ssh sur le serveur il faut le renseigner ici).

- Il faut créer une clé ssh publique sur sa machine local et l'ajouter au fichier `authorized_keys` dans la liste des clés pour autoriser la connection de l'hôte au serveur.
`voir la page de documentation sur les clés ssh pour la procédure.`

## Permet d'utiliser l'extension Remote-SSH dasn VsCode
- En bas à gauche cliquer sur se conecter en ssh

## Donne un accès par nom de domaine

- code.simschab.cloud 
- saisir le mdp

## Config CaddyServer

```shell
sudo nano /etc/caddy/Caddyfile
```

- Le serveur VsCode est accessible depuis le navigateur à l'adresse `http://localhost:8080` on configure un reverse proxy pour le rendre accessible depuis un nom de domaine.
- Ajouter le domaine vscode.simschab.cloud et le rediriger vers le port 8080 de la machine locale :
- https://vscode.simschab.cloud/login va demander le mot de passe pour se connecter au serveur code-server depuis un navigateur.

```js
vscode.simschab.cloud {
    reverse_proxy localhost:8080
}
```

## Donner les permission en écriture au user connecté :

- Exemple, me donner les droits en écriture à tous les dossier contenus dans `html`

```shell
sudo chown -R simon:www-data /var/www/html
```

le propriétaire est simon et le groupe est www-data, donc simon peut écrire dans les dossiers du serveur comme www-data peut le faire.

- On donne les droits en écriture au groupe www-data et le user connecté au serveur doit appartenir à ce groupe pour pouvoir écrire dans les dossiers.

```shell
sudo chown -R nom_utilisateur:www-data /var/www/html/project
```

- vérifier les droits données :

```shell
sudo chmod -R 775 /var/www/html/projet
```


## Conclusion
`775`
Le premier 7 : Les droits du propriétaire (lecture, écriture et exécution).
Le deuxième 7 : Les droits du groupe (lecture, écriture et exécution).
Le 5 : Les droits pour les autres (lecture et exécution, mais pas écriture).

L'utilisateur connecté au serveur doit appartenir au groupe www-data pour pouvoir écrire dans les dossiers du serveur.
Maintenant l'utilisateur et le groupe www-data ont les droits en écriture sur les dossiers du serveur.