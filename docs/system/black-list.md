# Créer une blacklist IP en fonction des logs serveurs récupéres dans un fichier

- Objectif rejeter les requêtes des clients qui génèrent des erreurs 404 et 500 trop fréquemment en les ajoutant à une blacklist. En général c'est que le client est en train de scanner le serveur pour trouver des failles de sécurité ou pour faire du scraping de données. C'est déjà un premier niveau de protection contre les attaques de type DDoS.

## Prérequis

- installer les outils suivants:

- `jq` qui sert à manipuler les fichiers JSON en ligne de commande. 

On va pouvoir lire dans le fichier json de log serveur crée par Caddy et extraire les IPs des clients qui ont généré des erreurs 404. On va ensuite les ajouter à la blacklist.
`/var/www/html/logs/requests.json` est le fichier de logs de Caddy qui contient les requêtes HTTP reçues par le serveur pour les domaines sur les quel j'ai configuré cette logique d'écriture de logs dasn le Caddyfile.

```shell
sudo apt update && sudo apt install -y jq
```

- vérifier l'installation de `jq`:

```shell
jq --version
```

## Créer le script monitor_blacklist.sh

- On lance la commande suivante pour créer le fichier de script:

```shell
sudo nano /usr/local/bin/monitor_blacklist.sh
```

- On y place ce code qui pointe vers le fichier de logs sur le quel Caddy écrit les logs de chaque domaine avec les directives configurés et le fichier de blacklist:

```bash
#!/bin/bash
LOG_DIR="/var/log/caddy"
LOG_FILES="$LOG_DIR/requests*.json"
BLACKLIST_FILE="/etc/caddy/blacklist.txt"
LOCAL_IP="192.168.0.254"
THRESHOLD=5
DELAY=180

cleanup() {
    echo "Arrêt du script monitor_blacklist.sh"
    pkill -f "sleep"
    exit 0
}
trap cleanup SIGINT SIGTERM

if ! command -v iptables &> /dev/null; then echo "iptables non installé"; exit 1; fi
if ! command -v jq &> /dev/null; then echo "jq non installé"; exit 1; fi

echo "Démarrage de la surveillance des logs..."

if ! sudo iptables -L BLOCKED &>/dev/null; then
    sudo iptables -N BLOCKED && echo "Chaîne BLOCKED créée."
fi

while true; do
    echo "-------------------------------------"
    echo "Analyse des logs à $(date)"

    TMP_FILE=$(mktemp)

    for file in $LOG_FILES; do
        if jq empty "$file" 2>/dev/null; then
            jq -r 'select(.status == 404 or .status == 500) | .request.client_ip' "$file" >> "$TMP_FILE"
        else
            echo "Fichier JSON invalide ignoré : $file"
        fi
    done

    sort "$TMP_FILE" | uniq -c | awk -v threshold=$THRESHOLD '$1 >= threshold {print $2}' > "$BLACKLIST_FILE"
    rm "$TMP_FILE"

    if [ -s "$BLACKLIST_FILE" ]; then
        echo "IPs à bloquer :"
        cat "$BLACKLIST_FILE"

        sudo iptables -F BLOCKED

        while read -r ip; do
            if [[ "$ip" != "$LOCAL_IP" ]]; then
                if ! sudo iptables -L BLOCKED -v -n | grep -q "$ip"; then
                    sudo iptables -A BLOCKED -s "$ip" -j REJECT
                fi
            fi
        done < "$BLACKLIST_FILE"

        sudo iptables -D INPUT -j BLOCKED 2>/dev/null
        sudo iptables -A INPUT -j BLOCKED
    else
        echo "Aucune IP à blacklister."
    fi

    sleep "$DELAY"
done
````

## Rendre le script exécutable

```shell
sudo chmod +x /usr/local/bin/monitor_blacklist.sh
```

## Exécuter le script en arrière plan

```shell
sudo nohup /usr/local/bin/monitor_blacklist.sh &
```

## Vérifier que le script tourne en arrière plan

```shell
ps aux | grep monitor_blacklist.sh
```

## Vérifier les Ip bloquées dans IpTables (il y a une chaîne BLOCKED qui a été créée)

```shell
sudo iptables -L BLOCKED
```

## Vérifier les Ip ajoutés dans le fichier dans la blacklist

```shell
cat /etc/caddy/blacklist.txt
```

## Vérifier si la règle est bien appliquée à toutes les connexions entrantes
- C'est ca qui va bloquer les requêtes des IPs ajoutées à la blacklist c'est crucial de vérifier que cette règle est bien appliquée. et que les requêtes des IPs ajoutées à la blacklist sont bien bloquées.

```shell
sudo iptables -L INPUT -v -n
```

- Vérifier la règle de blocage pour une ip ajoutée à la blacklist:

```shell
sudo iptables -L INPUT -v -n | grep 44.243.167.6
```

- sortie de la commande:

```shell
Chain INPUT (policy DROP 3413 packets, 179K bytes)
 pkts bytes target     prot opt in     out     source               destination         
 355M   87G ufw-before-logging-input  all  --  *      *       0.0.0.0/0            0.0.0.0/0           
 355M   87G ufw-before-input  all  --  *      *       0.0.0.0/0            0.0.0.0/0           
