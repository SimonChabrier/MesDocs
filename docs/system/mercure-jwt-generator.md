---
title: Générer un token JWT pour Mercure
description: Générer un token JWT pour Mercure avec jwt.io tout en ajoutant des claims pour spécifier les droits de l'utilisateur...
---

# Générer un token JWT pour Mercure avec jwt.io

- Aller sur le site [jwt.io](https://jwt.io/)

## Configuration de jwt.io

- Copier la clé secrète de Mercure `subscriber_jwt` et/ou `publisher_jwt` dans le champ `VERIFY SIGNATURE` et la clé secrète de Mercure dans le champ `VERIFY SIGNATURE` dans 'input `your-256-bit-secret`'

- Dans le champ `PAYLOAD` ajouter les claims sous forme de JSON - au minimum il faut ajouter les claims `mercure` avec les droits `publish` et `subscribe` pour que le token soit valide pour Mercure :

```json
{
  "mercure": {
    "publish": ["*"],
    "subscribe": ["*"]
  }
}
```

- Copier le token JWT généré dans la partie `Encoded` et le coller dans le body de la requête POST pour Mercure
- Utiliser ce token JWT pour les requêtes POST sur l'url de Mercure

## Exemple d'un token aec des autorisation limité à un groupe de route derrière /admin

```json
{
  "mercure": {
    "publish": ["https://mondomaine.ext/admin/*"],
    "subscribe": ["https://mondomaine.ext/admin/*"]
  }
}
```

## Sécurité 

Pour la production il faut bien sûr générer un token JWT avec des droits plus restreints pour la sécurité et aussi un CaddyFile.dev plus sécurisé nottament en générant une
`publisher_jwt`et une `subscriber_jwt` différente de la clé par défaut !ChangeThisMercureHubJWTSecretKey!. 

Je peux générer des `publisher_jwt` et `subscriber_jwt` sécurisée avec la commande suivante :

```shell
openssl rand -base64 64
```

ça donne un résultat comme celui-ci :

```shell
kQcRTUoPdd8SRc1jPlDMBNOkuS8bmEXQLUCsnIZU61xsiVNwuv9xgp0JeLmRHdmPuYuoDzl3QDtSJd1Sn+Pe8w==
```

Remplacer la clé par défaut par la clé générée dans le fichier `Caddyfile.dev` :

```shell
publisher_jwt kQcRTUoPdd8SRc1jPlDMBNOkuS8bmEXQLUCsnIZU61xsiVNwuv9xgp0JeLmRHdmPuYuoDzl3QDtSJd1Sn+Pe8w==
subscriber_jwt kQcRTUoPdd8SRc1jPlDMBNOkuS8bmEXQLUCsnIZU61xsiVNwuv9xgp0JeLmRHdmPuYuoDzl3QDtSJd1Sn+Pe8w==
```

Il fadre générer un nouveau token JWT avec jwt.io pour tester les nouvelles clés et donc mettre à jour le champ input `your-256-bit-secret` avec la nouvelle clé générée et déclarée dans le fichier `Caddyfile.dev` pour tester les nouvelles clés.

## Conclusion

C'est terminé ça me permet de tester avec Isomnia ou ThunderCLient les requêtes POST sur Mercure pour voir si tout fonctionne bien.
C'est la configuration minimale qui permet de faire tourner le système de publication/abonnement de Mercure et de travailler avec dasn des application Symfony ou autre qui ont besoin de Mercure pour publier et abonner des messages en temps réel. Ca permet de changer l'état du DOM par exemple en temps réel sans avoir à recharger la page on peut notifier l'utilisateur d'un changement de statut ou d'une nouvelle information qui vient d'arriver sur le serveur....