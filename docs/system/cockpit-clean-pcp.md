---
title: Suppression de Performance Co-Pilot (PCP) sur Ubuntu Server
description: Désactiver et supprimer les services PCP (pmcd, pmlogger) et sécuriser les ports associés (44321, 4330) sur un serveur Ubuntu.
comments: true
---

# Désactivation et suppression de Performance Co-Pilot (PCP)

Ce document décrit les étapes suivies pour désactiver complètement les services liés à **Performance Co-Pilot (PCP)** sur un serveur Ubuntu Server, dans un objectif de durcissement de la surface d’exposition réseau.

---

##  Objectif

Performance Co-Pilot est un outil de monitoring avancé, rarement utile sur un serveur de production sans besoins spécifiques. Il expose plusieurs ports (notamment `4330` et `44321`), et déploie plusieurs services persistants.

**J'ai donc décidé de désactiver et de supprimer totalement ce composant.**

---

##  Étapes de désactivation et suppression

### 1. Arrêt des services

```bash
sudo systemctl stop pmcd pmlogger
```

### 2. Désactivation des services au démarrage

```bash
sudo systemctl disable pmcd
sudo systemctl disable pmlogger
```

### 3. Suppression des paquets PCP

```bash
sudo apt remove --purge pcp pcp-zeroconf
```

> Certains paquets comme `pcp-system-tools` ou `pcp-webapp` peuvent être absents selon les distributions, ce n’est pas bloquant.

### 4. Nettoyage système

```bash
sudo apt autoremove --purge
sudo apt clean
```

### 5. Vérification des ports libérés

```bash
sudo ss -tulnp | grep -E '4330|44321'
# (aucun résultat attendu)
```

### 6. Blocage des ports restants (par sécurité)

```bash
sudo ufw deny 4330
sudo ufw deny 44321
```

---

## Résultat

- Aucun port exposé inutilement
- Aucune instabilité du système
- Services PCP totalement désactivés et purgés
- Moins de surface d’attaque réseau

---

**Cette opération est sans risque pour un usage standard d’Ubuntu Server.**

