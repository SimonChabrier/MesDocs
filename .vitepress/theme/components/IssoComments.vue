<script setup>
import { onMounted } from "vue";
const issoOrigin = "https://comments.simschab.cloud"; // sans slash final

onMounted(() => {
  // CSS Isso – une seule fois
  if (!document.querySelector("link[data-isso-css]")) {
    const base = document.createElement("link");
    base.rel = "stylesheet";
    base.href = `${issoOrigin}/css/isso.css`;
    base.setAttribute("data-isso-css", "1");
    document.head.appendChild(base);
  }

  // CSS override – une seule fois, APRES isso.css
  if (!document.querySelector("link[data-isso-override]")) {
    const over = document.createElement("link");
    over.rel = "stylesheet";
    over.href = `/isso-overrides.css`;
    over.setAttribute("data-isso-override", "1");
    document.head.appendChild(over);
  }

  // Script Isso – une seule fois
  if (!window.__issoLoaded) {
    const s = document.createElement("script");
    s.src = `${issoOrigin}/js/embed.min.js`;
    s.defer = true;
    s.setAttribute("data-isso", `${issoOrigin}/`); // slash final requis
    document.body.appendChild(s);
    window.__issoLoaded = true;
  } else if (window.Isso && typeof window.Isso.init === "function") {
    window.Isso.init();
  }
});
</script>

<template>
  <ClientOnly>
    <section id="isso-thread" />
  </ClientOnly>
</template>
