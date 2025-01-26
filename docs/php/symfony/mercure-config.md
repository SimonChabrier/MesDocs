---
title: Configuration de Mercure dans Symfony
description: Configuration de Mercure dans une application Symfony pour les SSE notifications
---

# Mercure dans une application Symfony

Exemple minimaliste de configuration de Mercure dans une application Symfony pour les notifications en temps réel.

## Préréquis

- Serveur Mercure installé: [Installation de Mercure](/docs/system/mercure-install)
- Jwt Généré correctement: [Générer un token JWT pour Mercure](/docs/system/mercure-jwt-generator)

## Configuration de Mercure dans Symfony

- Installation du package Symfony Mercure :

```shell
composer require symfony/mercure
```

## Configuration de Mercure dans Symfony

`mercure.yaml` :

```yaml
mercure:
    hubs:
        default:
            url: '%env(MERCURE_URL)%'
            public_url: '%env(MERCURE_PUBLIC_URL)%'
            jwt:
                secret: '%env(MERCURE_JWT_SECRET)%'
                publish: '*'
                subscribe: '*'
```


`.env.local` :

```ini
MERCURE_URL=https://mondomaine_mercure.mondomaine.ext/.well-known/mercure (url utilisé pour atteindre le hub depuis le serveur - Attention bien être en https)
MERCURE_PUBLIC_URL=https://mondomaine_mercure.mondomaine.ext/.well-known/mercure (url utilisé pour atteindre le hub depuis le client - Attention bien être en https)
MERCURE_JWT_SECRET=!ChangeThisMercureHubJWTSecretKey! (signature du JWT de base si pas changée dans le fichier de configuration de Mercure - Voir la page de génération de JWT et configuration de Mercure)
```

## Utilisation de Mercure dans Symfony

## Côté serveur

- Topic : URL de la ressource à mettre à jour
- Data : Données à envoyer

le `Publisher` envoie un `Update` à un `Hub` qui le transmet à tous les clients abonnés à l'URL de la ressource.

le topic est la ressource à mettre à jour et le data est les données à envoyer.

```php
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;
use Symfony\Component\HttpFoundation\Response;

public function publish(HubInterface $hub): Response
{
    $update = new Update(
        'new-message', // Topic
        json_encode(['message' => 'Je suis le message']) // données à envoyer
    );

    $hub->publish($update); // Envoi du message sur le hub Mercure qui va le diffuser à tous les clients abonnés à ce topic via l'url du Hub Mercure

    return new Response('Message envoyé'); // Réponse de confirmation
}
```

## Côté client

- Le client s'abonne à un topic
- Le serveur envoie un message à ce topic

```html
<!DOCTYPE html>
<html>
    <head>
        <title>Notification</title>
        <script>
            // exemple minimaliste de client qui écoute les messages envoyés sur le topic 'new-message' et les affiche dans la console
            // on devrait utiliser les objet URL et URLSearchParams pour construire l'url de l'EventSource mais pour simplifier le test j'utilise une chaine de caractères
            const eventSource = new EventSource("{{ mercure('https://mondomaine_mercure.mondomaine.ext/.well-known/mercure?topic=new-message')|escape('js') }}");
            eventSource.onmessage = (event) => {
                console.log(JSON.parse(event.data)); 
            };
        </script>
    </head>
    <body>
        <h1>Notifications</h1>
    </body>
</html>
```

## Ressources perso repo github

- [BackEnd Configuration ApiPlatform](https://github.com/O-clock-Meduse/projet-05-obaby-back/blob/main/config/packages/api_platform.yaml)
- [BackEnd Configuration Symfony Mercure](https://github.com/O-clock-Meduse/projet-05-obaby-back/blob/main/config/packages/mercure.yaml)
- [BackEnd Publication Controller](https://github.com/O-clock-Meduse/projet-05-obaby-back/blob/main/src/Controller/BackOffice/ContactController.php)
- [BackEnd Publication Service](https://github.com/O-clock-Meduse/projet-05-obaby-back/blob/main/src/Service/ContactService.php)
- [BackEnd Affichage](https://github.com/O-clock-Meduse/projet-05-obaby-back/blob/main/templates/admin/statistics/index.html.twig)

## Conclusion

Mercure permet de recevoir des mises à jour en temps réel sans recharger la page, idéal pour notifier l'utilisateur de changements côté serveur.

- **API Platform** : Gère les notifications en temps réel avec Mercure. [Voir la doc](https://api-platform.com/docs/core/mercure/).
- **Symfony & Doctrine** : Rend les entités Doctrine notifiables. [Voir la doc](https://symfony.com/doc/current/mercure.html).


