<template>
  <div>
    <section class="hero section">
      <div class="container hero-grid">
        <div>
          <p class="eyebrow">{{ profile.role }}</p>
          <h1>{{ profile.name }}</h1>
          <p class="hero-copy">
            {{ profile.summary }}
          </p>

          <div class="hero-actions">
            <NuxtLink class="button button-primary" to="/projects">
              프로젝트 보기
            </NuxtLink>
            <a class="button button-secondary" :href="`mailto:${profile.email}`">
              연락하기
            </a>
          </div>
        </div>

        <aside class="skill-panel" aria-labelledby="skill-heading">
          <p id="skill-heading" class="eyebrow">Core skills</p>
          <ul class="skill-groups">
            <li v-for="group in profile.skillGroups" :key="group.label">
              <strong>{{ group.label }}</strong>
              <span>{{ group.skills.join(' · ') }}</span>
            </li>
          </ul>
        </aside>
      </div>
    </section>

    <section class="section section-muted" aria-labelledby="featured-heading">
      <div class="container">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Selected work</p>
            <h2 id="featured-heading">주요 프로젝트</h2>
          </div>
          <NuxtLink to="/projects">전체 보기 →</NuxtLink>
        </div>

        <div class="project-grid">
          <ProjectCard
            v-for="project in featuredProjects"
            :key="project.slug"
            :project="project"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { profile } from '~/data/profile'

const { data: featuredProjects } = await useAsyncData('featured-projects', () => {
  return queryCollection('projects')
    .where('featured', '=', true)
    .order('order', 'ASC')
    .all()
})

useSeoMeta({
  title: `${profile.name} | ${profile.role}`,
  description: profile.summary,
  ogTitle: `${profile.name} | ${profile.role}`,
  ogDescription: profile.summary,
  ogType: 'website'
})
</script>

<style scoped>
.hero {
  display: grid;
  min-height: min(48rem, calc(100vh - 4.5rem));
  align-items: center;
}

.hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(17rem, 0.65fr);
  gap: clamp(3rem, 8vw, 8rem);
  align-items: center;
}

h1 {
  max-width: 12ch;
  margin: var(--space-3) 0 var(--space-5);
  font-size: clamp(3.25rem, 10vw, 7rem);
  line-height: 0.95;
  letter-spacing: -0.065em;
}

.hero-copy {
  max-width: 38rem;
  color: var(--color-muted);
  font-size: clamp(1.05rem, 2vw, 1.3rem);
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-top: var(--space-7);
}

.skill-panel {
  padding: var(--space-6);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: linear-gradient(145deg, var(--color-surface), var(--color-accent-soft));
}

.skill-groups {
  display: grid;
  gap: var(--space-3);
  margin: var(--space-5) 0 0;
  padding: 0;
  list-style: none;
}

.skill-groups li {
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--color-border);
}

.skill-groups li:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.skill-groups strong,
.skill-groups span {
  display: block;
}

.skill-groups strong {
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.skill-groups span {
  margin-top: 0.2rem;
  color: var(--color-muted);
  font-size: 0.86rem;
}

@media (max-width: 760px) {
  .hero-grid {
    grid-template-columns: 1fr;
    gap: var(--space-8);
  }
}
</style>
