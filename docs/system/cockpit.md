---
title: Configurer Cokpit pour accèder à internet.
description: Comment configurer Cockpit pour accèder à internet sans avoir de problème de connexion et pouvoir mettre à jour le système directement depuis l'interface web.
comments: true
---


Problème avec Cockpit, l'interface web d'administration de serveur, qui ne peut pas accéder à Internet pour mettre à jour le système.
Comment configurer Cockpit pour accéder à Internet et mettre à jour le système depuis l'interface web ?

## Solution

- Ajouter une conneion permanante dans NetworkManager

```shell
sudo nmcli con add type dummy con-name fake ifname fake0 ip4 1.2.3.4/24 gw4 1.2.3.1
```

- Vérifier que cette connexion est enregistrée et persistante

```shell
sudo nmcli con show
```

Doit lister toutes les connexions configurées. Si je vois la connexion factice (fake), je peux redémarrer NetworkManager et voir si la configuration persiste :

```shell
sudo systemctl restart NetworkManager
```

- Retester d'ouvrir l'ongler "Mise à jour logicielles" de cokpit normalment il se connecte.

- redémarrer le serveur

```shell
sudo reboot
```

Terminé problème réglé et connexion persistante.


