<template>
  <section class="section">
    <div class="container">
      <header class="page-header">
        <p class="eyebrow">Projects</p>
        <h1>프로젝트</h1>
        <p>문제 정의부터 해결 과정과 결과까지 기록합니다.</p>
      </header>

      <section aria-labelledby="featured-projects-heading">
        <div class="section-heading section-heading-compact">
          <div>
            <p class="eyebrow">Featured cases</p>
            <h2 id="featured-projects-heading">주요 프로젝트</h2>
          </div>
        </div>
        <div class="featured-project-list">
          <ProjectShowcase
            v-for="project in featuredProjects"
            :key="project.slug"
            :project="project"
          />
        </div>
      </section>

      <section class="additional-projects" aria-labelledby="additional-projects-heading">
        <div class="section-heading section-heading-compact">
          <div>
            <p class="eyebrow">Additional work</p>
            <h2 id="additional-projects-heading">그 외 프로젝트</h2>
          </div>
        </div>
        <div class="project-grid">
          <ProjectCard
            v-for="project in additionalProjects"
            :key="project.slug"
            :project="project"
          />
        </div>
      </section>
    </div>
  </section>
</template>

<script setup lang="ts">
import { profile } from '~/data/profile'

const { data: projects } = await useAsyncData('projects', () => {
  return queryCollection('projects')
    .order('order', 'ASC')
    .all()
})

const featuredProjects = computed(() => projects.value?.filter(project => project.featured) || [])
const additionalProjects = computed(() => projects.value?.filter(project => !project.featured) || [])

useSeoMeta({
  title: `프로젝트 | ${profile.name}`,
  description: `${profile.name}의 프로젝트 목록입니다.`
})
</script>

<style scoped>
.section-heading-compact {
  margin-bottom: var(--space-5);
}

.section-heading-compact h2 {
  font-size: clamp(1.75rem, 4vw, 2.75rem);
}

.featured-project-list {
  display: grid;
  gap: var(--space-7);
}

.additional-projects {
  margin-top: var(--space-9);
  padding-top: var(--space-8);
  border-top: 1px solid var(--color-border);
}
</style>
