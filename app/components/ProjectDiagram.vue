<template>
  <figure class="diagram" :aria-label="diagram.ariaLabel">
    <figcaption>
      <strong>{{ diagram.title }}</strong>
      <span>{{ diagram.description }}</span>
    </figcaption>
    <ol v-if="diagram.steps" :class="['diagram-steps', `diagram-steps-${diagram.kind}`]">
      <li v-for="(step, index) in diagram.steps" :key="step.id">
        <span class="step-number" aria-hidden="true">{{ index + 1 }}</span>
        <strong>{{ step.label }}</strong>
        <span>{{ step.detail }}</span>
      </li>
    </ol>
    <div v-else-if="diagram.nodes" class="diagram-system">
      <ul class="diagram-nodes">
        <li v-for="node in diagram.nodes" :key="node.id">
          <strong>{{ node.label }}</strong>
          <span>{{ node.detail }}</span>
        </li>
      </ul>
      <ul v-if="diagram.edges?.length" class="diagram-edges" aria-label="구성 요소 연결">
        <li v-for="edge in diagram.edges" :key="`${edge.from}-${edge.to}-${edge.label}`">
          <span>{{ nodeLabel(edge.from) }}</span>
          <span aria-hidden="true">→</span>
          <span>{{ nodeLabel(edge.to) }}</span>
          <small>{{ edge.label }}</small>
        </li>
      </ul>
    </div>
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

const nodeLabel = (id: string) => {
  return props.diagram.nodes?.find(node => node.id === id)?.label || id
}
</script>

<style scoped>
.diagram {
  margin: var(--space-8) 0 0;
  padding: var(--space-6);
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

figcaption span,
.diagram-steps li > span:last-child {
  color: var(--color-muted);
}

.diagram-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
  gap: var(--space-3);
  margin: var(--space-5) 0 0;
  padding: 0;
  list-style: none;
}

.diagram-steps li,
.diagram-nodes li {
  display: grid;
  gap: var(--space-2);
  min-height: 8rem;
  align-content: start;
  padding: var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: 0.9rem;
  background: var(--color-bg);
}

.diagram-nodes,
.diagram-edges {
  display: grid;
  gap: var(--space-3);
  margin: var(--space-5) 0 0;
  padding: 0;
  list-style: none;
}

.diagram-nodes {
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
}

.diagram-nodes li strong,
.diagram-nodes li span {
  display: block;
}

.diagram-nodes li span {
  margin-top: var(--space-2);
  color: var(--color-muted);
  font-size: 0.85rem;
}

.diagram-edges li {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  gap: var(--space-2);
  align-items: center;
  padding: var(--space-3);
  border-top: 1px solid var(--color-border);
}

.diagram-edges small {
  grid-column: 1 / -1;
  color: var(--color-muted);
}

.step-number {
  display: grid;
  width: 1.75rem;
  height: 1.75rem;
  place-items: center;
  border-radius: 50%;
  background: var(--color-accent);
  color: var(--color-bg);
  font-size: 0.75rem;
  font-weight: 850;
}

.diagram-steps li > span:last-child {
  font-size: 0.85rem;
  line-height: 1.5;
}
</style>
