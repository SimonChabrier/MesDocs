---
title: Identifier sa machine pour GitHub
description: Comment identifier sa machine pour GitHub en utilisant une clé SSH.
comments: true
---

# Identifier sa machine pour GitHub

- Pour identifier sa machine pour GitHub, il faut générer une clé SSH et l'ajouter à son compte GitHub.

## Générer une clé SSH

- Pour générer une clé SSH, on utilise la commande `ssh-keygen` dans le terminal. On ajoute un commentaire pour identifier la clé avec l'adresse email associée au compte GitHub.

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

- On peut aussi ajouter un mot de passe ou passphrase pour sécuriser la clé. Il faudra alors taper ce mot de passe à chaque fois qu'on utilisera la clé. Donc on en met pas pour ne pas avoir à taper le mot de passe à chaque fois.

- DOnc on dit suivant à chaque question posée par la commande `ssh-keygen`.

- La commande génère une paire de clés SSH, une clé privée et une clé publique. La clé privée est stockée dans le fichier `~/.ssh/id_ed25519` et la clé publique dans le fichier `~/.ssh/id_ed25519.pub`.


- On affiche la clé publique pour la copier et l'ajouter à son compte GitHub.

```bash
cat ~/.ssh/id_ed25519.pub
```

- Copier la clé publique pour l'ajouter à son compte GitHub.


## Ajouter la clé SSH à son compte GitHub

- Dans son compte utilisateur personnel, aller dans les paramètres du compte (settings), puis dans les paramètres SSH et GPG keys.

- Cliquer sur le bouton "New SSH key" pour ajouter une nouvelle clé SSH.

- Coller la clé publique copiée précédemment dans le champ "Key".

- Donner un titre à la clé pour l'identifier, par exemple le nom de la machine.

- Enregistrer la clé.

- La clé SSH est maintenant ajoutée à son compte GitHub et on peut utiliser la clé privée pour se connecter aux dépôts GitHub en SSH...

- La machine est désormais identifiée pour GitHub pour le compte lié à la clé SSH et on peut cloner, pousser et tirer des dépôts GitHub en utilisant le protocole SSH.



