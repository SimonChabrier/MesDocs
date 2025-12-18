---
title: Guide Complet des Commandes Linux
description: Une référence complète des commandes Linux couramment utilisées pour la gestion du système, la manipulation des fichiers, le réseau, et plus encore.
comments: true
---
# Guide Complet des Commandes Linux

## 📋 Table des Matières

- [Navigation et Gestion des Répertoires](#navigation-et-gestion-des-répertoires)
- [Gestion des Fichiers](#gestion-des-fichiers)
- [Recherche](#recherche)
- [Compression et Archives](#compression-et-archives)
- [Transfert de Fichiers](#transfert-de-fichiers)
- [Permissions](#permissions)
- [Processus](#processus)
- [Gestion du Système](#gestion-du-système)
- [Informations Matérielles](#informations-matérielles)
- [Utilisation du Disque](#utilisation-du-disque)
- [Réseau](#réseau)
- [SSH et Connexions à Distance](#ssh-et-connexions-à-distance)
- [Utilisateurs et Groupes](#utilisateurs-et-groupes)
- [Gestion des Paquets](#gestion-des-paquets)
- [Variables et Environnement](#variables-et-environnement)
- [Commandes Shell](#commandes-shell)
- [Raccourcis Clavier](#raccourcis-clavier)

---

## Navigation et Gestion des Répertoires

| Commande | Description | Exemple |
|----------|-------------|---------|
| `pwd` | Affiche le répertoire courant | `pwd` |
| `ls` | Liste les fichiers et répertoires | `ls` |
| `ls -a` | Liste tous les fichiers (y compris cachés) | `ls -a` |
| `ls -l` | Liste détaillée avec permissions et tailles | `ls -l` |
| `ls -lh` | Liste détaillée avec tailles lisibles | `ls -lh` |
| `ls -R` | Liste récursive de tous les sous-répertoires | `ls -R /home` |
| `ls -lt` | Liste triée par date de modification | `ls -lt` |
| `cd` | Change vers le répertoire HOME | `cd` |
| `cd ~` | Change vers le répertoire HOME | `cd ~` |
| `cd ..` | Remonte d'un niveau | `cd ..` |
| `cd -` | Retourne au répertoire précédent | `cd -` |
| `cd [chemin]` | Change vers le répertoire spécifié | `cd /home/user/documents` |
| `dirs` | Affiche la pile des répertoires | `dirs` |
| `pushd [dir]` | Ajoute un répertoire à la pile | `pushd /var/log` |
| `popd` | Retire le répertoire du sommet | `popd` |
| `mkdir [nom]` | Crée un nouveau répertoire | `mkdir projets` |
| `mkdir -p [chemin]` | Crée des répertoires parents si nécessaire | `mkdir -p docs/2024/jan` |
| `rmdir [nom]` | Supprime un répertoire vide | `rmdir old_folder` |
| `tree` | Affiche l'arborescence des répertoires | `tree` |
| `tree -L [niveau]` | Limite la profondeur d'affichage | `tree -L 2` |

---

## Gestion des Fichiers

### Opérations de Base

| Commande | Description | Exemple |
|----------|-------------|---------|
| `touch [fichier]` | Crée un nouveau fichier vide | `touch notes.txt` |
| `cat [fichier]` | Affiche le contenu d'un fichier | `cat readme.txt` |
| `cat [f1] >> [f2]` | Ajoute le contenu au fichier destination | `cat header.txt >> doc.txt` |
| `tac [fichier]` | Affiche le contenu en ordre inverse | `tac log.txt` |
| `head [fichier]` | Affiche les 10 premières lignes | `head access.log` |
| `head -n [N] [fichier]` | Affiche les N premières lignes | `head -n 20 data.csv` |
| `tail [fichier]` | Affiche les 10 dernières lignes | `tail error.log` |
| `tail -n [N] [fichier]` | Affiche les N dernières lignes | `tail -n 50 messages.log` |
| `tail -f [fichier]` | Suit en temps réel les ajouts | `tail -f /var/log/syslog` |
| `more [fichier]` | Affiche le contenu page par page | `more document.txt` |
| `less [fichier]` | Affiche avec navigation avancée | `less manuel.txt` |
| `cp [source] [dest]` | Copie un fichier | `cp rapport.pdf backup.pdf` |
| `cp -r [source] [dest]` | Copie récursivement | `cp -r projet projet_bak` |
| `cp -i [source] [dest]` | Copie avec confirmation | `cp -i file.txt /backup/` |
| `cp -u [source] [dest]` | Copie si source plus récente | `cp -u *.txt /backup/` |
| `mv [source] [dest]` | Déplace ou renomme | `mv old.txt new.txt` |
| `mv -i [source] [dest]` | Déplace avec confirmation | `mv -i file.txt /tmp/` |
| `rm [fichier]` | Supprime un fichier | `rm temp.txt` |
| `rm -r [répertoire]` | Supprime récursivement | `rm -r old_project` |
| `rm -rf [répertoire]` | Supprime sans confirmation | `rm -rf cache` |
| `rm -i [fichier]` | Supprime avec confirmation | `rm -i *.log` |
| `ln -s [cible] [lien]` | Crée un lien symbolique | `ln -s /usr/bin/python3 py` |
| `ln [cible] [lien]` | Crée un lien physique | `ln orig.txt copy.txt` |
| `file [fichier]` | Détermine le type d'un fichier | `file document.pdf` |
| `stat [fichier]` | Infos détaillées d'un fichier | `stat rapport.txt` |

### Édition de Fichiers

| Commande | Description | Exemple |
|----------|-------------|---------|
| `nano [fichier]` | Ouvre avec l'éditeur nano | `nano config.txt` |
| `vi [fichier]` | Ouvre avec l'éditeur vi | `vi script.sh` |
| `vim [fichier]` | Ouvre avec l'éditeur vim | `vim main.py` |
| `emacs [fichier]` | Ouvre avec l'éditeur emacs | `emacs readme.md` |
| `gedit [fichier]` | Ouvre avec gedit (graphique) | `gedit notes.txt` |

### Manipulation de Contenu

| Commande | Description | Exemple |
|----------|-------------|---------|
| `wc [fichier]` | Compte lignes, mots et octets | `wc document.txt` |
| `wc -w [fichier]` | Compte uniquement les mots | `wc -w article.txt` |
| `wc -l [fichier]` | Compte uniquement les lignes | `wc -l code.py` |
| `wc -c [fichier]` | Compte uniquement les octets | `wc -c data.bin` |
| `ls \| xargs wc` | Compte pour tous les fichiers | `ls *.txt \| xargs wc` |
| `cut -d [d] [fichier]` | Coupe des sections | `cut -d ',' -f1,3 data.csv` |
| `[data] \| cut -d [d]` | Coupe des sections pipées | `echo "a:b:c" \| cut -d ':' -f2` |
| `sort [fichier]` | Trie les lignes | `sort names.txt` |
| `sort -r [fichier]` | Trie en ordre inverse | `sort -r scores.txt` |
| `sort -n [fichier]` | Trie numériquement | `sort -n ages.txt` |
| `sort -u [fichier]` | Trie et supprime doublons | `sort -u list.txt` |
| `uniq [fichier]` | Supprime les doublons adjacents | `uniq contacts.txt` |
| `uniq -c [fichier]` | Compte les occurrences | `uniq -c log.txt` |
| `uniq -d [fichier]` | Affiche uniquement les doublons | `uniq -d users.txt` |
| `diff [f1] [f2]` | Compare deux fichiers | `diff old.txt new.txt` |
| `comm [f1] [f2]` | Compare fichiers triés | `comm list1.txt list2.txt` |
| `cmp [f1] [f2]` | Compare octet par octet | `cmp file1.bin file2.bin` |
| `source [fichier]` | Exécute dans le shell actuel | `source ~/.bashrc` |
| `[cmd] \| tee [f] >/dev/null` | Stocke sans afficher | `ls -la \| tee list.txt >/dev/null` |

### Sécurité et Chiffrement

| Commande | Description | Exemple |
|----------|-------------|---------|
| `gpg -c [fichier]` | Chiffre un fichier | `gpg -c secret.txt` |
| `gpg [fichier].gpg` | Déchiffre un fichier .gpg | `gpg secret.txt.gpg` |
| `shred -u [fichier]` | Écrase puis supprime | `shred -u confidential.doc` |
| `shred -vfz -n [N] [f]` | Écrase N fois avec verbose | `shred -vfz -n 10 data.txt` |
| `md5sum [fichier]` | Somme de contrôle MD5 | `md5sum ubuntu.iso` |
| `sha256sum [fichier]` | Somme de contrôle SHA-256 | `sha256sum package.tar.gz` |

---

## Recherche

| Commande | Description | Exemple |
|----------|-------------|---------|
| `find [path] -name [motif]` | Trouve des fichiers par nom | `find /home -name "*.txt"` |
| `find [path] -iname [motif]` | Recherche insensible à la casse | `find . -iname "readme*"` |
| `find [path] -type f` | Trouve uniquement les fichiers | `find /var -type f` |
| `find [path] -type d` | Trouve uniquement les répertoires | `find . -type d` |
| `find [path] -size [+100M]` | Fichiers > 100MB | `find /home -size +100M` |
| `find [path] -mtime -7` | Modifiés derniers 7 jours | `find . -mtime -7` |
| `find [path] -user [nom]` | Fichiers d'un utilisateur | `find /var -user apache` |
| `find [path] -perm [mode]` | Trouve par permissions | `find . -perm 644` |
| `grep [motif] [fichier]` | Cherche un motif | `grep "error" log.txt` |
| `grep -r [motif] [dir]` | Recherche récursive | `grep -r "TODO" ./src` |
| `grep -i [motif] [f]` | Insensible à la casse | `grep -i "warning" app.log` |
| `grep -v [motif] [f]` | Lignes NE correspondant PAS | `grep -v "debug" log.txt` |
| `grep -n [motif] [f]` | Avec numéros de ligne | `grep -n "function" code.js` |
| `grep -c [motif] [f]` | Compte les lignes | `grep -c "ERROR" syslog` |
| `locate [nom]` | Trouve rapidement | `locate nginx.conf` |
| `updatedb` | MAJ base de données locate | `sudo updatedb` |
| `which [commande]` | Chemin dans $PATH | `which python` |
| `whereis [commande]` | Binaire, source et manuel | `whereis gcc` |
| `awk '[motif] {print}' [f]` | Imprime lignes correspondantes | `awk '/error/ {print}' log.txt` |
| `sed 's/[old]/[new]/' [f]` | Remplace du texte | `sed 's/foo/bar/' file.txt` |
| `sed -i 's/[old]/[new]/g' [f]` | Remplacement sur place | `sed -i 's/http/https/g' urls.txt` |

---

## Compression et Archives

| Commande | Description | Exemple |
|----------|-------------|---------|
| `tar cf [archive.tar] [f/d]` | Crée une archive tar | `tar cf backup.tar /home/user` |
| `tar xf [archive.tar]` | Extrait une archive tar | `tar xf backup.tar` |
| `tar czf [archive.tar.gz]` | Crée archive tar.gz | `tar czf site.tar.gz www/` |
| `tar xzf [archive.tar.gz]` | Extrait archive tar.gz | `tar xzf site.tar.gz` |
| `tar cjf [archive.tar.bz2]` | Crée archive tar.bz2 | `tar cjf data.tar.bz2 data/` |
| `tar xjf [archive.tar.bz2]` | Extrait archive tar.bz2 | `tar xjf data.tar.bz2` |
| `tar tvf [archive.tar]` | Liste contenu sans extraire | `tar tvf backup.tar` |
| `gzip [fichier]` | Compresse en .gz | `gzip largefile.txt` |
| `gunzip [fichier.gz]` | Décompresse .gz | `gunzip file.txt.gz` |
| `gzip -d [fichier.gz]` | Décompresse .gz | `gzip -d archive.gz` |
| `bzip2 [fichier]` | Compresse en .bz2 | `bzip2 database.sql` |
| `bunzip2 [fichier.bz2]` | Décompresse .bz2 | `bunzip2 database.sql.bz2` |
| `zip [archive.zip] [f]` | Crée archive zip | `zip photos.zip *.jpg` |
| `unzip [archive.zip]` | Extrait archive zip | `unzip photos.zip` |
| `unzip -l [archive.zip]` | Liste contenu zip | `unzip -l package.zip` |
| `7z a [archive.7z] [f]` | Crée archive 7z | `7z a backup.7z documents/` |
| `7z x [archive.7z]` | Extrait archive 7z | `7z x backup.7z` |

---

## Transfert de Fichiers

| Commande | Description | Exemple |
|----------|-------------|---------|
| `scp [f] [user]@[host]:[path]` | Copie fichier vers serveur | `scp file.txt user@server:/tmp/` |
| `scp [user]@[host]:[f] [local]` | Copie fichier depuis serveur | `scp user@server:/log.txt ./` |
| `scp -r [dir] [user]@[h]:[p]` | Copie dossier récursivement | `scp -r projet/ user@server:/var/` |
| `scp -r [dir]/* [user]@[h]:[p]/` | Copie contenu dossier vers serveur (dossier doit exister) | `scp -r ./dir/* user@server:/dir/` |
| `scp [user]@[host]:'[path]/*' [local]/` | Copie contenu dossier depuis serveur (dossier sera créé) | `scp user@server:'/dir/*' ./newdir/` |
| `rsync -avzP [dir]/ [user]@[h]:[p]/` | Sync contenu vers serveur (dossier sera créé) | `rsync -avzP ./dir/ user@server:/newdir/` |
| `rsync -avzP [user]@[h]:[p]/ [local]/` | Sync contenu depuis serveur (dossier sera créé) | `rsync -avzP user@server:/dir/ ./newdir/` |
| `rsync -a [src] [user]@[h]:[d]` | Synchronise serveur | `rsync -a docs/ user@host:/backup/` |
| `rsync -avz [src] [dest]` | Sync avec compression | `rsync -avz /home/data/ /backup/` |
| `rsync -av --delete [s] [d]` | Sync et supprime absents | `rsync -av --delete src/ dst/` |
| `wget [url]` | Télécharge depuis URL | `wget https://example.com/file.zip` |
| `wget -c [url]` | Reprend téléchargement | `wget -c http://site.com/large.iso` |
| `wget -r [url]` | Télécharge récursivement | `wget -r http://example.com/docs/` |
| `curl -O [url]` | Télécharge (garde nom) | `curl -O https://site.com/file.tar` |
| `curl -o [nom] [url]` | Télécharge (nom perso) | `curl -o myfile.zip http://url/f.zip` |
| `curl -L [url]` | Suit les redirections | `curl -L https://short.url/abc` |
| `ftp [hôte]` | Ouvre session FTP | `ftp ftp.example.com` |
| `sftp [user]@[hôte]` | Ouvre session SFTP | `sftp user@server.com` |

**Note :** 
- `./dir/` (rsync) ou `./dir/*` (scp) = copie le contenu du répertoire (avec rsync le `/` positionne sur le contenu, pas besoin de `*`)
- `./dir` = copie le dossier lui-même (crée `dest/dir/`)
- **Attention** : `scp` local → serveur nécessite que le dossier de destination existe déjà, contrairement à serveur → local ou `rsync` (qui créent automatiquement)

---

## Permissions

### Gestion des Permissions

| Commande | Description | Exemple |
|----------|-------------|---------|
| `chmod 777 [fichier]` | rwxrwxrwx - Tous droits | `chmod 777 script.sh` |
| `chmod 755 [fichier]` | rwxr-xr-x - Standard exec | `chmod 755 /usr/local/bin/app` |
| `chmod 644 [fichier]` | rw-r--r-- - Fichier standard | `chmod 644 config.txt` |
| `chmod 600 [fichier]` | rw------- - Privé | `chmod 600 ~/.ssh/id_rsa` |
| `chmod 766 [fichier]` | rwxrw-rw- - Complet proprio | `chmod 766 shared.txt` |
| `chmod u+x [fichier]` | Ajoute exec pour proprio | `chmod u+x script.sh` |
| `chmod g-w [fichier]` | Retire écriture groupe | `chmod g-w document.txt` |
| `chmod o+r [fichier]` | Ajoute lecture autres | `chmod o+r readme.txt` |
| `chmod -R 755 [dir]` | Change récursivement | `chmod -R 755 /var/www` |
| `chown [user] [f]` | Change propriétaire | `chown john file.txt` |
| `chown [user]:[group] [f]` | Change proprio et groupe | `chown john:developers app.py` |
| `chown -R [user] [dir]` | Change récursif | `chown -R www-data /var/www` |
| `chgrp [groupe] [f]` | Change le groupe | `chgrp developers project.txt` |
| `chgrp -R [group] [dir]` | Change groupe récursif | `chgrp -R admin /etc/myapp` |
| `umask` | Affiche masque par défaut | `umask` |
| `umask 022` | Définit le masque | `umask 022` |

### Permissions Spéciales

| Commande | Description | Exemple |
|----------|-------------|---------|
| `chmod +t [dir]` | Sticky bit | `chmod +t /tmp/shared` |
| `chmod u+s [f]` | SUID | `chmod u+s /usr/bin/passwd` |
| `chmod g+s [dir]` | SGID | `chmod g+s /var/shared` |

---

## Processus

### Gestion des Processus

| Commande | Description | Exemple |
|----------|-------------|---------|
| `ps` | Liste processus actifs | `ps` |
| `ps aux` | Liste tous avec détails | `ps aux` |
| `ps -ef` | Liste tous (format complet) | `ps -ef` |
| `ps -u [user]` | Processus d'un utilisateur | `ps -u www-data` |
| `pstree` | Arborescence des processus | `pstree` |
| `pmap [pid]` | Carte mémoire d'un processus | `pmap 1234` |
| `top` | Moniteur interactif | `top` |
| `htop` | Moniteur coloré amélioré | `htop` |
| `kill [pid]` | Termine un processus | `kill 1234` |
| `kill -9 [pid]` | Force la terminaison | `kill -9 5678` |
| `kill -15 [pid]` | Terminaison gracieuse | `kill -15 9012` |
| `killall [nom]` | Termine par nom | `killall firefox` |
| `pkill [nom]` | Termine par nom | `pkill chrome` |
| `pgrep [mot-clé]` | Liste par mot-clé | `pgrep apache` |
| `pidof [nom]` | Affiche PID d'un processus | `pidof nginx` |
| `nice -n [pri] [cmd]` | Lance avec priorité | `nice -n 10 ./script.sh` |
| `renice [pri] [pid]` | Change priorité | `renice 5 1234` |
| `bg` | Reprend jobs en arrière-plan | `bg` |
| `fg` | Ramène job en avant-plan | `fg` |
| `fg [job]` | Ramène job spécifique | `fg %1` |
| `jobs` | Liste jobs en arrière-plan | `jobs` |
| `[commande] &` | Lance en arrière-plan | `./long-task.sh &` |
| `nohup [cmd] &` | Lance (persiste après logout) | `nohup python app.py &` |
| `lsof` | Fichiers ouverts | `lsof` |
| `lsof -i` | Connexions réseau | `lsof -i :80` |
| `lsof -u [user]` | Fichiers ouverts par user | `lsof -u john` |
| `trap "[cmds]" [sig]` | Capture un signal | `trap "echo Exit" EXIT` |
| `wait` | Attend fin d'un processus | `wait` |
| `time [commande]` | Mesure temps d'exécution | `time ./script.sh` |
| `timeout [dur] [cmd]` | Limite temps d'exécution | `timeout 30s ./test.sh` |

---

## Gestion du Système

### Informations Système

| Commande | Description | Exemple |
|----------|-------------|---------|
| `uname -a` | Infos système complètes | `uname -a` |
| `uname -r` | Version du noyau | `uname -r` |
| `uname -m` | Architecture processeur | `uname -m` |
| `hostname` | Nom d'hôte | `hostname` |
| `hostname -i` | IP du système | `hostname -i` |
| `uptime` | Durée de fonctionnement | `uptime` |
| `date` | Date et heure | `date` |
| `date +%Y-%m-%d` | Format personnalisé | `date +%Y-%m-%d` |
| `timedatectl` | Gère l'horloge système | `timedatectl` |
| `cal` | Calendrier du mois | `cal` |
| `cal [année]` | Calendrier de l'année | `cal 2024` |
| `w` | Utilisateurs connectés | `w` |
| `who` | Qui est connecté | `who` |
| `whoami` | Votre nom d'utilisateur | `whoami` |
| `id` | Détails utilisateur actif | `id` |
| `last` | Historique connexions | `last` |
| `last reboot` | Historique redémarrages | `last reboot` |
| `finger [user]` | Infos sur utilisateur | `finger john` |

### Contrôle du Système

| Commande | Description | Exemple |
|----------|-------------|---------|
| `shutdown [hh:mm]` | Programme un arrêt | `shutdown 23:00` |
| `shutdown now` | Arrête immédiatement | `shutdown now` |
| `shutdown -r now` | Redémarre immédiatement | `shutdown -r now` |
| `shutdown -c` | Annule arrêt programmé | `shutdown -c` |
| `reboot` | Redémarre le système | `reboot` |
| `halt` | Arrête le système | `halt` |
| `poweroff` | Éteint le système | `poweroff` |
| `init 0` | Arrête (niveau 0) | `init 0` |
| `init 6` | Redémarre (niveau 6) | `init 6` |
| `systemctl reboot` | Redémarre via systemd | `systemctl reboot` |
| `systemctl poweroff` | Éteint via systemd | `systemctl poweroff` |
| `systemctl suspend` | Met en veille | `systemctl suspend` |
| `systemctl hibernate` | Met en hibernation | `systemctl hibernate` |

### Services et Démons

| Commande | Description | Exemple |
|----------|-------------|---------|
| `systemctl start [svc]` | Démarre un service | `systemctl start nginx` |
| `systemctl stop [svc]` | Arrête un service | `systemctl stop apache2` |
| `systemctl restart [svc]` | Redémarre un service | `systemctl restart mysql` |
| `systemctl status [svc]` | Statut d'un service | `systemctl status sshd` |
| `systemctl enable [svc]` | Active au démarrage | `systemctl enable docker` |
| `systemctl disable [svc]` | Désactive au démarrage | `systemctl disable bluetooth` |
| `systemctl list-units` | Liste tous les services | `systemctl list-units` |
| `service [svc] start` | Démarre (ancien système) | `service apache2 start` |
| `service [svc] status` | Statut service | `service mysql status` |

### Modules et Logs

| Commande | Description | Exemple |
|----------|-------------|---------|
| `dmesg` | Messages démarrage noyau | `dmesg` |
| `dmesg \| grep -i error` | Recherche erreurs logs | `dmesg \| grep -i error` |
| `journalctl` | Logs système (systemd) | `journalctl` |
| `journalctl -u [svc]` | Logs service spécifique | `journalctl -u nginx` |
| `journalctl -f` | Suit logs en temps réel | `journalctl -f` |
| `journalctl --since "1h ago"` | Logs dernière heure | `journalctl --since "1 hour ago"` |
| `modprobe [module]` | Charge module noyau | `modprobe usb_storage` |
| `modprobe -r [module]` | Décharge module | `modprobe -r bluetooth` |
| `lsmod` | Liste modules chargés | `lsmod` |
| `modinfo [module]` | Infos sur module | `modinfo e1000e` |

### Limites et Ressources

| Commande | Description | Exemple |
|----------|-------------|---------|
| `ulimit -a` | Affiche toutes limites | `ulimit -a` |
| `ulimit -n` | Limite fichiers ouverts | `ulimit -n` |
| `ulimit -u` | Limite processus | `ulimit -u` |
| `ulimit -n [nombre]` | Définit limite fichiers | `ulimit -n 4096` |

---

## Informations Matérielles

### CPU et Mémoire

| Commande | Description | Exemple |
|----------|-------------|---------|
| `lscpu` | Infos détaillées CPU | `lscpu` |
| `cat /proc/cpuinfo` | Infos complètes CPU | `cat /proc/cpuinfo` |
| `cat /proc/meminfo` | Infos détaillées mémoire | `cat /proc/meminfo` |
| `free -h` | Mémoire (format lisible) | `free -h` |
| `free -m` | Mémoire en mégaoctets | `free -m` |
| `vmstat` | Stats mémoire virtuelle | `vmstat` |
| `vmstat 5` | Stats toutes les 5s | `vmstat 5` |

### Disques et Périphériques

| Commande | Description | Exemple |
|----------|-------------|---------|
| `lsblk` | Liste périphériques de bloc | `lsblk` |
| `lsblk -f` | Avec systèmes de fichiers | `lsblk -f` |
| `lspci` | Liste périphériques PCI | `lspci` |
| `lspci -tv` | Affichage en arborescence | `lspci -tv` |
| `lsusb` | Liste périphériques USB | `lsusb` |
| `lsusb -tv` | Arborescence USB | `lsusb -tv` |
| `lshw` | Config matérielle complète | `sudo lshw` |
| `lshw -short` | Résumé configuration | `sudo lshw -short` |
| `sudo dmidecode` | Infos BIOS/matériel | `sudo dmidecode` |
| `cat /proc/mounts` | Systèmes fichiers montés | `cat /proc/mounts` |
| `hdparm -i /dev/[dev]` | Informations du disque | `hdparm -i /dev/sda` |
| `hdparm -tT /dev/[dev]` | Test vitesse lecture | `hdparm -tT /dev/sda` |
| `badblocks -s /dev/[dev]` | Test blocs défectueux | `badblocks -s /dev/sdb` |
| `fsck /dev/[dev]` | Vérif système fichiers | `fsck /dev/sda1` |
| `smartctl -a /dev/[dev]` | État SMART du disque | `smartctl -a /dev/sda` |
| `inxi -F` | Infos système complètes | `inxi -F` |

---

## Utilisation du Disque

| Commande | Description | Exemple |
|----------|-------------|---------|
| `df -h` | Espace disque (lisible) | `df -h` |
| `df -i` | Inodes libres | `df -i` |
| `df -T` | Type système fichiers | `df -T` |
| `du -sh [dir]` | Taille d'un répertoire | `du -sh /var/www` |
| `du -ah [dir]` | Taille tous fichiers | `du -ah /home/user` |
| `du -h --max-depth=1` | Sous-répertoires (1 niveau) | `du -h --max-depth=1 /var` |
| `ncdu` | Analyseur interactif | `ncdu /home` |
| `fdisk -l` | Liste les partitions | `sudo fdisk -l` |
| `parted -l` | Liste partitions (GPT/MBR) | `sudo parted -l` |
| `mount` | Systèmes fichiers montés | `mount` |
| `mount [dev] [point]` | Monte un périphérique | `mount /dev/sdb1 /mnt/usb` |
| `umount [point]` | Démonte système fichiers | `umount /mnt/usb` |
| `findmnt` | Affiche points montage | `findmnt` |
| `blkid` | UUID et types | `blkid` |
| `mkfs.ext4 /dev/[dev]` | Formate en ext4 | `mkfs.ext4 /dev/sdb1` |
| `mkfs.ntfs /dev/[dev]` | Formate en NTFS | `mkfs.ntfs /dev/sdc1` |
| `dd if=/dev/zero of=[f] bs=1M count=1000` | Fichier test 1GB | `dd if=/dev/zero of=test.img bs=1M count=1000` |

---

## Réseau

### Configuration Réseau

| Commande | Description | Exemple |
|----------|-------------|---------|
| `ip addr show` | Affiche adresses IP | `ip addr show` |
| `ip a` | Version courte | `ip a` |
| `ip address add [IP] dev [if]` | Ajoute IP à interface | `ip address add 192.168.1.10 dev eth0` |
| `ip link show` | Interfaces réseau | `ip link show` |
| `ip link set [if] up` | Active interface | `ip link set eth0 up` |
| `ip link set [if] down` | Désactive interface | `ip link set wlan0 down` |
| `ip route show` | Table de routage | `ip route show` |
| `ifconfig` | Interfaces (ancienne cmd) | `ifconfig` |
| `ifconfig [if] up` | Active interface | `ifconfig eth0 up` |
| `ifconfig [if] down` | Désactive interface | `ifconfig wlan0 down` |
| `hostname -I` | IP locale | `hostname -I` |
| `nmcli` | Gère NetworkManager | `nmcli` |
| `nmcli device status` | Statut périphériques | `nmcli device status` |
| `nmcli connection show` | Affiche connexions | `nmcli connection show` |

### Tests et Diagnostics

| Commande | Description | Exemple |
|----------|-------------|---------|
| `ping [hôte]` | Teste connectivité | `ping google.com` |
| `ping -c 4 [hôte]` | Envoie 4 paquets | `ping -c 4 8.8.8.8` |
| `traceroute [hôte]` | Trace chemin | `traceroute google.com` |
| `tracepath [hôte]` | Trace chemin (alt) | `tracepath example.com` |
| `mtr [hôte]` | Ping + traceroute | `mtr google.com` |
| `netstat -pnltu` | Ports actifs (écoute) | `netstat -pnltu` |
| `netstat -tuln` | Ports TCP et UDP | `netstat -tuln` |
| `netstat -r` | Table de routage | `netstat -r` |
| `ss -tuln` | Sockets réseau | `ss -tuln` |
| `ss -s` | Stats des sockets | `ss -s` |
| `nmap [hôte]` | Scan de ports | `nmap 192.168.1.1` |
| `nmap -sP [réseau]` | Découverte hôtes | `nmap -sP 192.168.1.0/24` |
| `arp -a` | Table ARP | `arp -a` |
| `route -n` | Table de routage | `route -n` |
| `route add default gw [IP]` | Ajoute passerelle | `route add default gw 192.168.1.1` |
| `tcpdump -i [if]` | Capture trafic | `tcpdump -i eth0` |
| `iftop` | Moniteur bande passante | `iftop` |
| `nethogs` | Bande passante par process | `nethogs` |
| `speedtest-cli` | Test vitesse Internet | `speedtest-cli` |

### DNS et Domaines

| Commande | Description | Exemple |
|----------|-------------|---------|
| `nslookup [domaine]` | Interroge DNS | `nslookup google.com` |
| `dig [domaine]` | Infos DNS détaillées | `dig example.com` |
| `dig -x [IP]` | Recherche DNS inverse | `dig -x 8.8.8.8` |
| `dig -x [domaine]` | Recherche inverse domaine | `dig -x google.com` |
| `host [domaine]` | Recherche IP | `host github.com` |
| `whois [domaine]` | Infos WHOIS | `whois example.com` |
| `cat /etc/resolv.conf` | Serveurs DNS configurés | `cat /etc/resolv.conf` |
| `cat /etc/hosts` | Fichier hosts local | `cat /etc/hosts` |

### Téléchargement et Transfert

| Commande | Description | Exemple |
|----------|-------------|---------|
| `wget [url]` | Télécharge fichier | `wget https://example.com/file.zip` |
| `curl [url]` | Transfère données | `curl https://api.example.com` |
| `curl -I [url]` | En-têtes HTTP uniquement | `curl -I https://google.com` |
| `curl -X POST [url]` | Requête POST | `curl -X POST https://api.com/data` |

---

## SSH et Connexions à Distance

| Commande | Description | Exemple |
|----------|-------------|---------|
| `ssh [user]@[hôte]` | Connexion SSH | `ssh john@server.com` |
| `ssh [hôte]` | SSH (utilisateur actuel) | `ssh 192.168.1.10` |
| `ssh -p [port] [user]@[h]` | Connexion port spécifique | `ssh -p 2222 admin@server.com` |
| `ssh -i [clé] [user]@[h]` | Connexion avec clé privée | `ssh -i ~/.ssh/mykey user@host` |
| `ssh-keygen` | Génère paire de clés | `ssh-keygen -t rsa -b 4096` |
| `ssh-keygen -t rsa -b 4096` | Clé RSA 4096 bits | `ssh-keygen -t rsa -b 4096` |
| `ssh-copy-id [user]@[h]` | Copie clé vers serveur | `ssh-copy-id user@server.com` |
| `ssh-add [clé]` | Ajoute clé à agent SSH | `ssh-add ~/.ssh/id_rsa` |
| `ssh-agent bash` | Démarre agent SSH | `ssh-agent bash` |
| `scp [f] [user]@[h]:[p]` | Copie vers serveur | `scp file.txt user@server:/tmp/` |
| `scp [user]@[h]:[f] [l]` | Copie depuis serveur | `scp user@server:/log.txt ./` |
| `sftp [user]@[hôte]` | Transfert SFTP | `sftp user@server.com` |
| `telnet [hôte]` | Connexion Telnet (port 23) | `telnet example.com` |

---

## Utilisateurs et Groupes

| Commande | Description | Exemple |
|----------|-------------|---------|
| `id` | Détails utilisateur actif | `id` |
| `last` | Dernières connexions | `last` |
| `who` | Utilisateurs connectés | `who` |
| `w` | Users connectés + activité | `w` |
| `finger [user]` | Infos utilisateur | `finger john` |
| `sudo useradd [user]` | Crée compte utilisateur | `sudo useradd alice` |
| `sudo adduser [user]` | Crée user (interface) | `sudo adduser bob` |
| `sudo userdel [user]` | Supprime compte | `sudo userdel charlie` |
| `sudo usermod -aG [g] [u]` | Modifie user (ajoute groupe) | `sudo usermod -aG sudo john` |
| `passwd` | Change mot de passe actuel | `passwd` |
| `sudo passwd [user]` | Change mdp utilisateur | `sudo passwd alice` |
| `sudo groupadd [group]` | Ajoute nouveau groupe | `sudo groupadd developers` |
| `sudo groupdel [group]` | Supprime groupe | `sudo groupdel oldgroup` |
| `sudo groupmod -n [new] [old]` | Renomme groupe | `sudo groupmod -n devs developers` |
| `sudo [commande]` | Élève privilèges | `sudo apt update` |
| `su - [user]` | Change d'utilisateur | `su - root` |
| `chgrp [group] [f/d]` | Change groupe fichier | `chgrp admin config.txt` |

---

## Gestion des Paquets

### Debian/Ubuntu (APT)

| Commande | Description | Exemple |
|----------|-------------|---------|
| `sudo apt-get install [pkg]` | Installe paquet (apt-get) | `sudo apt-get install nginx` |
| `sudo apt install [pkg]` | Installe paquet (apt) | `sudo apt install git` |
| `apt search [keyword]` | Recherche paquet | `apt search python` |
| `apt list` | Liste paquets installés | `apt list --installed` |
| `apt show [pkg]` | Infos sur paquet | `apt show docker.io` |
| `sudo dpkg -i [pkg.deb]` | Installe .deb | `sudo dpkg -i package.deb` |
| `sudo dpkg -l` | Liste paquets dpkg | `sudo dpkg -l` |
| `sudo apt update` | MAJ liste paquets | `sudo apt update` |
| `sudo apt upgrade` | MAJ paquets installés | `sudo apt upgrade` |
| `sudo apt remove [pkg]` | Supprime paquet | `sudo apt remove apache2` |
| `sudo apt autoremove` | Supprime dépendances inutiles | `sudo apt autoremove` |

### Red Hat/CentOS/Fedora (YUM/DNF)

| Commande | Description | Exemple |
|----------|-------------|---------|
| `sudo yum install [pkg]` | Installe paquet YUM | `sudo yum install httpd` |
| `yum search [keyword]` | Recherche paquet | `yum search mysql` |
| `yum list installed` | Liste paquets installés | `yum list installed` |
| `yum info [pkg]` | Infos sur paquet | `yum info nginx` |
| `sudo dnf install [pkg]` | Installe paquet DNF | `sudo dnf install php` |
| `sudo rpm -i [pkg.rpm]` | Installe .rpm | `sudo rpm -i package.rpm` |
| `sudo yum update` | MAJ tous paquets | `sudo yum update` |
| `sudo yum remove [pkg]` | Supprime paquet | `sudo yum remove firefox` |

### Universel

| Commande | Description | Exemple |
|----------|-------------|---------|
| `tar zxvf [f.tar.gz]` | Extrait source | `tar zxvf app-1.0.tar.gz` |
| `cd [dir]` | Entre dans répertoire | `cd app-1.0` |
| `./configure` | Configure compilation | `./configure` |
| `make` | Compile source | `make` |
| `make install` | Installe depuis source | `sudo make install` |
| `sudo snap install [pkg]` | Installe Snap | `sudo snap install vlc` |
| `sudo snap find [keyword]` | Recherche Snap | `sudo snap find editor` |
| `sudo snap list` | Liste Snaps installés | `sudo snap list` |
| `flatpak install [pkg]` | Installe Flatpak | `flatpak install org.gimp.GIMP` |
| `flatpak search [keyword]` | Recherche Flatpak | `flatpak search firefox` |
| `flatpak list` | Liste Flatpaks | `flatpak list` |

---

## Variables et Environnement

| Commande | Description | Exemple |
|----------|-------------|---------|
| `let "[var]=[val]"` | Assigne valeur entière | `let "x=5"` |
| `export [var]` | Exporte variable Bash | `export PATH=/usr/local/bin:$PATH` |
| `declare [var]="[val]"` | Déclare variable Bash | `declare name="John"` |
| `set` | Liste variables shell | `set` |
| `unset [var]` | Supprime variable | `unset TEMP_VAR` |
| `echo $[var]` | Affiche valeur variable | `echo $HOME` |
| `printenv` | Affiche variables env | `printenv` |
| `printenv [var]` | Affiche variable spécifique | `printenv PATH` |
| `export VAR=value` | Définit variable env | `export EDITOR=vim` |

---

## Commandes Shell

| Commande | Description | Exemple |
|----------|-------------|---------|
| `alias [nom]='[cmd]'` | Crée alias | `alias ll='ls -la'` |
| `unalias [nom]` | Supprime alias | `unalias ll` |
| `watch -n [int] [cmd]` | Exécute à intervalle | `watch -n 5 df -h` |
| `sleep [int] && [cmd]` | Report exécution | `sleep 60 && echo "Done"` |
| `at [hh:mm]` | Job à heure précise | `echo "backup.sh" \| at 23:00` |
| `man [commande]` | Manuel d'une commande | `man grep` |
| `history` | Historique commandes | `history` |
| `history \| grep [mot]` | Recherche dans historique | `history \| grep ssh` |
| `!![commande]` | Répète dernière commande | `!!` |
| `![numéro]` | Exécute commande N | `!42` |
| `clear` | Efface l'écran terminal | `clear` |
| `exit` | Quitte session actuelle | `exit` |
| `logout` | Déconnexion | `logout` |
| `type [cmd]` | Type de commande | `type ls` |
| `help [cmd]` | Aide commande intégrée | `help cd` |

---

## Raccourcis Clavier

| Raccourci | Description | Usage |
|----------|-------------|---------|
| `Ctrl + C` | Termine processus en cours | Arrête commande en exécution |
| `Ctrl + Z` | Suspend processus | Peut reprendre avec `fg` ou `bg` |
| `Ctrl + D` | Fin de fichier (EOF) | Ferme terminal/session |
| `Ctrl + L` | Efface l'écran | Équivalent à `clear` |
| `Ctrl + A` | Début de ligne | Curseur au début |
| `Ctrl + E` | Fin de ligne | Curseur à la fin |
| `Ctrl + W` | Coupe mot avant curseur | Ajoute au presse-papiers |
| `Ctrl + U` | Coupe avant curseur | Ligne jusqu'au curseur |
| `Ctrl + K` | Coupe après curseur | Du curseur à la fin |
| `Ctrl + Y` | Colle depuis presse-papiers | Récupère texte coupé |
| `Ctrl + R` | Recherche historique | Rappelle commandes |
| `Ctrl + O` | Exécute commande rappelée | Après Ctrl+R |
| `Ctrl + G` | Quitte recherche historique | Annule Ctrl+R |
| `Tab` | Auto-complétion | Complète commandes/fichiers |
| `Tab Tab` | Liste suggestions | Affiche toutes options |
| `Ctrl + T` | Échange 2 caractères | Transpose caractères |
| `Alt + B` | Mot précédent | Curseur en arrière |
| `Alt + F` | Mot suivant | Curseur en avant |
| `!!` | Répète dernière commande | Re-exécute |
| `clear` | Efface terminal | Nettoie l'écran |
| `exit` | Déconnexion | Quitte session |

---

## 📝 Notes Importantes

### Sudo et Permissions
- Préfixer avec `sudo` pour exécuter avec droits administrateur
- Exemple: `sudo apt install package`

### Caractères Spéciaux
- `*` : Joker (tous les fichiers)
- `?` : Un seul caractère
- `~` : Répertoire home
- `.` : Répertoire actuel
- `..` : Répertoire parent

### Redirections
- `>` : Redirige sortie (écrase)
- `>>` : Redirige sortie (ajoute)
- `<` : Redirige entrée
- `|` : Pipe (enchaîne commandes)
- `2>` : Redirige erreurs
- `&>` : Redirige tout

### Aide et Documentation
- `man [commande]` : Manuel détaillé
- `[commande] --help` : Aide rapide
- `info [commande]` : Documentation info
- `whatis [commande]` : Description courte

---
