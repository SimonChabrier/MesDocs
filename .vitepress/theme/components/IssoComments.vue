<script setup lang="ts">
import { onMounted, onBeforeUnmount, nextTick, watch } from "vue";
// @ts-ignore dispo côté client dans VitePress
import { useRoute } from "vitepress";

const ISSO_ORIGIN = "https://comments.simschab.cloud"; // sans slash final
const ISSO_BASE = `${ISSO_ORIGIN}/`; // AVEC slash final

const route = useRoute();

let cssIsso: HTMLLinkElement | null = null;
let cssOverride: HTMLLinkElement | null = null;
let jsIsso: HTMLScriptElement | null = null;
let anchorGuard: ((e: MouseEvent) => void) | null = null;

function ensureCssOnce() {
  if (!document.querySelector('link[data-isso-css="1"]')) {
    cssIsso = document.createElement("link");
    cssIsso.rel = "stylesheet";
    cssIsso.href = `${ISSO_ORIGIN}/css/isso.css`;
    cssIsso.setAttribute("data-isso-css", "1");
    document.head.appendChild(cssIsso);
  }
  if (!document.querySelector('link[data-isso-override="1"]')) {
    cssOverride = document.createElement("link");
    cssOverride.rel = "stylesheet";
    cssOverride.href = `/isso-overrides.css`;
    cssOverride.setAttribute("data-isso-override", "1");
    document.head.appendChild(cssOverride);
  }
}

function loadIssoOnce(): Promise<void> {
  return new Promise((resolve, reject) => {
    // déjà prêt ?
    if ((window as any).Isso?.init) {
      resolve();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>('script[data-isso-script="1"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Isso load error")), { once: true });
      return;
    }

    jsIsso = document.createElement("script");
    jsIsso.src = `${ISSO_ORIGIN}/js/embed.min.js`;
    jsIsso.async = true; // on s’appuie sur onload
    jsIsso.setAttribute("data-isso", ISSO_BASE); // slash final requis
    jsIsso.setAttribute("data-isso-script", "1");
    jsIsso.onload = () => resolve();
    jsIsso.onerror = () => reject(new Error("Isso load error"));
    document.body.appendChild(jsIsso);
  });
}

async function initIssoForPage() {
  // s’assurer que #isso-thread est dans le DOM
  await nextTick();
  if (!document.getElementById("isso-thread")) return;

  await loadIssoOnce();

  const w = window as any;
  // double tir pour couvrir les cas de timing
  w.Isso?.init?.();
  w.Isso?.fetchComments?.();
  setTimeout(() => {
    w.Isso?.init?.();
    w.Isso?.fetchComments?.();
  }, 30);
}

/** Empêche le “saut en haut” si jamais le handler Isso n’est pas prêt */
function installAnchorGuard() {
  if (anchorGuard) return;
  anchorGuard = (e: MouseEvent) => {
    const a = (e.target as Element)?.closest?.('#isso-thread a[href^="#"]') as HTMLAnchorElement | null;
    if (!a) return;
    const href = a.getAttribute("href") || "";
    // on bloque uniquement les ancres d’action Isso, pas les permaliens #isso-123
    if (href === "#" || ["#up", "#down", "#reply", "#edit", "#delete", "#preview"].includes(href)) {
      // si Isso n’a pas encore accroché ses handlers, on évite la navigation
      if (!(window as any).Isso) e.preventDefault();
    }
  };
  document.addEventListener("click", anchorGuard, true); // capture=true
}

function removeAnchorGuard() {
  if (!anchorGuard) return;
  document.removeEventListener("click", anchorGuard, true);
  anchorGuard = null;
}

onMounted(async () => {
  ensureCssOnce();
  installAnchorGuard();
  await initIssoForPage();

  watch(
    () => route.path,
    async () => {
      // à chaque changement de page, ré-init Isso sur le nouveau #isso-thread
      await initIssoForPage();
    }
  );
});

onBeforeUnmount(() => {
  // On peut garder CSS/JS en cache pour les autres pages
  // removeAnchorGuard() // décommente si tu veux retirer le filet
});
</script>

<template>
  <ClientOnly>
    <section id="isso-thread"></section>
  </ClientOnly>
</template>
