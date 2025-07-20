---
title: Sécuriser les tentatives de connexion SSH avec Fail2Ban
description: Sécuriser les tentatives de connexion SSH avec Fail2Ban pour protéger votre serveur contre les attaques de force brute.
---

# Sécuriser les tentatives de connexion SSH avec Fail2Ban

## Vérifier les tentatives de connexion SSH
```bash
sudo journalctl -u ssh --no-pager | grep "Failed password"
```

## Bloquer les IP malveillantes
```bash
sudo ufw deny from [IP]
```
ou avec iptables
```bash
sudo iptables -A INPUT -s [IP] -j DROP
```


## Installer Fail2Ban
```bash
sudo apt update && sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

## Vérifier le statut de Fail2Ban
```bash
sudo systemctl status fail2ban
```

## Désactiver si je souhaite la connexion root en SSH
```bash
sudo nano /etc/ssh/sshd_config
```

- Modifier la ligne suivante (attention gros risque de sécurité de la connexion root en SSH) :

```bash
PermitRootLogin no -> PermitRootLogin yes
PasswordAuthentication no -> PasswordAuthentication yes
```

- Redémarrer le service SSH

```bash
sudo systemctl restart ssh
```

## le plus sécurisé reste l'usage d'une clé SSH
```bash
PubkeyAuthentication yes
```

## Eventuellement changer le port SSH
```bash
sudo nano /etc/ssh/sshd_config
```

- Remplacer le port 22 par un autre port  

```bash
Port 22XX
```

- Ouvrir le port dans le pare-feu

```bash
sudo ufw allow 22XX/tcp
```

- Redémarrer le service SSH

```bash
sudo systemctl restart ssh
```

## Voir le liste des IP bloquées
```bash
sudo fail2ban-client status sshd
```

## Débloquer une IP
```bash
sudo fail2ban-client set sshd unbanip [IP]
```

## Voir les logs de Fail2Ban
```bash
sudo journalctl -u fail2ban
```

## Voir le nombre de tenatives de connexions ssh
```bash
grep "authentication failure" /var/log/auth.log | wc -l
```

## Voir le poids du fichier de log
```bash
ls -lh /var/log/auth.log
```

## Créer des jails personnalisés pour surcharger la configuration de Fail2Ban
```bash
sudo nano /etc/fail2ban/jail.local
```

- Ajouter les lignes suivantes. Si le fichier n'existe pas, le créer

```bash
[sshd]
enabled = true 
bantime = -1 
findtime = 10m 
maxretry = 3
```

Cette configuration dit que 3 tentatives ratées en 10 minutes déclenchent un ban.

Fail2Ban vérifie en continu (toutes les secondes par défaut de toutes les jails crées et activés) les logs SSH pour voir si une IP a dépassé le nombre de tentatives autorisées. Si c’est le cas, l’IP est bannie pour 1 jour ou définitivement si -1.

La jail [sshd] est souvent déjà présente dans `/etc/fail2ban/jail.conf` (fichier global) mais il vaut mieux surcharger via jail.local pour préserver la conf par défaut et ajouter ses propres règles.

- Redémarrer Fail2Ban

```bash
sudo systemctl restart fail2ban
```


## Modifier la configuration de fail2ban
```bash
sudo nano /etc/fail2ban/jail.local
```

```bash
[sshd]
enabled = true
bantime = 1d
findtime = 10m
maxretry = 3
ignoreip = ajouter ici les IP à ignorer séparées par un espace
```

```bash
sudo systemctl restart fail2ban
sudo fail2ban-client status sshd
```

## Eviter de se bloquer soi même

- Trouver son IP local 

```bash
ip a | grep "inet"
```

- Ajouter son IP dans le fichier de configuration de Fail2Ban (`/etc/fail2ban/jail.local`)

```bash
[DEFAULT]
ignoreip = 192.168.0.254 # Ajouter la liste d'IP à ignorer, séparées par un espace
```

## Bannir rapidement une IP avec fail2ban
```bash
sudo fail2ban-client set sshd banip 92.255.85.107
```

## Bannir rapidement une Ip avec IpTables
```bash
sudo iptables -A INPUT -s 92.255.85.107 -j DROP
```

Ajoute une règle à la fin de la chaîne INPUT pour bloquer toute connexion entrante provenant de l’IP 92.255.85.107.

## Rendre cette configuration permanente

IL fau que le paquet `iptables-persistent` soit installé pour rendre les règles iptables persistantes après un redémarrage.

```bash
sudo apt install iptables-persistent
```

Par défaut, toute règle ajoutée avec iptables est volatile :
Elle disparaît au reboot donc on doit la sauvegarder dans un fichier de règles.

```bash
sudo iptables-save | sudo tee /etc/iptables/rules.v4
```

A refaire après chaque modification des règles iptables. 

## Comportement de jail.local vs jail.conf

- Ce qui est défini dans `jail.local` prend le dessus sur la même section (jail) dans `jail.conf`.
- Si une jail existe seulement dans `jail.local`, elle s’ajoute à la configuration globale.
- Les options `[DEFAULT]` définies dans `jail.local` surchargent celles de `[DEFAULT]` dans `jail.conf`.
- Les paramètres non spécifiés dans `jail.local` héritent de la configuration de `jail.conf`.

Exemple :
Si `[sshd]` est présent dans les deux fichiers, c’est la configuration de `/etc/fail2ban/jail.local` qui s’applique.  
Tout paramètre absent dans `jail.local` utilisera la valeur de `jail.conf`.


## Conclusion

Fail2Ban est un outil puissant pour protéger votre serveur contre les attaques de force brute, notamment
les tentatives de connexion SSH. En configurant correctement les jails et en surveillant les logs, vous pouvez réduire considérablement le risque d'intrusion.

Fail2Ban gère le ban en live,
iptables-persistent gère la sauvegarde/restauration automatique au reboot.

Le serveur est maintenant sécurisé contre les attaques de force brute sur le SSH.
---

