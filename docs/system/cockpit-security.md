---
title: Sécurisation de Cockpit avec Fail2Ban et comptes dédiés
description: Restreindre et sécuriser l’accès à l’interface web Cockpit via Fail2Ban, PAM et un compte système dédié.
comments: true
---

# Sécurisation de Cockpit (interface web serveur)

## Objectif

Renforcer la sécurité de l’interface **Cockpit** (port `9090`) en :

- Restreignant les connexions à un **compte dédié** uniquement.
- Ajoutant une protection contre les **tentatives de connexion échouées** via **Fail2Ban**.
- Empêchant les utilisateurs non autorisés d’accéder à l’interface.

---

## 1. Créer un utilisateur dédié à Cockpit

Créer un utilisateur avec un nom aléatoire :

```bash
sudo adduser monutilisateurdedie
```

Lui donner les droits sudo si nécessaire :

```bash
sudo usermod -aG sudo monutilisateurdedie
```

---

## 2. Restreindre l’accès Cockpit à ce seul utilisateur

Créer un groupe dédié :

```bash
sudo groupadd cockpit-admins
sudo usermod -aG cockpit-admins monutilisateurdedie
```

Modifier le fichier PAM de Cockpit :

```bash
sudo nano /etc/pam.d/cockpit
```

Ajouter **en haut** du fichier :

```bash
# Autoriser uniquement les utilisateurs du groupe cockpit-admins
auth required pam_succeed_if.so user ingroup cockpit-admins
```

---

## 3. Bloquer les autres utilisateurs explicitement

Créer un fichier d’exclusion :

```bash
sudo nano /etc/cockpit/disallowed-users
```

Ajouter :

```
root
autresusersinterdits
```

> Ce fichier est pris en compte automatiquement par Cockpit si la directive `pam_listfile` est active dans `/etc/pam.d/cockpit`.

---

## 4. Ajouter une règle Fail2Ban pour Cockpit

Créer le filtre :

```bash
sudo nano /etc/fail2ban/filter.d/cockpit.conf
```

Contenu :

```ini
[Definition]
failregex = .*sssd\[.*\]: pam_unix(cockpit:auth): authentication failure;.*rhost=<HOST>
            .*cockpit-ws.*Failed login.*remote address <HOST>.*
ignoreregex =
```

Puis dans `jail.local` : 

```shell
sudo nano /etc/fail2ban/jail.local
```

Ajouter la règle :

```ini
[cockpit]
enabled = true
filter = cockpit
backend = systemd
journalmatch = _SYSTEMD_UNIT=cockpit.service
maxretry = 2
findtime = 60 
bantime = -1
action = iptables[name=cockpit, port=9090, protocol=tcp]
```

Redémarrer Fail2Ban :

```bash
sudo systemctl restart fail2ban
```

---

## 5. Vérifier l’état

Voir les jails actives :

```bash
sudo fail2ban-client status
```

Voir les tentatives sur Cockpit :

```bash
sudo fail2ban-client status cockpit
```

---

## 6. Tester la sécurité

- Se connecter uniquement avec le compte `monutilisateurdedie`.
- Toute tentative avec un autre utilisateur → rejetée par PAM.
- Plusieurs tentatives échouées → IP bannie via iptables (Fail2Ban).

---

## Conclusion

Cette configuration renforce **considérablement la sécurité de Cockpit**, en limitant l’accès à un **seul compte autorisé**, tout en assurant une **protection réseau** via bannissement des IP après tentatives infructueuses.
