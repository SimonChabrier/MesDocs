---
title: Configuration SSH pour l'accès au serveur
description: Comment configurer l'accès SSH à un serveur, y compris la création de clés SSH, la configuration de l'extension Remote-SSH dans Visual Studio Code, et la gestion des permissions.
---

# Commandes récapitulatives pour créer une clée ssh local et la déclarer sur le serveur

### Objectif autoriser un hôte à se connecter au serveur en SSH

Utilisé pour autoriser Vs-Code à se connecter à code-serveur en ssh via l'extension VsCode Remote-SSH (Microsoft)

## Côté serveur

- **Vérifier si OpenSSH est instalé sur le serveur** :
```shell
  ssh -V
```
 
- **Si nécessaire, installer OpenSSH sur le serveur** :
```shell
  sudo apt update && sudo apt install -y openssh-server
  sudo systemctl enable ssh
  sudo systemctl start ssh
```

- **Vérifier si OpenSSh est bien actif**
```shell
  sudo systemctl status ssh
```

- **Vérifier si le port 22 est ouvert** :
```shell
  sudo ufw allow 22
  sudo ufw enable
  sudo ufw status
```

- **Restreindre l'accès SSH à une ou plusieurs IP** :
```shell
  sudo ufw allow from UNE_IP_PUBLIQUE_AUTORISEE to any port 22
  sudo ufw status
```

- **Si on veut désactiver l'accès SSH par mot de passe** :
```shell
  sudo nano /etc/ssh/sshd_config
  PasswordAuthentication no
  PermitRootLogin no
  sudo systemctl restart ssh
```

- **Si on veut changer le port SSH**
```shell
  sudo nano /etc/ssh/sshd_config
  Port 2222
  sudo systemctl restart ssh
```

- **Ouvrir le port 2222 dans le firewall**
```shell
  sudo ufw allow 2222
  sudo systemctl restart ssh
```

- **Trouver l'Ip du serveur** :
```shell
  ip a
```

## Côté hôte local

- **Vérifier si une clé SSH existe sur l'hôte local** :  
```shell 
  ls -l ~/.ssh/
```

- **Créer la clé SSH sur l'hôte local si nécessaire** :  
```shell
  ssh-keygen -t rsa -b 4096 -C "email@example.com"
```

- **Afficher la clé publique** :  
```shell
  cat ~/.ssh/id_rsa.pub
```

- **Vérifier la présence du repertoire .ssh pour l'utilisateur**
```shell
  cd /home/nomUtilisateur/.ssh
```

- **Créer le répertoire `.ssh` sur le serveur (si nécessaire)** :  
```shell
  mkdir -p ~/.ssh
```

- **Chemin des clés sur le serveur**
```shell
  cd /home/nomUtilisateur
```

- **Éditer le fichier `authorized_keys` sur le serveur** :  
```shell
  nano ~/.ssh/authorized_keys
```

- **Ajouter la clé publique de l'hôte local dans le fichier `authorized_keys` sur le serveur** :
  `copier la clé publique de l'hôte local (cmd : cat ~/.ssh/id_rsa.pub) et la coller dans le fichier authorized_keys àla suite des autres clés`

- **Sécuriser les permissions des fichiers et répertoires SSH sur le serveur** :  
```shell
  chmod 700 ~/.ssh  
  chmod 600 ~/.ssh/authorized_keys
```

- **Tester la connexion SSH** :  
```shell
  ssh nomUtilisateur@serveur_ip
```


-**Si on veut se connecter à code-serveur depuis le navigateur**
  `vscode.simschab.cloud`

## Si on ne sait plus quel mot de passe utiliser quand le navigateur demande le mot de passe pour se connecter à code-server
```shell 
  cat ~/.config/code-server/config.yaml | grep password
```

`Commande à passer sur le serveur bien sur et pas sur l'hôte local. Le mot de passe est généré automatiquement à l'installation de code-server et est stocké dans le fichier de configuration de code-server. On le trouve avec la commande ci-dessus et on le copie pour le coller dans le navigateur.`
