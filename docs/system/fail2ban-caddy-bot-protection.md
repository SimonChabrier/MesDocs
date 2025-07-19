
---
title: Protection avancée contre les scans et attaques automatisés avec Caddy et Fail2Ban
description: Protégez efficacement vos serveurs Caddy contre les scans de bots et les requêtes malveillantes, bien au-delà des seules attaques WordPress.
---

# Protection élargie contre les scans automatisés et attaques par bots (Caddy + Fail2Ban)

## Objectif

Mettre en place une **défense proactive** contre tous les scans et attaques automatisés sur des serveurs **ne faisant pas tourner WordPress**, mais aussi **toute tentative d'accès à des fichiers ou chemins sensibles** (fichiers de config, dumps, répertoires cachés, etc.).

L’idée est de :
- **Empêcher** l’accès à des chemins ou fichiers sensibles utilisés par WordPress, mais **aussi par d'autres outils courants** (PHP, Python, Node, etc.),
- **Bloquer** proprement et instantanément toute requête suspecte dès Caddy,
- **Bannir automatiquement et définitivement** les IPs qui insistent via Fail2Ban et iptables,
- **Réduire la pollution des logs** et l’utilisation inutile de ressources serveur.

Cette protection est adaptée à tous types de serveurs web publics, pas seulement à ceux exposés aux attaques WordPress.

---

## 1. Blocage immédiat avec Caddy

### Mise en place

Ajoutez une **règle de protection réutilisable** en haut de votre `Caddyfile` :

```txt
# caddyfile (bloc global, tout en haut)
(bot-protection) {
    @_bots {
        path_regexp sensitive_paths ^/(wp-admin|wp-content|wp-includes|wp-.*\.php|xmlrpc\.php|\.env(\..*)?$|phpinfo.*|\.git.*|\.aws.*|\.htaccess|\.DS_Store|\.vscode|\.idea|\.editorconfig|composer\.(json|lock)|package(-lock)?\.json|yarn\.lock|docker-compose\.ya?ml|application\.properties|settings\.py|config\.env|.*\.(bak|sql|ini|log|conf|yml|xml|old))$
    }
    respond @_bots "Access denied" 403
}
```

Importez ensuite cette protection dans chaque bloc domaine concerné :

```txt
example.com {
    import bot-protection
    reverse_proxy localhost:3000
}
```

### Explications

- **Intercepté immédiatement** : Les requêtes sur des chemins sensibles sont bloquées dès Caddy, sans jamais atteindre PHP ou le backend applicatif.
- **Flexibilité** : Le filtre couvre aussi bien WordPress que des chemins/fichiers utilisés par d'autres stacks (Node, Python, configs, dumps, etc.).
- **Log possible** : Si la directive `log` est présente dans le bloc domaine, la requête est logguée pour analyse ultérieure.
- **Réponse 403** : Un code 403 est retourné, sans révéler d’information technique.

---

## 2. Bannissement automatique avec Fail2Ban

### Objectif complémentaire

Renforcer la sécurité avec **Fail2Ban**, qui lit les logs de Caddy pour **détecter et bannir** au niveau réseau toute IP multipliant les requêtes sur les chemins ou fichiers interdits.

### Étapes de configuration

#### 1. Créez le filtre Fail2Ban

```bash
sudo nano /etc/fail2ban/filter.d/caddy-sensitive-bots.conf
```

Contenu du fichier :

```ini
[Definition]
failregex = ^<HOST> .*"(GET|POST) /((wp-(admin|includes|content|.*\.php)|xmlrpc\.php|\.env(\..*)?$|phpinfo.*|\.git.*|\.aws.*|\.htaccess|\.DS_Store|\.vscode|\.idea|\.editorconfig|composer\.(json|lock)|package(-lock)?\.json|yarn\.lock|docker-compose\.ya?ml|application\.properties|settings\.py|config\.env|.*\.(bak|sql|ini|log|conf|yml|xml|old))) HTTP
ignoreregex =
```

#### 2. Ajoutez une jail Fail2Ban

```bash
sudo nano /etc/fail2ban/jail.local
```

Ajoutez :

```ini
[caddy-sensitive-bots]
enabled = true
filter = caddy-sensitive-bots
logpath = /var/log/caddy/requests.json
backend = auto
maxretry = 5
findtime = 60
bantime = -1
action = iptables[name=sensitive-bots, port=http, protocol=tcp]
```

#### 3. Redémarrez Fail2Ban

```bash
sudo systemctl restart fail2ban
```

#### 4. Vérifiez la jail

```bash
sudo fail2ban-client status
```

Vous devriez voir dans la liste des jails :  
`sshd, caddy-sensitive-bots`

---

## 3. Logging Caddy (prérequis Fail2Ban)

Fail2Ban s’appuie sur les logs générés par Caddy. Ajoutez ce bloc `log` dans chaque domaine à protéger :

```text
example.com {
    import bot-protection

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

---

## 4. Schéma de fonctionnement

| Étape | Événement                                 | Qui agit ? | Résultat                                    |
|-------|-------------------------------------------|------------|---------------------------------------------|
| 1     | Bot cible un chemin ou fichier sensible   | Caddy      | Retour 403 immédiat, requête logguée        |
| 2     | Ligne log écrite                          | Caddy      | Dans `/var/log/caddy/requests.json`         |
| 3     | 5 accès détectés sur ces chemins          | Fail2Ban   | Bannissement permanent via iptables         |
| 4     | Nouvelle tentative de cette IP            | iptables   | Connexion bloquée avant même d’atteindre Caddy |

---

## 5. Lister les IPs bannies

Pour voir les IPs bannies par cette jail :

```bash
sudo fail2ban-client status caddy-sensitive-bots
```

---

## Conclusion

- **Protection immédiate** : Caddy bloque instantanément toute tentative d’accès à des chemins ou fichiers sensibles, quel que soit le type de scan (WordPress, config, dump, etc.).
- **Blocage réseau** : Fail2Ban bannit définitivement toute IP persistant dans ses tentatives.
- **Approche maintenable et universelle** : Solution légère, sans dépendance à une techno spécifique (WordPress, Symfony, Node…), efficace contre tous les bots automatisés.

Mise en place le : **2025-07-19**

---
