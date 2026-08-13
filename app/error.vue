<template>
  <NuxtLayout>
    <section class="section">
      <div class="container error-page">
        <p class="eyebrow">{{ error.statusCode }}</p>
        <h1>페이지를 찾을 수 없습니다</h1>
        <p>{{ error.statusMessage }}</p>
        <NuxtLink class="button button-primary" to="/">
          홈으로 돌아가기
        </NuxtLink>
      </div>
    </section>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
  error: NuxtError
}>()
</script>

<style scoped>
.error-page {
  display: grid;
  place-items: start;
  gap: var(--space-5);
}

h1 {
  margin: 0;
  font-size: clamp(2.5rem, 8vw, 5rem);
  letter-spacing: -0.05em;
}
</style>
