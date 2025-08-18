---
title: Installation n8n avec Node 22, systemd et Caddy (Ubuntu Server)
description: Guide d'installation pas à pas de n8n avec Node 22, systemd et Caddy sur un serveur Ubuntu. Configuration sécurisée et optimisée pour la production avec des étapes claires et des vérifications de sécurité - Simon Chabrier.
comments: true
---

# Playbook n8n 105.4 + Node 22 + systemd + Caddy (Ubuntu Server)

Ce guide présente un playbook d'installation de n8n sur un serveur Ubuntu, en utilisant Node.js 22, systemd pour la gestion du service, et Caddy comme serveur web pour le proxy HTTPS. L'objectif est de fournir une configuration sécurisée et optimisée pour la production en self-hosted.

Replacer `user_name` par votre nom d'utilisateur et `mon-domaine.ext` par votre nom de domaine.

C'est mon install de test en self-hosted, pour une instance en production. Pas facile, la version de n8n utilisé m'a demandé d'installer Node 22, j'ai rencontré pas mal de problèmes de configuration mais globalement j'ai suivi ces étaps et fini par obtenir une instance fonctionnelle et sécurisée.

## Étapes d’installation

1) **Pré-check versions** | Valider compat Node/n8n | 
```sh
node -v && npm -v && npm view n8n@1.105.4 engines.node
```

2) **Installer Node 22 via NVM** | Runtime compatible | 
```sh
bash -lc 'source ~/.nvm/nvm.sh && nvm install 22'
```

3) **Installer n8n stable** | Binaire CLI opérationnel | 
```sh
bash -lc 'source ~/.nvm/nvm.sh && nvm use 22 && npm i -g n8n@1.105.4'
```

4) **Sécuriser le fichier de config** | Éviter l’avertissement permissions |
```sh
install -m 0600 -o user_name -g user_name -D /home/user_name/.n8n/config
```

5) **Créer le service systemd** | Démarrage fiable sous Node 22 |
```sh
sudo tee /etc/systemd/system/n8n.service >/dev/null <<'EOF'
[Unit]
Description=n8n Automation
After=network.target

[Service]
Type=simple
User=user_name
Environment=NVM_DIR=/home/user_name/.nvm
Environment=PATH=/home/user_name/.nvm/versions/node/v22.18.0/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin
Environment=N8N_PORT=5678
Environment=N8N_LISTEN_ADDRESS=127.0.0.1
Environment=N8N_HOST=mon-domaine.ext
Environment=N8N_PROTOCOL=https
Environment=WEBHOOK_URL=https://mon-domaine.ext/
Environment=N8N_EDITOR_BASE_URL=https://mon-domaine.ext/
Environment=N8N_RUNNERS_ENABLED=true
Environment=N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true
WorkingDirectory=/home/user_name
ExecStart=/home/user_name/.nvm/versions/node/v22.18.0/bin/node /home/user_name/.nvm/versions/node/v22.18.0/bin/n8n
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF
```

6) **Activer et démarrer** | Lancer au boot |
```sh
sudo systemctl daemon-reload && sudo systemctl enable --now n8n
```

## Vérifs & sécurité

7) **Écoute locale uniquement** | Réduire surface d’attaque |
```sh
sudo ss -ltnp | awk '/:5678 /{print $4,$5,$7}'
```

8) **Test loopback** | Sanity check HTTP local |
```sh
curl -sSI http://127.0.0.1:5678 | head -n1
```

9) **Test IP LAN** | Confirmer non-exposition externe |
```sh
ip=$(hostname -I|awk '{print $1}'); curl -sSI --max-time 3 http://$ip:5678 || echo "Refusé (OK)"
```

10) **Stat du fichier sensible** | Vérifier 0600 |
```sh
stat -c '%a %U:%G %n' /home/user_name/.n8n/config
```

11) **Santé du service** | Logs récents clairs |
```sh
systemctl status n8n --no-pager -l && journalctl -u n8n -n 30 --no-pager -o cat
```

## DNS + Caddy

12) **Vérif DNS/HTTP** | Résolution + redir HTTPS |
```sh
dig +short A mon-domaine.ext && curl -I http://mon-domaine.ext | head -n3
```

13) **VHost Caddy** | Proxy HTTPS vers n8n |
```sh
sudo bash -lc 'cat >>/etc/caddy/Caddyfile << "EOF"
mon-domaine.ext {
  reverse_proxy 127.0.0.1:5678
}
EOF
caddy validate --config /etc/caddy/Caddyfile && systemctl reload caddy'
```

14) **Vérif TLS proxy** | Contrôler 200 et HTTP/2 |
```sh
curl -I https://mon-domaine.ext | sed -n "1,10p"
```

## Onboarding UI

15) **Création compte owner** | Finaliser l’instance |
```sh
echo "Ouvrir https://mon-domaine.ext/setup et crée l’owner"
```

16) **Licence gratuite (optionnel)** | Activer History/Debug/Search/Folders |
```sh
echo "UI: Settings → License → coller la clé reçue par email"
```

## Conclusion

Ca prend pas mal de temps et créer des automations n'est pas vraiment intuitif on a vite une usine à gaz. A mon sens n8n est plus adapté pour des automatisations simples et des intégrations de services tiers que pour des workflows complexes. SI on pense l'utiliser pour se simplifier des tâches, il faut vraiment réfléchir à la complexité de ce qu'on veut faire et si on ne peut pas le faire autrement plus facilement car finalement on peut se retourver à passer plus de temps à configurer qu'à automatiser.

J'ai compilé les étapes principales d'install ede sécurisation de n8n avec Node 22, systemd et Caddy. C'est un bon point de départ pour une instance en production, mais il y a toujours des ajustements à faire selon les besoins spécifiques ou la configuration du serveur...en tout cas c'est ce que j'ai fait pour mon instance de test et ca fonctionne bien.

N'hésitez pas à adapter les commandes et configurations selon votre environnement et vos besoins spécifiques. Bonne chance avec votre instance n8n !