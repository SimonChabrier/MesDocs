---
title: Configuring SSH sur macOS
tags: Procédure pour configurer un accès serveur SSH sur son host macOS
---

# Configurer SSH sur macOS

Lorsque je veux me connecter en SSH à un serveur local depuis macOS, il est nécessaire d'ajouter le domaine ou l'IP dans le fichier `/etc/hosts` pour que macOS puisse résoudre le nom de domaine. Sinon, la connexion SSH sera refusée. 

## Etapes à suivre

1. Ajouter le domaine dans `/etc/hosts` : Ouvrir le fichier `/etc/hosts` avec `sudo nano /etc/hosts` et ajouter l'IP et le nom du serveur, par exemple :
    ```shell
    82.66.XXX.XXX    domaine.local.a   domaine.local.b nom-serveur
    192.168.0.100    nom-serveur domaine.local.a   domaine.local.b
    ```
- Je peux déclarer plusieurs domaines ou noms de machines sur une même ligne pour une IP donnée.

2. Flusher le cache DNS avec `sudo killall -HUP mDNSResponder` pour appliquer les changements.

3. Générer une paire de clés SSH avec `ssh-keygen -t ed25519 -C "commentaire identifiant la clé" -f ~/.ssh/nom_de_la_cle`.

`-t ed25519` : Spécifie le type de clé, ici ED25519, plus rapide et sécurisé.
`-C "commentaire identifiant la clé"` : Un commentaire pour identifier la clé, souvent un email ou une description.
`-f ~/.ssh/nom_de_la_cle` : Le chemin et le nom du fichier où la clé privée sera sauvegardée (la clé publique sera sauvegardée avec le même nom mais avec l'extension `.pub`).

4. Afficher la clé publique avec `cat ~/.ssh/nom_de_la_cle.pub` et l'ajouter dans `~/.ssh/authorized_keys` sur la machine distante.

5. Se connecter en SSH avec `ssh utilisateur@nom-serveur` ou en utilisant l'IP `ssh utilisateur@ip.du.serveur`.

Cette méthode permet de configurer l'accès SSH de manière fonctionnelle sur macOS 11.6.5 (Big Sur).
