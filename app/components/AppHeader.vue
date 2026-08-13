<template>
  <header class="site-header">
    <div class="container header-inner">
      <NuxtLink class="brand" to="/">
        {{ profile.name }}
      </NuxtLink>

      <nav aria-label="주요 메뉴">
        <ul class="nav-list">
          <li><NuxtLink to="/">홈</NuxtLink></li>
          <li><NuxtLink to="/projects">프로젝트</NuxtLink></li>
          <li><NuxtLink to="/about">소개</NuxtLink></li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { profile } from '~/data/profile'
</script>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 1px solid var(--color-border);
  background: color-mix(in srgb, var(--color-bg) 88%, transparent);
  backdrop-filter: blur(16px);
}

.header-inner {
  min-height: 4.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-5);
}

.brand {
  color: var(--color-text);
  font-weight: 800;
  letter-spacing: -0.03em;
  text-decoration: none;
}

.nav-list {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin: 0;
  padding: 0;
  list-style: none;
}

.nav-list a {
  color: var(--color-muted);
  font-size: 0.95rem;
  font-weight: 700;
  text-decoration: none;
}

.nav-list a:hover,
.nav-list a.router-link-active {
  color: var(--color-accent);
}
</style>
