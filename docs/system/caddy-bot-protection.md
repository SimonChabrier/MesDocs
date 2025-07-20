---
title: Explications des blocs (bot-protection) et (log-filter) dans Caddyfile
description: Explication synthétique de l'utilité, du fonctionnement et de l'intérêt des blocs Caddy (bot-protection) et (log-filter), avec exemple d'utilisation.
---

# Sécurisation avancée Caddy : blocage des scans & logs propres

## 1. Bloc `(bot-protection)`

```shell
(bot-protection) {
	@_bots {
		path_regexp wp_paths ^/(wp-admin|wp-content|wp-includes|wp-.*\.php|xmlrpc\.php|\.env(\..*)?$|phpinfo.*|\.git.*|\.aws.*|\.htaccess|\.DS_Store|\.vscode|\.idea|\.editorconfig|composer\.(json|lock)|package(-lock)?\.json|yarn\.lock|docker-compose\.ya?ml|application\.properties|settings\.py|config\.env|.*\.(bak|sql|ini|log|conf|yml|xml|old))$
	}
	respond @_bots "Access denied" 403
}
```

**Rôle :**  
- Bloquer immédiatement toutes les requêtes HTTP visant des chemins ou fichiers sensibles (WordPress, dumps, configs, fichiers cachés, etc).
- Répondre par un **HTTP 403** ("Access denied") avant que la requête atteigne le backend ou PHP.

**Utilité :**  
- Stoppe les scans automatisés et tentatives d’exploitation courantes.
- Allège la charge backend et protège toute stack (WordPress, Node, Symfony, Python…).

---

## 2. Bloc `(log-filter)`

```shell
(log-filter) {
	@localIPs remote_ip 192.168.0.254 127.0.0.1 ::1
	log_skip @localIPs
	log {
		output file /var/log/caddy/requests.json {
			roll_size 1mb
			roll_keep 20
			roll_keep_for 48h
		}
		format json
	}
}
```

**Rôle :**  
- **Ignorer** toutes les requêtes des IPs locales pour ne pas polluer les logs.
- **Logger** tout le reste au format JSON dans `/var/log/caddy/requests.json` (rotation automatique).

**Utilité :**  
- Permet un audit ou une détection de bots claire, sans bruit lié à l’administration ou au monitoring local.
- Le log JSON est facilement exploitable par script, outil ou SIEM.

---

## 3. Exemple d’utilisation sur un domaine

```shell
mailhog.simschab.cloud {
	import log-filter
	import bot-protection
	basic_auth {
		simon $2a$14$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
	}
	reverse_proxy localhost:8025
}
```

**Effet combiné :**  
- **Toute requête suspecte est bloquée avant même d’atteindre Mailhog.**
- **Toutes les requêtes hors IP locales sont tracées dans un log JSON dédié** (pour supervision ou analyse).
- **L’accès à l’interface Mailhog est protégé par mot de passe**.

---

## Poursuivre vers le script qui traite le fichier de log : [Surveillance automatique des IPs malveillantes via les logs Caddy](https://doc.simschab.cloud/docs/system/black-list.html).

## Résumé

- **Sécurité immédiate** : stoppe les scans & bots avant le backend.
- **Logs propres et exploitables** : tout le trafic non-local est tracé pour l’audit ou le monitoring.
- **Blocs factorisables** : ces règles peuvent être importées dans tous tes vhosts/services Caddy.

