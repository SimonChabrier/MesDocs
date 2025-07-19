---
title: Surveillance automatique des IPs malveillantes via les logs Caddy
description: Script Bash avec iptables pour bloquer automatiquement les IPs générant trop d'erreurs HTTP (404/500) via les logs JSON de Caddy.
date: 2025-07-19
updated: 2025-07-19
author: Simon Chabrier
tags: [caddy, sécurité, iptables, firewall, logs, bash, monitoring, ubuntu]
license: MIT
version: 1.0
language: fr
status: validé
---

# Créer une blacklist IP en fonction des logs serveurs récupérés dans un fichier

Objectif : rejeter les requêtes des clients qui génèrent des erreurs 404 et 500 trop fréquemment en les ajoutant à une blacklist. En général, cela signifie que le client scanne le serveur à la recherche de failles de sécurité ou fait du scraping de données. C’est un premier niveau de protection contre les attaques type DDoS ou reconnaissance.

## Prérequis

Installer les outils suivants :

```bash
sudo apt update && sudo apt install -y jq iptables
```

Vérifier l’installation :

```bash
jq --version
iptables --version
```

## Fichier de logs attendu

Caddy doit être configuré pour écrire des logs JSON dans :

```
/var/log/caddy/requests.json
```

Ce fichier doit contenir des champs `.ts` (timestamp) et `.request.client_ip`.

## Créer le script `monitor_blacklist.sh`

```bash
sudo nano /usr/local/bin/monitor_blacklist.sh
```

Contenu du script :

```bash
#!/bin/bash

LOG_DIR="/var/log/caddy"
LOG_FILES="$LOG_DIR/requests*.json"
BLACKLIST_FILE="/etc/caddy/blacklist.txt"
LOCAL_IP="192.168.0.254"
THRESHOLD=5
DELAY=180

# Nettoyage propre à l'arrêt
cleanup() {
    echo "Arrêt du script monitor_blacklist.sh"
    pkill -f "sleep"
    exit 0
}
trap cleanup SIGINT SIGTERM

# Vérification des outils nécessaires
for cmd in iptables jq; do
    if ! command -v $cmd &>/dev/null; then
        echo "Erreur : $cmd non installé"
        exit 1
    fi
done

echo "Démarrage de la surveillance des logs..."

# Création de la chaîne BLOCKED si elle n'existe pas
if ! sudo iptables -L BLOCKED &>/dev/null; then
    sudo iptables -N BLOCKED && echo "Chaîne BLOCKED créée."
fi

# Boucle continue
while true; do
    echo "-------------------------------------"
    echo "Analyse des logs à $(date)"

    TMP_FILE=$(mktemp)

    # Extraction des timestamps et IP depuis les fichiers JSON
    for file in $LOG_FILES; do
        if [ -r "$file" ] && jq empty "$file" 2>/dev/null; then
            jq -r '. | [.ts, .request.client_ip] | @tsv' "$file" >> "$TMP_FILE"
        else
            echo "Fichier ignoré (illisible ou invalide JSON) : $file"
        fi
    done

    # Réinitialiser la blacklist
    > "$BLACKLIST_FILE"

    # Détecter les IPs avec plus de $THRESHOLD requêtes dans la même seconde
    awk -F'\t' '{ ipcount[int($1)" "$2]++ } END {
        for (key in ipcount) {
            split(key, parts, " ")
            if (ipcount[key] >= '"$THRESHOLD"') {
                print parts[2]
            }
        }
    }' "$TMP_FILE" | grep -v "^$LOCAL_IP$" | sort -u >> "$BLACKLIST_FILE"

    rm "$TMP_FILE"

    if [ -s "$BLACKLIST_FILE" ]; then
        echo "IPs à bloquer :"
        cat "$BLACKLIST_FILE"

        # Vider la chaîne BLOCKED
        sudo iptables -F BLOCKED

        # Ajouter chaque IP à BLOCKED
        while read -r ip; do
            sudo iptables -A BLOCKED -s "$ip" -j REJECT
        done < "$BLACKLIST_FILE"

        # S'assurer que la chaîne est bien liée à INPUT
        if ! sudo iptables -L INPUT -n | grep -q 'BLOCKED'; then
            sudo iptables -A INPUT -j BLOCKED
        fi
    else
        echo "Aucune IP à blacklister."
    fi

    sleep "$DELAY"
done
```

## Rendre le script exécutable

```bash
sudo chmod +x /usr/local/bin/monitor_blacklist.sh
```

## Lancer le script manuellement (test)

```bash
sudo nohup /usr/local/bin/monitor_blacklist.sh &
```

## Vérification

Vérifier que le script tourne :

```bash
ps aux | grep monitor_blacklist.sh
```

Lister les IP bloquées :

```bash
sudo iptables -L BLOCKED -v -n
```

Vérifier si une IP spécifique est bloquée :

```bash
sudo iptables -L BLOCKED -v -n | grep 185.177.72.104
```

Lister les appels de la règle `BLOCKED` dans INPUT :

```bash
sudo iptables -L INPUT -v -n
```

## Créer un service systemd

```bash
sudo nano /etc/systemd/system/monitor_blacklist.service
```

Contenu :

```ini
[Unit]
Description=Surveillance automatique des logs HTTP et blacklisting IP
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/monitor_blacklist.sh
Restart=always
RestartSec=10
User=root
WorkingDirectory=/var/www/html
StandardOutput=append:/var/log/monitor_blacklist.log
StandardError=append:/var/log/monitor_blacklist.log

[Install]
WantedBy=multi-user.target
```

Activer et démarrer le service :

```bash
sudo systemctl daemon-reload
sudo systemctl enable monitor_blacklist.service
sudo systemctl start monitor_blacklist.service
```

Vérifier son statut :

```bash
sudo systemctl status monitor_blacklist.service
```

Vérifier les logs :

```bash
sudo tail -f /var/log/monitor_blacklist.log
```

## Supprimer proprement le service

```bash
sudo systemctl stop monitor_blacklist.service
sudo systemctl disable monitor_blacklist.service
sudo rm /etc/systemd/system/monitor_blacklist.service
sudo systemctl daemon-reload
```

---

Ce script offre une solution autonome et robuste pour réagir automatiquement aux comportements suspects détectés dans les logs HTTP générés par Caddy.