# Personnaliser le terminal avec des alias de commandes

## Ajouter des alias de commandes

- Les alias ajoutés au fichier de configuraiton du terminal sont des raccourcis qui évitent de taper des commandes longues et répétitives. Par exemple, on peut ajouter un alias pour la commande `git status` et l'appeler `gs`. Ainsi, au lieu de taper `git status`, on peut taper `gs` pour afficher le statut du dépôt git.

## Ouvrir le fichier `.bashrc` ou `.zshrc`

- Ouvrir le fichier `.bashrc` (windows) ou `.zshrc` (osx) avec l'éditeur de texte `nano` :
```bash
nano ~/.bashrc
```

```bash
nano ~/.zshrc
```

- On ajoute autant d'alias qu'on veut, par exemple les alias utilses pour git et symfony avec Edith.
```bash
alias ss='symfony serve'
alias ssl='symfony server:log'
alias ssd='symfony serve -d'
alias nav='symfony open:local'
alias rw='npm run watch'
alias cr='composer require'
alias cc='bin/console cache:clear'
alias ccp='bin/console cache:pool:clear --all'
alias bc='bin/console' 
alias ga='git add .'
alias gcm='git commit -m'
alias gpu='git push'
alias gs='git stash'
alias gsp='git stash pop'
alias gs='git status'
alias gpl='git pull'
alias mc='bin/console messenger:consume async -vv'
```

- Ensuite on recharge le fichier de configuration pour prendre en compte les modifications.
```bash
source ~/.bashrc   # Pour bash
source ~/.zshrc    # Pour zsh
```

`Attention souvent il faut redémarrer le terminal pour que les modifications soient prises en compte. Le plus simple est de fermer et réouvrir le terminal après avoir sauvegardé les modifications dans le fichier de configuration.`

## Utiliser les nouveaux alias de commandes

- Ex si je veux commit push en une seule commande je tape désormais directement :
```bash
    ga && gcm "mon message de commit" && gpu
```

- Ex si je veux lancer le serveur symfony je tape désormais directement :
```bash
    ss
```

- Et si je veux lancer le serveur symfoy et monitorer les assets en même temps je tape désormais directement :
```bash
    ss && rw
```