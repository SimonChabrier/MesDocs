---
title: Sécuriser les tentatives de connexion SSH avec Fail2Ban
description: Sécuriser le stentatives de connexion SSH avec Fail2Ban pour protéger votre serveur contre les attaques de force brute.
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

- Modifier la ligne suivante

```bash
PermitRootLogin no
```

- Redémarrer le service SSH

```bash
sudo systemctl restart ssh
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

## Renforcer la configuration de Fail2Ban
```bash
sudo nano /etc/fail2ban/jail.local
```

- Ajouter les lignes suivantes. Si le fichier n'existe pas, le créer

```bash
[sshd]
enabled = true
bantime = 1d
findtime = 10m
maxretry = 3
```

```bash
bantime = 1d ⟶ Banni pendant 1 jour (ou bantime = -1 pour bannir définitivement)
findtime = 10m ⟶ Vérifie les tentatives sur 10 minutes
maxretry = 3 ⟶ Bloque après 3 échecs
```

Toutes les 10 secondes, Fail2Ban vérifie les logs SSH pour voir si une IP a dépassé le nombre de tentatives autorisées. Si c'est le cas, l'IP est bannie pour 1 jour ou définitivement si vous j'ai mis -1.

- Redémarrer Fail2Ban

```bash
sudo systemctl restart fail2ban
```

## Eviter de se bloquer soi même

- Trouver son IP local 

```bash
ip a | grep "inet"
```

- Ajouter son IP dans le fichier de configuration de Fail2Ban

```bash
ignoreip = 192.168.0.....
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

## Bannir rapidement une IP avec fail2ban
```bash
sudo fail2ban-client set sshd banip 92.255.85.107
```

## Bannir rapidement une Ip avec IpTables
```bash
sudo iptables -A INPUT -s 92.255.85.107 -j DROP
```

## Rendre cette configuration permanente
```bash
sudo iptables-save | sudo tee /etc/iptables/rules.v4
```

Le serveur est maintenant sécurisé contre les attaques de force brute sur le SSH.
