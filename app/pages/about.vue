<template>
  <section class="section">
    <div class="container prose-layout">
      <header>
        <p class="eyebrow">About</p>
        <h1>소개</h1>
      </header>

      <div class="prose">
        <p>{{ profile.summary }}</p>
        <h2>일하는 방식</h2>
        <p>
          이 영역을 본인의 문제 해결 방식, 협업 경험, 중요하게 생각하는 개발 원칙으로 교체하세요.
        </p>
        <h2>기술</h2>
        <dl class="skill-list">
          <div v-for="group in profile.skillGroups" :key="group.label">
            <dt>{{ group.label }}</dt>
            <dd>{{ group.skills.join(' · ') }}</dd>
          </div>
        </dl>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { profile } from '~/data/profile'

useSeoMeta({
  title: `소개 | ${profile.name}`,
  description: profile.summary
})
</script>

<style scoped>
.skill-list {
  display: grid;
  gap: var(--space-4);
}

.skill-list div {
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--color-border);
}

.skill-list dt {
  color: var(--color-text);
  font-weight: 800;
}

.skill-list dd {
  margin: var(--space-2) 0 0;
}
</style>
