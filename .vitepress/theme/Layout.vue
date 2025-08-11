<script setup>
import DefaultTheme from "vitepress/theme";
import IssoComments from "./components/IssoComments.vue";

const { Layout } = DefaultTheme;
</script>

<template>
  <!-- On réutilise le layout par défaut -->
  <Layout>
    <!-- On ajoute la zone commentaires sous le contenu -->
    <template #doc-after>
      <IssoComments v-if="$frontmatter.comments === true" />
    </template>
  </Layout>
</template>
