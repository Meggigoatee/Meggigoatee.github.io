<template>
  <article v-if="project" class="section">
    <div class="container project-detail">
      <NuxtLink class="back-link" to="/projects">← 프로젝트 목록</NuxtLink>

      <header class="project-header">
        <p class="eyebrow">
          {{ project.category }}<template v-if="isConfirmed(project.status)"> · {{ project.status }}</template>
        </p>
        <h1>{{ project.title }}</h1>
        <p class="lead">{{ project.summary }}</p>

        <dl v-if="visibleFacts.length" class="project-facts">
          <div v-if="project.period">
            <dt>기간</dt>
            <dd>{{ project.period }}</dd>
          </div>
          <div v-if="isConfirmed(project.role)">
            <dt>담당</dt>
            <dd>{{ project.role }}</dd>
          </div>
          <div v-if="isConfirmed(project.team)">
            <dt>구성</dt>
            <dd>{{ project.team }}</dd>
          </div>
        </dl>

        <section v-if="project.links?.length" class="project-links" aria-labelledby="links-heading">
          <h2 id="links-heading" class="eyebrow">관련 링크</h2>
          <ul>
            <li v-for="link in project.links" :key="link.url">
              <a
                class="button button-secondary"
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ link.label }} <span aria-hidden="true">↗</span>
              </a>
              <span v-if="link.description">{{ link.description }}</span>
            </li>
          </ul>
        </section>
      </header>

      <ProjectImageSlider
        v-if="project.cover || project.gallery.length"
        :title="project.title"
        :cover="project.cover"
        :gallery="project.gallery"
        :layout="project.imageLayout"
      />

      <div v-else-if="showMediaPlaceholder && !project.video" class="cover-placeholder" aria-hidden="true">
        대표 이미지 영역
      </div>

      <video
        v-if="project.video"
        class="project-video"
        controls
        playsinline
        preload="metadata"
        :src="project.video"
        :poster="project.videoPoster || undefined"
        :aria-label="`${project.title} 시연 영상`"
      >
        브라우저가 영상 재생을 지원하지 않습니다.
      </video>

      <section class="tech-section" aria-labelledby="tech-heading">
        <h2 id="tech-heading">기술 스택</h2>
        <ul class="tag-list">
          <li v-for="tech in project.techStack" :key="tech">{{ tech }}</li>
        </ul>
      </section>

      <ProjectTopologyDiagram v-if="project.topologyDiagram" :diagram="project.topologyDiagram" />

      <ProjectDiagram v-if="project.diagram" :diagram="project.diagram" />

      <ProjectUseCaseDiagram v-if="project.useCaseDiagram" :diagram="project.useCaseDiagram" />

      <ContentRenderer class="project-content" :value="project" />

    </div>
  </article>
</template>

<script setup lang="ts">
import { profile } from '~/data/profile'

const route = useRoute()
const showMediaPlaceholder = import.meta.dev
const slug = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug
const { data: project } = await useAsyncData(`project-${slug}`, () => {
  return queryCollection('projects')
    .where('slug', '=', slug || '')
    .first()
})

const isConfirmed = (value: string | null) => Boolean(value && value !== '확인 필요')
const visibleFacts = computed(() => [
  project.value?.period,
  project.value?.role,
  project.value?.team
].filter(value => isConfirmed(value || null)))

if (!project.value) {
  throw createError({
    statusCode: 404,
    statusMessage: '프로젝트를 찾을 수 없습니다'
  })
}

useSeoMeta({
  title: `${project.value.title} | ${profile.name}`,
  description: project.value.summary
})
</script>

<style scoped>
.project-detail {
  max-width: 58rem;
}

.back-link {
  display: inline-block;
  margin-bottom: var(--space-6);
}

.project-header {
  margin-top: 0;
}

h1 {
  margin: var(--space-3) 0 var(--space-5);
  font-size: clamp(2.75rem, 8vw, 5.5rem);
  line-height: 1;
  letter-spacing: -0.055em;
}

.lead {
  max-width: 44rem;
  color: var(--color-muted);
  font-size: clamp(1.1rem, 2vw, 1.35rem);
}

.project-facts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  gap: var(--space-4);
  margin: var(--space-7) 0 0;
}

.project-facts div {
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-border);
}

.project-facts dt {
  color: var(--color-muted);
  font-size: 0.78rem;
  font-weight: 800;
}

.project-facts dd {
  margin: var(--space-2) 0 0;
}

.project-links {
  margin-top: var(--space-7);
}

.project-links h2 {
  margin: 0 0 var(--space-3);
  font-size: 0.78rem;
}

.project-links ul {
  display: grid;
  gap: var(--space-3);
  margin: 0;
  padding: 0;
  list-style: none;
}

.project-links li {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-3);
}

.project-links span:not([aria-hidden]) {
  color: var(--color-muted);
  font-size: 0.92rem;
}

.cover-placeholder {
  display: grid;
  overflow: hidden;
  aspect-ratio: 16 / 9;
  margin-top: var(--space-8);
  place-items: center;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  color: var(--color-muted);
  background: linear-gradient(145deg, var(--color-surface), var(--color-accent-soft));
}

.tech-section,
.project-content {
  margin-top: var(--space-8);
  padding-top: var(--space-7);
  border-top: 1px solid var(--color-border);
}

.tech-section h2 {
  margin-top: 0;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  padding: 0;
  list-style: none;
}

.tag-list li {
  padding: 0.45rem 0.75rem;
  border-radius: 999px;
  background: var(--color-accent-soft);
  color: var(--color-accent-strong);
  font-weight: 700;
}

.project-content {
  color: var(--color-muted);
  font-size: 1.05rem;
}

.project-content :deep(h2) {
  margin: var(--space-8) 0 var(--space-4);
  color: var(--color-text);
  font-size: clamp(1.6rem, 4vw, 2.25rem);
  letter-spacing: -0.035em;
}

.project-content :deep(h2:first-child) {
  margin-top: 0;
}

.project-content :deep(h3) {
  margin: var(--space-6) 0 var(--space-3);
  color: var(--color-text);
}

.project-content :deep(li + li),
.project-content :deep(p + p) {
  margin-top: var(--space-2);
}

.project-video {
  width: 100%;
  margin-top: var(--space-8);
  border-radius: var(--radius-lg);
}
</style>
