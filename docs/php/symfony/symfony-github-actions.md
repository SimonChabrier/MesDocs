---
title : "configurer un pipeline CI/CD avec GitHub Actions pour un projet Symfony 7.2"
description : "Configurer un pipeline CI/CD avec GitHub Actions pour un projet Symfony 7.2 et Node.js"
---

# Configurer un pipeline CI/CD avec GitHub Actions pour un projet Symfony 7.2 / Node.js

## Prerequis serveur

Créer une paire de clé SSH pour se connecter à son serveur sans mot de passe.

```shell
ssh-keygen -t ed25519 -C "commentaire identifiant la clé" -f ~/.ssh/nom_de_la_cle_deploy
cat ~/.ssh/nom_de_la_cle_deploy.pub
```

***Clé à générer sans rensigner de passphrase pour ne pas qu'lle nécessite de mot de passe pour être utilisée.***


## Préparation projet

Crée un dossier `.github/workflows` à la racine du projet puis ajouter un fichier `deploy.yaml` avec le contenu suivant :

```yaml
name: Deploy Edith 0

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up SSH
        run: |
          mkdir -p ~/.ssh
          chmod 700 ~/.ssh

          echo "${{ secrets.PRIVATE_KEY }}" > ~/.ssh/edith_deploy
          chmod 600 ~/.ssh/edith_deploy

          echo "${{ secrets.KNOWN_HOSTS }}" > ~/.ssh/known_hosts
          chmod 644 ~/.ssh/known_hosts

      - name: Deploy
        env:
          SSH_USER: ${{ secrets.TARGET_USER }}
          SSH_HOST: ${{ secrets.TARGET_HOST }}
        run: |
          ssh -v -i ~/.ssh/edith_deploy -o StrictHostKeyChecking=no $SSH_USER@$SSH_HOST << 'EOF'
            set -e
            cd /var/www/html/MonProjet

            echo "Delete vendor and node_modules directories..."
            rm -rf vendor
            rm -rf node_modules

            # Charger NVM depuis la variable d'environnement du shell du serveur (si non ça marche pas)
            export NVM_DIR="$HOME/.nvm"
            source "$NVM_DIR/nvm.sh"
            nvm use default  

            echo "Pulling latest changes from main branch..."
            git pull origin main
            
            echo "Installing PHP dependencies..."
            composer install --no-interaction --no-dev --optimize-autoloader

            # Assurer que npm utilise la bonne version de Node.js
            echo "Installing Node.js dependencies..."
            npm install 

            echo "Building assets..."
            npm run build

            echo "Update database schema..."
            php bin/console doctrine:schema:update --force

            echo "Clearing Symfony cache..."
            php bin/console cache:clear --env=prod

            echo "Deployment completed successfully!"
          EOF
```

## Explication le fichier `deploy.yaml`

Sur GitHub sur le repo du projet dasn `Settings` > `Secrets and variables` j'ajoute les secrets suivants :

`PRIVATE_KEY` : C'est ma clé privée SSH pour me connecter à mon serveur sans mot de passe.
`KNOWN_HOSTS` : C'est un fichier qui contient les clés des serveurs auxquels je me connecte. Cela sert à vérifier que le serveur auquel je me connecte est bien celui que je pense.
`TARGET_USER` : C'est l'utilisateur sur mon serveur, celui avec lequel je me connecte en SSH (comme ubuntu, root, etc.).
`TARGET_HOST` : C'est l'adresse IP ou le nom de domaine de mon serveur (ex : example.com ou 192.168.1.10).

Dans `Deploy Keys`, j'ajout aussi une clé SSH publique pour mon dépôt GitHub.

## Sequence de déploiement

Lorsque je pousse du code sur la branche `main`, GitHub Actions déclenche le workflow `deploy.yaml` qui se charge d'effectuer une connexion SSH sur mon serveur, de récupérer les dernières modifications du code, d'installer les dépendances PHP et Node.js, de construire les assets, de mettre à jour le schéma de la base de données et de vider le cache Symfony.

Il exécute une série de commande à ma place exactement comme si je les avais exécutées manuellement sur mon serveur.

## Conclusion

Ce script sert de base pour un pipeline CI/CD simple. Il est possible de l'améliorer en ajoutant des tests, des notifications, des déclencheurs pour d'autres branches, etc.
