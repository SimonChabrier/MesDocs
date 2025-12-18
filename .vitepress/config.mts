import { defineConfig } from "vitepress";

export default defineConfig({
  sitemap: {
    hostname: "https://doc.simschab.cloud"
  },
  lang: "fr-FR",
  head: [
    // Ajout du favicon (obligatoire si tu veux éviter l'erreur 404)
    ["link", { rel: "icon", href: "/favicon.ico" }],
    // Ajout de la balise meta author globale
    ["meta", { name: "author", content: "Simon Chabrier" }],
    // Open Graph / Facebook
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:locale", content: "fr_FR" }],
    ["meta", { property: "og:site_name", content: "Documentation Simon Chabrier" }],
    ["meta", { property: "og:image", content: "/og-image.webp" }], // À décommenter quand l'image sera créée
    // Twitter Card
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["meta", { name: "twitter:creator", content: "@SimonChabrier" }],
    // Ajout du script Matomo
    [
      "script",
      {},
      `
        var _paq = window._paq = window._paq || [];
          _paq.push(['trackPageView']);
          _paq.push(['enableLinkTracking']);
          (function() {
            var u="https://matomo.simschab.cloud/";
            _paq.push(['setTrackerUrl', u+'matomo.php']);
            _paq.push(['setSiteId', '4']);
            var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
            g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
          })();
      `
    ]
  ],
  lastUpdated: true,
  title: "Accueil",
  description:
    "Base de ressource personnelles autour du développement web, de symfony, de javascript et de l'administration système avec Ubuntu Serveur. Je garde ici les commandes utilses à passer dasn le terminal, les astuces et les bonnes pratiques que je peux collecter au fil de mes projets...",
  base: "/",
  themeConfig: {
    outlineTitle: "Sur cette page",
    lastUpdatedText: "Dernière mise à jour le",
    docFooter: {
      prev: "Page précédente",
      next: "Page suivante"
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/SimonChabrier" },
      {
        icon: {
          svg: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Profil</title><path d="M12 2a5 5 0 015 5 5 5 0 01-5 5 5 5 0 01-5-5 5 5 0 015-5zm0 12c-3.866 0-7 2.015-7 4.5V20h14v-1.5c0-2.485-3.134-4.5-7-4.5z"/></svg>'
        },
        link: "https://simonchabrier.fr/"
      }
    ],
    search: {
      provider: "local"
    },
    nav: [
      { text: "Tech", link: "/docs/system/index.md" },
      { text: "Php", link: "/docs/php/index.md" },
      { text: "Js", link: "/docs/js/index.md" },
      { text: "IA", link: "/docs/ia/index.md" },
      { text: "Articles", link: "/docs/articles/index.md" }
    ],
    sidebar: {
      "/docs/system/": [
        {
          text: "🔧 Configuration système",
          items: [
            { text: "Terminal Commandes", link: "/docs/system/linux-commands-guide" },
            { text: "Terminal Config", link: "/docs/system/terminal-config" },
            { text: "Rsync sauvegarde", link: "/docs/system/rsync-backup" },
            { text: "Gestion des droits", link: "/docs/system/droits-ecriture" },
            { text: "Transfert de fichiers", link: "/docs/system/tranfert-fichiers" },
            { text: "Code Serveur", link: "/docs/system/code-serveur" }
          ]
        },
        {
          text: "🛡️ Sécurité & Pare-feu",
          items: [
            { text: "Fail2Ban", link: "/docs/system/fail2ban" },
            { text: "Bot protection", link: "/docs/system/caddy-bot-protection" },
            { text: "Sécurité Ip BlackList", link: "/docs/system/black-list" },
            { text: "Cockpit login security", link: "/docs/system/cockpit-security" }
          ]
        },
        {
          text: "🌐 CaddyServer",
          items: [
            { text: "Installer CaddyServer", link: "/docs/system/caddy-install" },
            { text: "Configurer CaddyServer", link: "/docs/system/caddy-caddyfile" },
            { text: "CaddyServer Local https", link: "/docs/system/caddy-local-https" },
            { text: "Maintenance CaddyServer", link: "/docs/system/caddy-commandes" },
            { text: "BasicAuth CaddyServer", link: "/docs/system/caddy-basicauth" },
            { text: "Caddy => Apache", link: "/docs/system/caddy-apache" }
          ]
        },
        {
          text: "🖥️ Admin & Interface",
          items: [
            { text: "Cockpit", link: "/docs/system/cockpit" },
            { text: "Cockpit remove PCP", link: "/docs/system/cockpit-clean-pcp" },
            { text: "Mailhog Install", link: "/docs/system/mailhog" },
            { text: "Installer PhpMyAdmin pour PHP 8.*", link: "/docs/system/phpmyadmin-install" },
            { text: "Config User BDD", link: "/docs/system/bdd-create-user" }
          ]
        },
        {
          text: "🔐 Accès SSH & Déploiement",
          items: [
            { text: "Ssh OSX <=> Machine", link: "/docs/system/osx-ssh.md" },
            { text: "Ssh Serveur <=> Hôte Config", link: "/docs/system/ssh" },
            { text: "Ssh Machine <=> GitHub", link: "/docs/system/ssh-github" }
          ]
        },
        {
          text: "📊 Matomo",
          items: [
            { text: "Installer Matomo", link: "/docs/system/matomo" },
            { text: "Matomo Astro", link: "/docs/system/matomo-astro" },
            { text: "Matomo VitePress", link: "/docs/system/matomo-vitepress" }
          ]
        },
        {
          text: "📡 Mercure",
          items: [
            { text: "Installer Mercure", link: "/docs/system/mercure-install" },
            { text: "Mercure Jwt", link: "/docs/system/mercure-jwt-generator" }
          ]
        }
      ],
      "/docs/php/": [
        {
          text: "Base de connaissances Php",
          items: [
            { text: "Symfony", link: "/docs/php/symfony/commandes-utiles.md" },
            { text: "Symfony GitHub Action", link: "/docs/php/symfony/symfony-github-actions.md" },
            { text: "Symfony DebugBar Ajax", link: "/docs/php/symfony/debug-bar-ajax" },
            { text: "Mercure", link: "/docs/php/symfony/mercure-config" },
            { text: "Php 8.3 pour Symfony en prod", link: "/docs/system/php8.3-prod-config" }
          ]
        }
      ],
      "/docs/js/": [
        {
          text: "Base de connaissances Js",
          items: [
            { text: "Mon Architecture", link: "/docs/js/architecture-app-express" },
            { text: "Express App en production", link: "/docs/js/express-app-on-prod-serveur" },
            { text: "VitePress Url Canoniques", link: "/docs/js/vitrepress-canonical" }
          ]
        }
      ],
      "/docs/ia/": [
        {
          text: "IA et Automatisation",
          items: [{ text: "n8n Install", link: "/docs/ia/n8n-install.md" }]
        }
      ],
      "/docs/articles/": [
        {
          text: "Articles & Réflexions",
          items: [
            { text: "Développer n'est pas développer !", link: "/docs/articles/developpement-vs-fonctionnalites" },
            { text: "Plus c'est user firendly moins c'est développeur easy.", link: "/docs/articles/user-firendly-not-devloppeur-easy" },
            { text: "Pourquoi opter pour un framewerk dans le développement web ?", link: "/docs/articles/framework-addict" }
          ]
        }
      ]
    },
    footer: {
      message:
        '<a href="https://simonchabrier.fr/">Simon Chabrier</a> - Agen / Lot et Garonne - <a href="mailto:simonchabrier@gmail.com">Mail</a> - <a href="tel:+33663244587">Tel</a>',
      copyright: "Sc © 2025"
    }
  },
  // Créer les urls canonique au build.
  transformHead({ page }) {
    if (page === "404.md") return [];
    const HOST = "https://doc.simschab.cloud";
    const href = (HOST.replace(/\/+$/, "") + "/" + page)
      .replace(/\/index\.md$/, "/") // dossier racine propre
      .replace(/\.md$/, ".html") // .md -> .html
      .replace(/\/+/g, "/"); // pas de //
    return [["link", { rel: "canonical", href }]];
  }
});
