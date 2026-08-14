<template>
  <article class="project-card">
    <div class="project-meta">
      <span>{{ project.category }}</span>
      <span v-if="project.status !== '확인 필요'">{{ project.status }}</span>
    </div>

    <h3>
      <NuxtLink :to="`/projects/${project.slug}`">
        {{ project.title }}
      </NuxtLink>
    </h3>

    <p>{{ project.summary }}</p>

    <ul class="tag-list" :aria-label="`${project.title} 기술 스택`">
      <li v-for="tech in project.techStack" :key="tech">
        {{ tech }}
      </li>
    </ul>

    <NuxtLink
      v-if="showDetailLink"
      class="detail-link"
      :to="`/projects/${project.slug}`"
    >
      프로젝트 보기 <span aria-hidden="true">→</span>
    </NuxtLink>
  </article>
</template>

<script setup lang="ts">
import type { ProjectsCollectionItem } from '@nuxt/content'

defineProps<{
  project: ProjectsCollectionItem
  showDetailLink?: boolean
}>()
</script>

<style scoped>
.project-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: var(--space-6);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
  transition: transform 180ms ease, border-color 180ms ease;
}

.project-card:hover {
  transform: translateY(-3px);
  border-color: var(--color-accent);
}

.project-meta {
  display: flex;
  justify-content: space-between;
  gap: var(--space-3);
  color: var(--color-muted);
  font-size: 0.8rem;
}

h3 {
  margin: var(--space-4) 0 var(--space-3);
  font-size: 1.35rem;
}

h3 a {
  color: var(--color-text);
  text-decoration: none;
}

p {
  color: var(--color-muted);
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin: var(--space-5) 0 0;
  padding: 0;
  list-style: none;
}

.tag-list li {
  padding: 0.35rem 0.65rem;
  border-radius: 999px;
  background: var(--color-accent-soft);
  color: var(--color-accent-strong);
  font-size: 0.78rem;
  font-weight: 700;
}

.detail-link {
  display: inline-flex;
  align-self: flex-end;
  gap: var(--space-2);
  margin-top: auto;
  padding-top: var(--space-6);
  font-weight: 800;
}
</style>
