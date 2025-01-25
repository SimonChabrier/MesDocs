---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Ma base de connaissances"
  text: "Simon Chabrier"
  tagline: "Développeur fullstack"
  # actions:
  #   - theme: brand
  #     text: System & Serveur
  #     link: /docs/system/index.md
  #   - theme: brand
  #     text: Symfony & PHP
  #     link: /docs/php/index.md
  #   - theme: brand
  #     text: Node.js & JavaScript
  #     link: /docs/js/index.md

features:
  # - title: 1 | TECH
  #   # icon: '💻'
  #   details: ''
  # - title: 2 | PHP
  #   # icon: '🐘'
  #   details: ''
  # - title: 3 | JS
  #   # icon: '🟢'
  #   details: ''
  - title: Toujours tes projets au bout tu mèneras...
    details: ...dans la joie et la bonne humeur tu coderas, tes ressources tu conservas sur une documentation comme il se doit...et la force avec toi tu auras !
---


<script setup>
import { VPTeamMembers } from 'vitepress/theme'

const simon = [
  {
    avatar: '/avatar.jpg',
    name: 'Simon Chabrier',
    title: 'Développeur fullstack',
    links: [
      { icon: 'github', link: 'https://github.com/SimonChabrier' },
      { icon: { svg: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Profil</title><path d="M12 2a5 5 0 015 5 5 5 0 01-5 5 5 5 0 01-5-5 5 5 0 015-5zm0 12c-3.866 0-7 2.015-7 4.5V20h14v-1.5c0-2.485-3.134-4.5-7-4.5z"/></svg>' }, link: 'https://simonchabrier.github.io/' }
    ]
  },
]
</script>

<style>
.profile .is-home {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
}
.vp-doc .VPTeamMembers.medium.count-1 .container {
    max-width: inherit!important;
}
</style>

<VPTeamMembers size="medium" :members="simon" />

