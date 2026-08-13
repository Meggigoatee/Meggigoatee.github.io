<template>
  <article v-if="project" class="section">
    <div class="container project-detail">
      <header>
        <NuxtLink class="back-link" to="/projects">← 프로젝트 목록</NuxtLink>
        <p class="eyebrow">{{ project.category }} · {{ project.status }}</p>
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
      </header>

      <div v-if="project.cover" class="cover-frame">
        <img :src="project.cover" :alt="`${project.title} 대표 화면`">
      </div>
      <div v-else-if="showMediaPlaceholder" class="cover-frame cover-placeholder" aria-hidden="true">
        대표 이미지 영역
      </div>

      <section class="tech-section" aria-labelledby="tech-heading">
        <h2 id="tech-heading">기술 스택</h2>
        <ul class="tag-list">
          <li v-for="tech in project.techStack" :key="tech">{{ tech }}</li>
        </ul>
      </section>

      <ProjectDiagram v-if="project.diagram" :diagram="project.diagram" />

      <ContentRenderer class="project-content" :value="project" />

      <section v-if="project.gallery.length" class="gallery" aria-labelledby="gallery-heading">
        <h2 id="gallery-heading">프로젝트 화면</h2>
        <img
          v-for="image in project.gallery"
          :key="image"
          :src="image"
          :alt="`${project.title} 프로젝트 화면`"
        >
      </section>

      <video v-if="project.video" class="project-video" controls :src="project.video">
        브라우저가 영상 재생을 지원하지 않습니다.
      </video>
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
  margin-bottom: var(--space-8);
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

.cover-frame {
  display: grid;
  overflow: hidden;
  aspect-ratio: 16 / 9;
  margin-top: var(--space-8);
  place-items: center;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
}

.cover-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-placeholder {
  color: var(--color-muted);
  background: linear-gradient(145deg, var(--color-surface), var(--color-accent-soft));
}

.tech-section,
.project-content,
.gallery,
.project-video {
  margin-top: var(--space-8);
  padding-top: var(--space-7);
  border-top: 1px solid var(--color-border);
}

.tech-section h2,
.gallery h2 {
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

.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
  gap: var(--space-4);
}

.gallery h2 {
  grid-column: 1 / -1;
}

.gallery img,
.project-video {
  width: 100%;
  border-radius: var(--radius-lg);
}
</style>
