# Comment je structure une application Express.js

## Introduction

Pour structurer une application simple type micro-service avec Express.js je suit à minima cette architecture pour commencer à développer en javascript côté serveur avec Node.js et Express.js.

```
application/
│
├── controllers/
│   └── userController.js
│
├── repositories/
│   └── userRepository.js
│
├── models/
│   ├── user.js
│   └── index.js
│
├── routes/
│   └── userRoutes.js
│
├── middlewares/
│   └── errorHandler.js
│
├── app.js
├── .env
├── database.sqlite
│
└── package.json
```


- Models : Contient la définition des modèles de données avec Sequelize, ainsi que les hooks pour hacher les mots de passe.
- Repositories : Gère l'accès aux données en encapsulant les interactions avec la base de données. Cette couche permet de séparer la logique d'accès aux données de la logique métier.
- Controllers : Reçoit les requêtes HTTP, appelle les méthodes du repository pour manipuler les données, et retourne les réponses au client.
- Routes : Définit les routes de l'API, et appelle les méthodes des controllers en fonction des requêtes HTTP.
- Middlewares : Gère les erreurs et les exceptions, et les renvoie au client sous forme de réponses HTTP.
- App.js : Initialise l'application Express, configure les middlewares, les routes, et lance le serveur.


Ensuite au fil des besoins ajouter des dossiers pour, les configurations (ex bdd), les services, les tests, les vues , les assets, les configurations, etc.

- [Lien vers l'api de cette structure](https://express-user-api.simschab.cloud/)

## Clean Architecture

Pour des plus gros projets, je m'inspire de la Clean Architecture de Robert C. Martin, qui permet de découper l'application en plusieurs couches, en respectant les principes de séparation des préoccupations et de dépendances inversées.

```
backend/
│
├── core/
│   ├── entities/
│   │   └── todo.js
│   ├── useCases/
│   │   └── createTodo.js
│   └── repositories/            
│       └── todoRepository.js
│
├── interfaces/                  
│   ├── controllers/             
│   │   └── todoController.js
│   ├── repositories/            
│   │   └── todoRepository.js
│   └── routes/                  
│       └── todoRoutes.js
│
├── infrastructure/              
│   ├── database/                
│   │   └── sqlite.js
│   └── express/                 
│       ├── app.js
│       └── errorHandler.js
│
├── .env                         
├── database.sqlite              
│
└── package.json             


frontend/
│
├── public/
│   ├── index.html
│   └── favicon.ico
│
├── src/
│   ├── components/
│   │   └── Todo.vue
│   ├── views/
│   │   └── Todos.vue
│   ├── App.vue
│   └── main.js
│
├── .env
│
└── package.json

```

- Core : Contient les entités métier, les cas d'utilisation, et les interfaces des repositories. Cette couche contient la logique métier de l'application, et est indépendante des frameworks et des librairies externes.

- Interfaces : Contient les contrôleurs, les routes, et les interfaces des repositories. Cette couche est responsable de la communication entre l'application et l'extérieur, et est dépendante des frameworks et des librairies externes.

- Infrastructure : Contient les implémentations des repositories, les middlewares, et les configurations. Cette couche est responsable de la communication avec les bases de données, les services externes, et les frameworks.

- [Lien vers le front de cette structure avec un domaine pour le Front et un domaine Serveur](https://vue-todo-front.simschab.cloud)
