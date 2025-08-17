---
title: Plus c’est user-friendly, moins c’est developer-easy
description: Une interface simple cache souvent une grande complexité technique. Éclairage sur les arbitrages entre UX et dette technique - Simon Chabrier.
comments: true
---

# Plus c’est user-friendly, moins c’est developer-easy

> Dans l’univers du développement web, certaines phrases résument à elles seules des dizaines d’heures d’expérience terrain.  
> Celle-ci en fait partie :  
> **« Plus c’est user-friendly, moins c’est developer-easy. »**

## Complexité invisible

Derrière cette formule simple se cache un mécanisme courant : plus une interface est fluide, intuitive et agréable pour l’utilisateur final, plus sa construction demande un **effort technique invisible** mais bien réel.

## Deux rôles, deux temporalités

Un produit numérique repose sur la **collaboration entre plusieurs rôles** :

- **Le Product Owner**, garant de la valeur métier, vise efficacité, image de marque et satisfaction client.
- **Le développeur**, lui, doit transformer ces objectifs en **solutions fonctionnelles, stables et pérennes**.

Ces rôles sont complémentaires, mais leurs temporalités divergent. Là où le PO cherche une réponse rapide, le développeur **doit parfois ralentir** pour garantir la solidité technique.

## Le coût de la projection

Un point de friction apparaît dès le début : entre le moment où un besoin est formulé (souvent sommairement) et celui où l'on attend du développeur une estimation claire.

Or, répondre à cette demande implique :

- imaginer une structure logicielle,
- anticiper les dépendances,
- modéliser des contraintes,
- estimer des charges variables.

C’est une **projection complexe**, rarement reconnue à sa juste valeur.

## Cas concret : EasyAdmin vs sur-mesure

Prenons un exemple :

> Le PO veut un back-office sur mesure pour valoriser l’identité artisanale du produit.  
> Le développeur, bien qu’attiré par le sur-mesure, propose **EasyAdmin**.

Pourquoi ?  
Parce que c’est un **choix raisonné**, pensé pour :

- préserver les délais,
- faciliter la maintenabilité,
- réduire la dette technique.

Ce n’est pas un renoncement, mais un **arbitrage volontaire**.

## L’impact sur l’estimation

Utiliser une solution existante permet :

- de s’appuyer sur un cadre éprouvé,
- d’estimer précisément,
- de sécuriser les livrables.

En revanche, chaque brique de sur-mesure introduit :

- des zones d’incertitude,
- des risques de revirement,
- des coûts implicites supplémentaires.

Le sur-mesure n’est pas à proscrire, mais il doit être **pleinement assumé**.

## L’effet tunnel sur l’expertise

Un développeur ne progresse pas qu’en codant. Il doit aussi :

- faire de la veille,
- se former,
- tester de nouvelles pratiques.

Chaque jour passé sur un **projet lourd et long** peut nuire à cette montée en compétence. Résultat : un **décalage progressif** avec l’état de l’art.

Ce n’est pas une faute. C’est une **conséquence structurelle**.

## Vision projet : court-terme vs long-terme

### Cas 1 : projet court (3 mois, client unique)

- Le code sur mesure a peu de valeur réutilisable.
- Mieux vaut une solution rapide, stable, rentable.

### Cas 2 : outil interne pérenne

- Le sur-mesure devient rentable à long terme.
- Chaque détail pensé sur mesure est un investissement.

## Agilité et évolutivité

Le sur-mesure est **plus rigide** face aux demandes de dernière minute.

> Un projet évolue toujours. Le client revient, modifie, ajuste.

Plus le système est rigide, plus l’adaptation devient complexe.

**EasyAdmin** (ou autre solution éprouvée) :

- limite la dette de design et d’intégration front,
- simplifie les cycles de validation,
- réduit la pression sur tous les rôles (Dev, Design, PO).

## Deux visions légitimes

Ni le PO ni le Dev n’ont tort. Ils analysent :

- l’un : **la valeur perçue**,
- l’autre : **la robustesse structurelle**.

Le dialogue permet d’**arbitrer intelligemment**, en tenant compte des contraintes, délais, coûts et enjeux de scalabilité.

## Conclusion

Une interface simple est rarement le fruit d’un effort simple.

Derrière la fluidité perçue, il y a souvent un développeur ou une équipe qui a :

- anticipé l’imprévisible,
- structuré l’architecture,
- fait des choix complexes pour préserver l’avenir.

Ce n’est pas un **conflit de vision**, c’est une **dynamique saine** entre des métiers différents, mais **interdépendants**.

Et plus on la comprend, plus on peut la vivre sereinement.


