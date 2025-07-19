---
title: Protéger un serveur Caddy contre les scans WordPress
description: Bloquer les bots qui scannent des URLs WordPress via Caddy et Fail2Ban avec iptables.
---

# Protection des serveurs non WordPress contre les scans automatisés

## Objectif

Empêcher les bots de scanner inutilement des chemins typiques de WordPress (`/wp-admin`, `/xmlrpc.php`, `/wp-login.php`, etc.) sur des serveurs qui **n’utilisent pas WordPress**.
On empêche aussi les requêtes malveillantes sur des fichiers sensibles comme `.env`, `.git`, etc.

Cette double protection permet :
- d’économiser des ressources serveur,
- de nettoyer les logs des requêtes parasites,
- de refuser proprement et rapidement les scans automatisés,
- de **bannir définitivement** les IPs hostiles si elles insistent.

---

# 1. Blocage immédiat avec Caddy

## Mise en place

On crée d’abord une règle réutilisable dans le bloc global du `Caddyfile` :

```txt
# caddyfile (bloc global, tout en haut)
(bot-protection) {
	@_bots {
		path_regexp wp_paths ^/(wp-admin|wp-content|wp-includes|wp-.*\.php|xmlrpc\.php|\.env(\..*)?$|phpinfo.*|\.git.*|\.aws.*|\.htaccess|\.DS_Store|\.vscode|\.idea|\.editorconfig|composer\.(json|lock)|package(-lock)?\.json|yarn\.lock|docker-compose\.ya?ml|application\.properties|settings\.py|config\.env|.*\.(bak|sql|ini|log|conf|yml|xml|old))$
	}
	respond @_bots "Access denied" 403
}
```

Puis on l’importe dans chaque domaine concerné :

```txt
example.com {
    import bot-protection
    reverse_proxy localhost:3000
}
```

## Fonctionnement

- La requête est interceptée **immédiatement** par Caddy.
- Elle ne touche pas l’application (ni PHP, ni backend).
- Elle peut être logguée si `log` est défini dans le bloc domaine.
- Elle est refusée avec un code **403**.

> Cette règle seule permet déjà de bloquer efficacement les scans WordPress sur les serveurs non WordPress.

---

# 2. Bannissement permanent avec Fail2Ban

## Objectif complémentaire

En complément, on utilise **Fail2Ban** pour analyser les logs et **bannir au niveau réseau** (via `iptables`) les IPs qui font trop de requêtes ciblées.

## Étapes de configuration

### 1. Créer le filtre Fail2ban

```bash
sudo nano /etc/fail2ban/filter.d/caddy-wp-bots.conf
```

Contenu du fichier :

```ini
[Definition]
failregex = ^<HOST> .*"(GET|POST) /(wp-(admin|includes|content|.*\.php)|xmlrpc\.php)
ignoreregex =
```

### 2. Ajouter une jail dans Fail2ban

```bash
sudo nano /etc/fail2ban/jail.local
```

Extrait de configuration :

```ini
[caddy-wp-bots]
enabled = true
filter = caddy-wp-bots
logpath = /var/log/caddy/requests.json
backend = auto
maxretry = 5
findtime = 60
bantime = -1
action = iptables[name=wp-bots, port=http, protocol=tcp]
```

### 3. Redémarrer Fail2ban

```bash
sudo systemctl restart fail2ban
```

### 4. Vérifier que la jail est active

```bash
sudo fail2ban-client status
```

Doit afficher :
```
Jail list:   sshd, caddy-wp-bots
```

---

# Limites et complémentarité

Fail2Ban repose sur les logs écrits par Caddy dans `/var/log/caddy/requests.json`. Cette directive de logging doit être définie dans chaque bloc de domaine concerné, comme ici :

```text
example.com {
    import wp-bot-protection

    log {
        output file /var/log/caddy/requests.json {
            roll_size 1mb
            roll_keep 20
            roll_keep_for 24h
        }
    }

    reverse_proxy localhost:3000
}
```

### Pourquoi combiner les deux ?

| Étape | Événement                         | Qui agit ?  | Résultat                                       |
|-------|-----------------------------------|-------------|------------------------------------------------|
| 1     | Bot attaque `/wp-login.php`       | Caddy       | Retourne 403 immédiatement, et logue la requête |
| 2     | Ligne de log écrite               | Caddy       | Fichier `/var/log/caddy/requests.json`         |
| 3     | IP détectée 5 fois                | Fail2Ban    | Déclenche un bannissement `iptables` permanent |
| 4     | Nouvelle tentative de la même IP  | iptables    | Connexion bloquée avant même d’atteindre Caddy |

---

## Pour lister les IPs bannies par cette jail:

```bash
sudo fail2ban-client status caddy-wp-bots
```

## Conclusion

- **Caddy bloque instantanément** les requêtes WordPress connues pour soulager l'application.
- **Fail2Ban bannit les IPs persistantes** au niveau réseau si les attaques continuent.
- Cette approche hybride est simple, maintenable, et efficace sur les serveurs **sans WordPress**.

Mis en place le : **2025-07-19**
