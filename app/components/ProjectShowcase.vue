<template>
  <article class="project-showcase">
    <div class="showcase-heading">
      <div class="project-meta">
        <span>{{ project.category }}</span>
        <span v-if="isConfirmed(project.status)">{{ project.status }}</span>
      </div>

      <h3>
        <NuxtLink :to="`/projects/${project.slug}`">
          {{ project.title }}
        </NuxtLink>
      </h3>

      <p class="summary">{{ project.summary }}</p>
    </div>

    <div class="showcase-copy">
      <dl class="project-facts">
        <div v-if="project.period">
          <dt>기간</dt>
          <dd>{{ project.period }}</dd>
        </div>
        <div v-if="isConfirmed(project.role)">
          <dt>담당</dt>
          <dd>{{ project.role }}</dd>
        </div>
      </dl>

      <ul class="tag-list" :aria-label="`${project.title} 기술 스택`">
        <li v-for="tech in project.techStack" :key="tech">
          {{ tech }}
        </li>
      </ul>

      <NuxtLink class="detail-link" :to="`/projects/${project.slug}`">
        프로젝트 상세 보기 <span aria-hidden="true">→</span>
      </NuxtLink>
    </div>

    <div v-if="project.diagram" class="showcase-visual">
      <ProjectDiagram :diagram="project.diagram" />
    </div>
  </article>
</template>

<script setup lang="ts">
import type { ProjectsCollectionItem } from '@nuxt/content'

defineProps<{
  project: ProjectsCollectionItem
}>()

const isConfirmed = (value: string | null) => Boolean(value && value !== '확인 필요')
</script>

<style scoped>
.project-showcase {
  display: grid;
  grid-template-columns: minmax(14rem, 0.65fr) minmax(0, 1.35fr);
  column-gap: clamp(2rem, 5vw, 5rem);
  row-gap: clamp(2rem, 4vw, 3rem);
  align-items: start;
  padding: clamp(1.5rem, 4vw, 3rem);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
}

.project-meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: var(--space-3);
  color: var(--color-muted);
  font-size: 0.8rem;
  font-weight: 700;
}

h3 {
  margin: var(--space-4) 0;
  font-size: clamp(2rem, 5vw, 3.5rem);
  line-height: 1.02;
  letter-spacing: -0.05em;
}

h3 a {
  color: var(--color-text);
  text-decoration: none;
}

.summary {
  max-width: 32rem;
  margin: 0;
  color: var(--color-muted);
  font-size: 1.05rem;
}

.project-facts {
  display: grid;
  gap: var(--space-3);
  margin: 0;
}

.project-facts div {
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-border);
}

.project-facts dt {
  color: var(--color-muted);
  font-size: 0.75rem;
  font-weight: 800;
}

.project-facts dd {
  margin: var(--space-2) 0 0;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin: var(--space-6) 0 0;
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
  gap: var(--space-2);
  margin-top: var(--space-6);
  font-weight: 800;
}

.showcase-visual :deep(.diagram) {
  margin-top: 0;
}

.showcase-visual {
  grid-column: 1 / -1;
  min-width: 0;
}

@media (max-width: 860px) {
  .project-showcase {
    grid-template-columns: 1fr;
  }
}
</style>
