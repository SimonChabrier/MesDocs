---
title: Générer un token JWT pour Mercure
description: Générer un token JWT pour Mercure avec jwt.io tout en ajoutant des claims pour spécifier les droits de l'utilisateur...
comments: true
---

# Générer un token JWT pour Mercure avec jwt.io

- Aller sur le site [jwt.io](https://jwt.io/)

## Configuration de jwt.io

- Copier la clé secrète de Mercure `subscriber_jwt` et/ou `publisher_jwt` dans le champ `VERIFY SIGNATURE` et la clé secrète de Mercure dans le champ `VERIFY SIGNATURE` dans 'input `your-256-bit-secret`'

🚩 Regarder ma page de doc sur `Installer Mercure` parce que les varibales sont définis dans :

```shell
sudo nano /etc/environment
```

C'est bien ces clés là qu'il faut copier dans jwt.io pour générer un token JWT valide pour mon installation de Mercure.

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

Remplacer la clé par défaut par la clé générée dans le fichier où j'ai stocké les variables d'environnement globales :

```shell
sudo nano /etc/environment
```

```shell
MERCURE_PUBLISHER_JWT_KEY=kQcRTUoPdd8SRc1jPlDMBNOkuS8bmEXQLUCsnIZU61xsiVNwuv9xgp0JeLmRHdmPuYuoDzl3QDtSJd1Sn+Pe8w==
MERCURE_SUBSCRIBER_JWT_KEY=kQcRTUoPdd8SRc1jPlDMBNOkuS8bmEXQLUCsnIZU61xsiVNwuv9xgp0JeLmRHdmPuYuoDzl3QDtSJd1Sn+Pe8w==
```

Sauver et quitter le fichier.

Il fadra générer un nouveau token JWT avec jwt.io pour tester les nouvelles clés et donc mettre à jour le champ input `your-256-bit-secret` avec la nouvelle clé générée et déclarée dans le fichier `Caddyfile.dev` pour tester les nouvelles clés.

## Conclusion

C'st terminé il faut veiller à générer des Token JWT signés correctement avec les bonnes clés récupérées dans les variables d'environnement pour sécuriser l'accès à Mercure et si je change les clés il faudra bien sûr générer un nouveau token JWT avec les nouvelles clés pour que Mercure fonctionne correctement.