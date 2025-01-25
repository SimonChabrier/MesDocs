---
title: Commandes utiles dans Symfony
description: Comilation des principales commandes terminal utiles dans Symfony pour le développement d'applications web - Simon Chabrier
---

## Commandes basiques utiles dans Symfony


### V&rifier ses requi&ements

```bash
symfony check:requirements
```

### Créer un nouveau projet Symfony skeleton

- lien doc : [SetUp-Install](https://symfony.com/doc/current/setup.html)

`Version 7.2.x ou Version LTS (Long Term Support) ou Version next (prochaine version pour tester)`

```bash
symfony new my_project_directory --version="7.2.x" 
symfony new my_project_directory --version=lts
symfony new my_project_directory --version=next
```

### Créer un nouveau projet Symfony avec un projet standard

- Mêmes commandes en ajoutant le flag `--webapp`

```bash
symfony new my_project_directory --version="7.2.x" --webapp

```

### Lancer le serveur de développement

```bash
cd my_project_name
symfony server:start
```

### Créer un contrôleur

```bash
php bin/console make:controller
```

### Créer une migration

```bash
php bin/console make:migration
```

### Exécuter les migrations

```bash
php bin/console doctrine:migrations:migrate
```

### Créer un utilisateur

```bash
php bin/console make:user
```

### Créer un authentificateur

```bash
php bin/console make:auth
```

### Créer une Entité

```bash
php bin/console make:entity
```

### Créer les migrations

```bash
php bin/console make:migration
```

### Exécuter les migrations

```bash
php bin/console doctrine:migrations:migrate
```

### Créer un CRUD

```bash
php bin/console make:crud
```

### Créer un formulaire

```bash
php bin/console make:form
```

### Créer un test

```bash
php bin/console make:test
```

### Créer un fixture

```bash
php bin/console make:fixture
```

## Commandes liés à la sécurité

### Vérifier ses dépendances de sécurité

```bash
symfony check:security
```


## Commandes Doctrine

### installer doctrine 

```bash
composer require symfony/orm-pack
composer require --dev symfony/maker-bundle
```

### Créer la base de donnée à partir des params du `.env.local`

```bash
bin/console doctrine:database:create
```

### Mettre à jour la base de données

```bash
bin/console doctrine:schema:update --force
```

- lien doc : [Doctrine Config](https://symfony.com/doc/current/doctrine.html)

## Commandes de nettoyage et maintenance

### Nettoyer le cache

```bash
bin/console cache:clear
bin/console cache:pool:clear --all
```

### Nettoyer tous les caches globalement

```bash
bin/console cache:pool:clear cache.global_clearer
```

- lien doc : [Cache](https://symfony.com/doc/current/cache.html)

## Switcher de l'AssetMapper à Webpack

```bash
composer remove symfony/ux-turbo symfony/asset-mapper symfony/stimulus-bundle
composer require symfony/webpack-encore-bundle symfony/ux-turbo symfony/stimulus-bundle
```

- Si web pack installer et lancer le serveur de dev

```bash
npm install
npm run dev
```

lien doc : [AssetMapper](https://symfony.com/doc/current/frontend.html#assetmapper)
lien doc : [Webpack](https://symfony.com/doc/current/frontend/encore/installation.html)