<template>
  <footer class="site-footer">
    <div class="container footer-inner">
      <p>© {{ currentYear }} {{ profile.name }}</p>
      <a :href="profile.githubUrl" target="_blank" rel="noreferrer">
        GitHub
      </a>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { profile } from '~/data/profile'

const currentYear = new Date().getFullYear()
</script>

<style scoped>
.site-footer {
  border-top: 1px solid var(--color-border);
}

.footer-inner {
  min-height: 6rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  color: var(--color-muted);
  font-size: 0.9rem;
}
</style>