9390K 2024M ufw-after-input  all  --  *      *       0.0.0.0/0            0.0.0.0/0           
 3493  185K ufw-after-logging-input  all  --  *      *       0.0.0.0/0            0.0.0.0/0           
 3493  185K ufw-reject-input  all  --  *      *       0.0.0.0/0            0.0.0.0/0           
 3493  185K ufw-track-input  all  --  *      *       0.0.0.0/0            0.0.0.0/0           
    1    44 BLOCKED    all  --  *      *       0.0.0.0/0            0.0.0.0/0           
    1    44 BLOCKED    all  --  *      *       0.0.0.0/0            0.0.0.0/0           
    1    44 BLOCKED    all  --  *      *       0.0.0.0/0            0.0.0.0/0           
    1    44 BLOCKED    all  --  *      *       0.0.0.0/0            0.0.0.0/0           
    1    44 BLOCKED    all  --  *      *       0.0.0.0/0            0.0.0.0/0           
    1    44 BLOCKED    all  --  *      *       0.0.0.0/0            0.0.0.0/0           
    0     0 BLOCKED    all  --  *      *       0.0.0.0/0            0.0.0.0/0           
    0     0 BLOCKED    all  --  *      *       0.0.0.0/0            0.0.0.0/0           
    0     0 BLOCKED    all  --  *      *       0.0.0.0/0            0.0.0.0/0           
    0     0 BLOCKED    all  --  *      *       0.0.0.0/0            0.0.0.0/0           
    0     0 BLOCKED    all  --  *      *       0.0.0.0/0            0.0.0.0/0           
    0     0 BLOCKED    all  --  *      *       0.0.0.0/0            0.0.0.0/0           
    0     0 BLOCKED    all  --  *      *       0.0.0.0/0            0.0.0.0/0           
    0     0 BLOCKED    all  --  *      *       0.0.0.0/0            0.0.0.0/0           
    0     0 BLOCKED    all  --  *      *       0.0.0.0/0            0.0.0.0/0           
    0     0 BLOCKED    all  --  *      *       0.0.0.0/0            0.0.0.0/0           
    0     0 BLOCKED    all  --  *      *       0.0.0.0/0            0.0.0.0/0   
