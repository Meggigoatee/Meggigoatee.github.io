<template>
  <figure class="use-case-diagram" :aria-label="diagram.ariaLabel">
    <figcaption>
      <strong>{{ diagram.title }}</strong>
      <span>{{ diagram.description }}</span>
    </figcaption>

    <p class="scroll-hint">좌우로 스크롤해 전체 유스케이스를 확인할 수 있습니다.</p>

    <div class="use-case-viewport">
      <svg
        class="use-case-canvas"
        :viewBox="`0 0 ${canvas.width} ${canvas.height}`"
        role="img"
        :aria-label="diagram.ariaLabel"
      >
        <title>{{ diagram.ariaLabel }}</title>

        <g class="associations" aria-hidden="true">
          <line
            v-for="relation in diagram.relations"
            :key="`${relation.from}-${relation.to}`"
            :x1="relationPosition(relation.from).x"
            :y1="relationPosition(relation.from).y"
            :x2="relationPosition(relation.to).x"
            :y2="relationPosition(relation.to).y"
          />
        </g>

        <rect
          class="system-boundary"
          :x="boundary.x"
          :y="boundary.y"
          :width="boundary.width"
          :height="boundary.height"
          rx="22"
        />
        <text class="system-label" :x="canvas.width / 2" :y="boundary.y + 34">
          {{ diagram.systemLabel }}
        </text>

        <g
          v-for="(useCase, index) in diagram.useCases"
          :key="useCase.id"
          class="use-case"
          :transform="`translate(${useCasePosition(index).x} ${useCasePosition(index).y})`"
        >
          <ellipse rx="92" ry="42" />
          <text text-anchor="middle" dominant-baseline="middle">{{ useCase.label }}</text>
        </g>

        <g
          v-for="actor in diagram.actors"
          :key="actor.id"
          class="actor"
          :transform="`translate(${actorPosition(actor).x} ${actorPosition(actor).y})`"
        >
          <circle cy="-42" r="14" />
          <line y1="-28" y2="12" />
          <line x1="-24" y1="-10" x2="24" y2="-10" />
          <line y1="12" x2="-22" y2="42" />
          <line y1="12" x2="22" y2="42" />
          <text y="67" text-anchor="middle">{{ actor.label }}</text>
        </g>
      </svg>
    </div>

    <details class="use-case-notes">
      <summary>액터와 유스케이스 설명</summary>
      <dl>
        <div v-for="actor in diagram.actors" :key="`${actor.id}-detail`">
          <dt>{{ actor.label }}</dt>
          <dd>{{ actor.detail }}</dd>
        </div>
        <div v-for="useCase in diagram.useCases" :key="`${useCase.id}-detail`">
          <dt>{{ useCase.label }}</dt>
          <dd>{{ useCase.detail }}</dd>
        </div>
      </dl>
    </details>
  </figure>
</template>

<script setup lang="ts">
interface UseCaseActor {
  id: string
  label: string
  detail: string
  side: 'left' | 'right'
}

interface UseCaseItem {
  id: string
  label: string
  detail: string
}

interface UseCaseRelation {
  from: string
  to: string
}

interface UseCaseDiagram {
  kind: string
  title: string
  description: string
  ariaLabel: string
  systemLabel: string
  actors: UseCaseActor[]
  useCases: UseCaseItem[]
  relations: UseCaseRelation[]
}

const props = defineProps<{
  diagram: UseCaseDiagram
}>()

const canvas = computed(() => ({
  width: 1000,
  height: Math.max(580, 170 + Math.ceil(props.diagram.useCases.length / 2) * 145)
}))

const boundary = computed(() => ({
  x: 220,
  y: 42,
  width: 560,
  height: canvas.value.height - 84
}))

const useCasePosition = (index: number) => ({
  x: index % 2 === 0 ? 390 : 610,
  y: 145 + Math.floor(index / 2) * 145
})

const actorsBySide = (side: UseCaseActor['side']) => props.diagram.actors.filter(actor => actor.side === side)

const actorPosition = (actor: UseCaseActor) => {
  const sideActors = actorsBySide(actor.side)
  const index = sideActors.findIndex(item => item.id === actor.id)

  return {
    x: actor.side === 'left' ? 92 : 908,
    y: canvas.value.height * (index + 1) / (sideActors.length + 1)
  }
}

const relationPosition = (id: string) => {
  const actor = props.diagram.actors.find(item => item.id === id)
  if (actor) {
    const position = actorPosition(actor)
    return {
      x: position.x + (actor.side === 'left' ? 28 : -28),
      y: position.y - 8
    }
  }

  const useCaseIndex = props.diagram.useCases.findIndex(item => item.id === id)
  return useCaseIndex >= 0 ? useCasePosition(useCaseIndex) : { x: 0, y: 0 }
}
</script>

<style scoped>
.use-case-diagram {
  width: 100%;
  min-width: 0;
  max-width: 100%;
  margin: var(--space-8) 0 0;
  padding: var(--space-6);
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: linear-gradient(145deg, var(--color-surface), var(--color-accent-soft));
}

figcaption {
  display: grid;
  gap: var(--space-2);
}

figcaption strong {
  color: var(--color-text);
  font-size: 1.2rem;
}

figcaption span {
  color: var(--color-muted);
}

.scroll-hint {
  display: none;
  margin: var(--space-4) 0 0;
  color: var(--color-muted);
  font-size: 0.78rem;
}

.use-case-viewport {
  width: 100%;
  min-width: 0;
  margin-top: var(--space-5);
  padding-bottom: var(--space-2);
  overflow-x: auto;
  overscroll-behavior-inline: contain;
}

.use-case-canvas {
  display: block;
  width: 100%;
  min-width: 48rem;
  height: auto;
}

.system-boundary {
  fill: color-mix(in srgb, var(--color-bg) 72%, transparent);
  stroke: color-mix(in srgb, var(--color-accent) 45%, var(--color-border));
  stroke-width: 1.5;
}

.system-label {
  fill: var(--color-accent-strong);
  font-size: 18px;
  font-weight: 800;
  text-anchor: middle;
}

.associations line {
  stroke: color-mix(in srgb, var(--color-muted) 75%, transparent);
  stroke-width: 1.5;
}

.use-case ellipse {
  fill: var(--color-bg);
  stroke: var(--color-accent);
  stroke-width: 1.5;
}

.use-case text,
.actor text {
  fill: var(--color-text);
  font-size: 15px;
  font-weight: 750;
}

.actor circle {
  fill: var(--color-bg);
}

.actor circle,
.actor line {
  stroke: var(--color-accent);
  stroke-width: 2.5;
}

.use-case-notes {
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border);
}

.use-case-notes summary {
  color: var(--color-muted);
  font-size: 0.8rem;
  font-weight: 750;
  cursor: pointer;
}

.use-case-notes dl {
  display: grid;
  gap: var(--space-3);
  margin: var(--space-4) 0 0;
}

.use-case-notes div {
  display: grid;
  grid-template-columns: minmax(8rem, 0.35fr) minmax(0, 1fr);
  gap: var(--space-3);
}

.use-case-notes dt {
  color: var(--color-text);
  font-weight: 800;
}

.use-case-notes dd {
  margin: 0;
  color: var(--color-muted);
}

@media (max-width: 680px) {
  .use-case-diagram {
    padding: var(--space-5);
  }

  .scroll-hint {
    display: block;
  }

  .use-case-notes div {
    grid-template-columns: 1fr;
    gap: var(--space-2);
  }
}
</style>
