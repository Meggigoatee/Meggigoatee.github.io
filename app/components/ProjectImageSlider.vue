<template>
  <section class="project-images" :aria-label="`${title} 프로젝트 이미지`">
    <div
      class="image-frame"
      :class="layout"
      :tabindex="images.length > 1 ? 0 : undefined"
      @keydown.left.prevent="showPrevious"
      @keydown.right.prevent="showNext"
      @touchstart.passive="onTouchStart"
      @touchend.passive="onTouchEnd"
    >
      <img
        :key="activeImage"
        :src="resolveImageUrl(activeImage)"
        :alt="`${title} 프로젝트 화면 ${activeIndex + 1}`"
      >

      <template v-if="images.length > 1">
        <button
          class="slide-arrow previous"
          type="button"
          aria-label="이전 이미지 보기"
          @click="showPrevious"
        >
          <span aria-hidden="true">←</span>
        </button>
        <button
          class="slide-arrow next"
          type="button"
          aria-label="다음 이미지 보기"
          @click="showNext"
        >
          <span aria-hidden="true">→</span>
        </button>
      </template>
    </div>

    <div v-if="images.length > 1" class="slide-controls">
      <span class="slide-count" role="status" aria-live="polite">
        {{ activeIndex + 1 }} / {{ images.length }}
      </span>
      <div class="slide-dots" :aria-label="`${title} 이미지 선택`">
        <button
          v-for="(image, index) in images"
          :key="`${image}-${index}`"
          type="button"
          class="slide-dot"
          :class="{ active: index === activeIndex }"
          :aria-label="`${index + 1}번째 이미지 보기`"
          :aria-current="index === activeIndex ? 'true' : undefined"
          @click="activeIndex = index"
        >
          <span aria-hidden="true" />
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  cover: string | null
  gallery: string[]
  layout?: 'landscape' | 'portrait'
}>()

const images = computed(() => [...new Set([props.cover, ...props.gallery].filter((image): image is string => Boolean(image)))])
const activeIndex = ref(0)
const activeImage = computed(() => images.value[activeIndex.value] || '')
const baseURL = useRuntimeConfig().app.baseURL.replace(/\/$/, '')
let touchStartX: number | null = null
let touchStartY: number | null = null

function resolveImageUrl(image: string) {
  return image.startsWith('/') && !image.startsWith('//') ? `${baseURL}${image}` : image
}

watch(images, () => {
  activeIndex.value = 0
})

function showPrevious() {
  if (images.value.length < 2) return
  activeIndex.value = (activeIndex.value - 1 + images.value.length) % images.value.length
}

function showNext() {
  if (images.value.length < 2) return
  activeIndex.value = (activeIndex.value + 1) % images.value.length
}

function onTouchStart(event: TouchEvent) {
  touchStartX = event.changedTouches[0]?.clientX ?? null
  touchStartY = event.changedTouches[0]?.clientY ?? null
}

function onTouchEnd(event: TouchEvent) {
  if (touchStartX === null || touchStartY === null) return

  const deltaX = (event.changedTouches[0]?.clientX ?? touchStartX) - touchStartX
  const deltaY = (event.changedTouches[0]?.clientY ?? touchStartY) - touchStartY
  touchStartX = null
  touchStartY = null

  if (Math.abs(deltaX) < 50 || Math.abs(deltaX) <= Math.abs(deltaY)) return
  if (deltaX < 0) showNext()
  else showPrevious()
}
</script>

<style scoped>
.project-images {
  margin-top: var(--space-8);
}

.image-frame {
  position: relative;
  display: grid;
  overflow: hidden;
  aspect-ratio: 16 / 9;
  place-items: center;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
}

.image-frame.portrait {
  width: min(100%, 29rem);
  aspect-ratio: 9 / 16;
  margin-inline: auto;
}

.image-frame img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.image-frame:focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 4px;
}

.slide-arrow {
  position: absolute;
  top: 50%;
  display: grid;
  width: 2.75rem;
  height: 2.75rem;
  padding: 0;
  place-items: center;
  transform: translateY(-50%);
  border: 1px solid var(--color-border);
  border-radius: 50%;
  background: var(--color-surface);
  color: var(--color-text);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  font-size: 1.3rem;
}

.slide-arrow:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.previous {
  left: var(--space-4);
}

.next {
  right: var(--space-4);
}

.slide-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  margin-top: var(--space-3);
}

.slide-count {
  color: var(--color-muted);
  font-size: 0.875rem;
  font-variant-numeric: tabular-nums;
}

.slide-dots {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.2rem;
}

.slide-dot {
  display: grid;
  width: 1.5rem;
  height: 1.5rem;
  padding: 0;
  place-items: center;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.slide-dot span {
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 50%;
  background: var(--color-border);
}

.slide-dot.active span {
  background: var(--color-accent);
}

@media (max-width: 600px) {
  .slide-arrow {
    width: 2.25rem;
    height: 2.25rem;
  }

  .previous {
    left: var(--space-2);
  }

  .next {
    right: var(--space-2);
  }
}
</style>
