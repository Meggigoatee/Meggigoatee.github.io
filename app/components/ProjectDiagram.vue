<template>
  <figure class="diagram" :aria-label="diagram.ariaLabel">
    <figcaption>
      <strong>{{ diagram.title }}</strong>
      <span>{{ diagram.description }}</span>
    </figcaption>

    <p class="scroll-hint">좌우로 스크롤해 전체 흐름을 확인할 수 있습니다.</p>

    <div class="sequence-viewport">
      <div class="sequence-chart" :style="chartStyle">
        <ol class="sequence-participants" :style="gridStyle" aria-label="참여 구성 요소">
          <li v-for="(participant, index) in participants" :key="participant.id">
            <span aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
            <strong>{{ participant.label }}</strong>
          </li>
        </ol>

        <div class="sequence-body">
          <div class="sequence-lifelines" :style="gridStyle" aria-hidden="true">
            <span v-for="participant in participants" :key="`${participant.id}-lifeline`" />
          </div>

          <ol class="sequence-messages" aria-label="메시지 순서">
            <li
              v-for="(message, index) in messages"
              :key="`${message.from}-${message.to}-${message.label}`"
              class="sequence-message-row"
              :style="gridStyle"
            >
              <div
                class="sequence-message"
                :class="{ 'sequence-message-reverse': message.fromIndex > message.toIndex }"
                :style="messageStyle(message)"
              >
                <span class="sequence-label">
                  <b aria-hidden="true">{{ index + 1 }}</b>
                  {{ message.label }}
                </span>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </div>

    <details class="participant-notes">
      <summary>구성 요소 설명</summary>
      <dl>
        <div v-for="participant in participants" :key="`${participant.id}-detail`">
          <dt>{{ participant.label }}</dt>
          <dd>{{ participant.detail }}</dd>
        </div>
      </dl>
    </details>
  </figure>
</template>

<script setup lang="ts">
interface DiagramStep {
  id: string
  label: string
  detail: string
}

interface DiagramEdge {
  from: string
  to: string
  label: string
}

interface Diagram {
  kind: string
  title: string
  description: string
  ariaLabel: string
  steps?: DiagramStep[]
  nodes?: DiagramStep[]
  edges?: DiagramEdge[]
}

const props = defineProps<{
  diagram: Diagram
}>()

const participants = computed(() => props.diagram.steps || props.diagram.nodes || [])
const edges = computed<DiagramEdge[]>(() => {
  if (props.diagram.edges?.length) {
    return props.diagram.edges
  }

  const steps = props.diagram.steps || []
  return steps.flatMap((step, index) => {
    const nextStep = steps[index + 1]
    return nextStep
      ? [{ from: step.id, to: nextStep.id, label: nextStep.detail }]
      : []
  })
})

const messages = computed(() => edges.value.map(edge => ({
  ...edge,
  fromIndex: participants.value.findIndex(participant => participant.id === edge.from),
  toIndex: participants.value.findIndex(participant => participant.id === edge.to)
})).filter(message => message.fromIndex >= 0 && message.toIndex >= 0))

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${participants.value.length}, minmax(7.5rem, 1fr))`
}))

const chartStyle = computed(() => ({
  minWidth: `${Math.max(participants.value.length * 8.25, 34)}rem`
}))

const messageStyle = (message: { fromIndex: number, toIndex: number }) => ({
  gridColumn: `${Math.min(message.fromIndex, message.toIndex) + 1} / ${Math.max(message.fromIndex, message.toIndex) + 2}`
})
</script>

<style scoped>
.diagram {
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

.sequence-viewport {
  width: 100%;
  min-width: 0;
  overflow-x: auto;
  margin-top: var(--space-6);
  padding-bottom: var(--space-3);
  overscroll-behavior-inline: contain;
}

.sequence-chart {
  padding-top: var(--space-2);
}

.sequence-participants,
.sequence-lifelines,
.sequence-message-row {
  display: grid;
  gap: var(--space-2);
}

.sequence-participants {
  margin: 0;
  padding: 0;
  list-style: none;
}

.sequence-participants li {
  position: relative;
  display: grid;
  min-height: 4.5rem;
  place-items: center;
  padding: var(--space-3);
  border: 1px solid color-mix(in srgb, var(--color-accent) 45%, var(--color-border));
  border-radius: 0.75rem;
  background: var(--color-bg);
  text-align: center;
}

.sequence-participants li > span {
  position: absolute;
  top: 0.35rem;
  left: 0.45rem;
  color: var(--color-accent);
  font-size: 0.65rem;
  font-weight: 850;
}

.sequence-participants strong {
  font-size: 0.82rem;
  line-height: 1.35;
}

.sequence-body {
  position: relative;
  padding: var(--space-4) 0 var(--space-2);
}

.sequence-lifelines {
  position: absolute;
  inset: 0;
}

.sequence-lifelines span {
  position: relative;
}

.sequence-lifelines span::before {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  border-left: 1px dashed color-mix(in srgb, var(--color-accent) 55%, transparent);
  content: '';
}

.sequence-messages {
  position: relative;
  z-index: 1;
  display: grid;
  gap: var(--space-3);
  margin: 0;
  padding: 0;
  list-style: none;
}

.sequence-message-row {
  min-height: 4rem;
}

.sequence-message {
  position: relative;
  height: 2px;
  margin: 2.25rem 3.75rem 0;
  background: var(--color-accent);
}

.sequence-message::after {
  position: absolute;
  top: 50%;
  right: -0.15rem;
  width: 0.55rem;
  height: 0.55rem;
  border-top: 2px solid var(--color-accent);
  border-right: 2px solid var(--color-accent);
  content: '';
  transform: translateY(-50%) rotate(45deg);
}

.sequence-message-reverse::after {
  right: auto;
  left: -0.15rem;
  transform: translateY(-50%) rotate(-135deg);
}

.sequence-label {
  position: absolute;
  bottom: 0.45rem;
  left: 50%;
  display: inline-flex;
  width: max-content;
  max-width: 10rem;
  align-items: center;
  gap: 0.35rem;
  padding: 0.2rem 0.45rem;
  border-radius: 0.4rem;
  background: color-mix(in srgb, var(--color-surface) 94%, transparent);
  color: var(--color-text);
  font-size: 0.72rem;
  font-weight: 750;
  line-height: 1.35;
  text-align: center;
  transform: translateX(-50%);
}

.sequence-label b {
  display: grid;
  flex: 0 0 auto;
  width: 1.15rem;
  height: 1.15rem;
  place-items: center;
  border-radius: 50%;
  background: var(--color-accent);
  color: var(--color-bg);
  font-size: 0.6rem;
}

.participant-notes {
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border);
}

.participant-notes summary {
  color: var(--color-muted);
  font-size: 0.8rem;
  font-weight: 750;
  cursor: pointer;
}

.participant-notes dl {
  display: grid;
  gap: var(--space-3);
  margin: var(--space-4) 0 0;
}

.participant-notes div {
  display: grid;
  grid-template-columns: minmax(8rem, 0.35fr) minmax(0, 1fr);
  gap: var(--space-3);
}

.participant-notes dt {
  color: var(--color-text);
  font-weight: 800;
}

.participant-notes dd {
  margin: 0;
  color: var(--color-muted);
}

@media (max-width: 680px) {
  .diagram {
    padding: var(--space-5);
  }

  .scroll-hint {
    display: block;
  }

  .sequence-viewport {
    margin-top: var(--space-5);
  }

  .participant-notes div {
    grid-template-columns: 1fr;
    gap: var(--space-2);
  }
}
</style>