```

on voit bien que la règle `BLOCKED` est bien appliquée à toutes les connexions entrantes et que les requêtes des IPs ajoutées à la blacklist sont bien bloquées.


## Explication du script `monitor_blacklist.sh`

La commande commence par la définition de plusieurs variables essentielles :

- **`LOG_FILE`** : C'est le fichier de logs de Caddy qui enregistre toutes les requêtes HTTP reçues par le serveur. Il contient des informations sur les adresses IP, les méthodes de requêtes et les statuts de réponse.
  
- **`BLACKLIST_FILE`** : Ce fichier contient la liste des IPs déjà bloquées. Il est utilisé pour empêcher l'accès à des adresses IP malveillantes ou suspectes.

- **`TEMP_BLACKLIST`** : Un fichier temporaire qui sert à stocker les nouvelles IPs détectées comme problématiques et à ajouter dans la liste noire.

- **`LOCAL_IP`** : Il s'agit de l'IP locale (généralement celle du serveur), qui ne sera jamais ajoutée à la liste noire afin de préserver l'accès pour le débogage.

## Processus :

1. **Extraction des IPs problématiques** : 
   La commande analyse les logs de Caddy (`LOG_FILE`) pour identifier les IPs ayant généré des erreurs 404 ou 500, et ce, dans un laps de temps défini.

2. **Mise à jour de la blacklist** :
   Les IPs détectées comme problématiques sont ajoutées au fichier `BLACKLIST_FILE`, mais uniquement si elles ne sont pas déjà présentes et si ce n'est pas l'IP locale.

3. **Application des règles iptables** :
   Les nouvelles IPs sont ensuite ajoutées à une chaîne `BLOCKED` dans `iptables`, assurant leur blocage au niveau réseau. Avant cela, le script vérifie que l'IP n'est pas déjà bloquée.

4. **Protection de l'IP locale** :
   L'IP du serveur (définie par `LOCAL_IP`) est exclue de toute modification pour garantir que le débogage reste possible.

Ce processus permet de protéger le serveur en bloquant les adresses IP qui génèrent un nombre excessif d'erreurs, tout en maintenant l'accès pour le développement.

## Création d'un service systemd pour exécuter le script automatiquement

### Créer un fichier de service pour systemd :

```shell
sudo nano /etc/systemd/system/monitor_blacklist.service
```

Ajouter le contenu suivant :

```shell
[Unit]
Description=Service de surveillance de la blacklist des IP
After=network.target

[Service]
Type=simple
ExecStart=/bin/bash -c '/usr/local/bin/monitor_blacklist.sh >> /var/log/monitor_blacklist.log 2>&1'
Restart=always
RestartSec=180
User=root
WorkingDirectory=/var/www/html
StartLimitIntervalSec=on-failure
LimitNOFILE=65536
KillMode=process
SuccessExitStatus=143

[Install]
WantedBy=multi-user.target
```

Activer le service :

```shell
sudo systemctl enable monitor_blacklist.service
```
Démarrer le service :

```shell
sudo systemctl start monitor_blacklist.service
```
Vérifier le statut du service :

```shell
sudo systemctl status monitor_blacklist.service
```

Vérifier les logs sytemd pour voir si il y éventuellement des erreurs
voir le journal du service

```shell
sudo journalctl -u monitor_blacklist.service -f
```

Suivre l'activité en temps réel

```shell
sudo tail -f /var/log/monitor_blacklist.log
```

Si on modifie le script il faut recharger le service pour prendre en compte les modifications

```shell
sudo systemctl daemon-reload
sudo systemctl restart monitor_blacklist.service
sudo systemctl status monitor_blacklist.service
```

Arrêter le service

```shell
sudo systemctl stop monitor_blacklist.service
```

Confirmer que les règles iptables sont bien mises à jour

```shell
sudo iptables -L BLOCKED -v -n
```

Conclusion et comportement attendu
Le script démarre, analyse les logs, met à jour la blacklist d'IPs, et applique les règles iptables pour bloquer les IPs suspectes. Il attend 10 secondes (sleep 10). Il se termine naturellement. Après 10 secondes, systemd relance le script (RestartSec=10).

## Supprimer le service systemd

```shell
sudo systemctl stop monitor_blacklist.service
sudo systemctl disable monitor_blacklist.service
sudo rm /etc/systemd/system/monitor_blacklist.service
sudo systemctl daemon-reload
```