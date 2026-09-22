<template>
  <figure class="topology-diagram" :aria-label="diagram.ariaLabel">
    <figcaption>
      <strong>{{ diagram.title }}</strong>
      <span>{{ diagram.description }}</span>
    </figcaption>

    <p class="scroll-hint">좌우로 스크롤해 전체 배치를 확인할 수 있습니다.</p>

    <div class="topology-viewport">
      <svg
        class="topology-canvas"
        :viewBox="`0 0 ${canvas.width} ${canvas.height}`"
        role="img"
        :aria-label="diagram.ariaLabel"
      >
        <title>{{ diagram.ariaLabel }}</title>

        <g class="groups" aria-hidden="true">
          <g v-for="group in layout.groups" :key="group.id">
            <rect
              class="group-box"
              :x="group.x"
              :y="group.y"
              :width="group.width"
              :height="group.height"
              rx="18"
            />
            <text class="group-label" :x="group.x + 18" :y="group.y + 28">{{ group.label }}</text>
            <text v-if="group.caption" class="group-caption" :x="group.x + 18" :y="group.y + 48">
              {{ group.caption }}
            </text>
          </g>
        </g>

        <g class="links" aria-hidden="true">
          <g v-for="link in layout.links" :key="link.key" :class="['link', `link-${link.kind}`]">
            <line :x1="link.x1" :y1="link.y1" :x2="link.x2" :y2="link.y2" />
            <polygon :points="link.head" />
            <polygon v-if="link.tail" :points="link.tail" />
          </g>
        </g>

        <g class="link-labels" aria-hidden="true">
          <g v-for="link in layout.links" :key="`${link.key}-label`" class="link-label">
            <rect
              :x="link.label.x - link.label.width / 2"
              :y="link.label.y - link.label.height / 2"
              :width="link.label.width"
              :height="link.label.height"
              rx="8"
            />
            <text :x="link.label.x" :y="link.label.y" text-anchor="middle">
              <tspan
                v-for="(line, index) in link.label.lines"
                :key="line"
                :x="link.label.x"
                :dy="index === 0 ? firstLineOffset(link.label.lines.length) : LINE_HEIGHT"
              >{{ line }}</tspan>
            </text>
          </g>
        </g>

        <g class="nodes" aria-hidden="true">
          <g v-for="node in layout.nodes" :key="node.id">
            <rect
              class="node-box"
              :x="node.x"
              :y="node.y"
              :width="node.width"
              :height="node.height"
              rx="14"
            />
            <text class="node-label" :x="node.cx" :y="node.cy + 6" text-anchor="middle">
              {{ node.label }}
            </text>
          </g>
        </g>
      </svg>
    </div>

    <details class="topology-notes">
      <summary>구성 요소와 경로 설명</summary>
      <dl>
        <div v-for="node in layout.nodes" :key="`${node.id}-detail`">
          <dt>{{ node.groupLabel }} · {{ node.label }}</dt>
          <dd>{{ node.detail }}</dd>
        </div>
        <div v-for="link in layout.links" :key="`${link.key}-detail`">
          <dt>{{ link.fromLabel }} {{ link.bidirectional ? '↔' : '→' }} {{ link.toLabel }}</dt>
          <dd>{{ link.note || link.rawLabel }}</dd>
        </div>
      </dl>
    </details>
  </figure>
</template>

<script setup lang="ts">
interface TopologyNode {
  id: string
  label: string
  detail: string
}

interface TopologyGroup {
  id: string
  label: string
  caption?: string
  nodes: TopologyNode[]
}

interface TopologyLink {
  from: string
  to: string
  label: string
  kind?: string
  bidirectional?: boolean
  note?: string
}

interface TopologyDiagram {
  kind: string
  title: string
  description: string
  ariaLabel: string
  groups: TopologyGroup[]
  links: TopologyLink[]
}

const props = defineProps<{
  diagram: TopologyDiagram
}>()

const PADDING_X = 28
const PADDING_Y = 26
const GROUP_WIDTH = 250
const GROUP_GAP = 180
const GROUP_HEADER = 68
const GROUP_FOOTER = 24
const NODE_INSET = 18
const NODE_HEIGHT = 74
const NODE_GAP = 78
const LINE_HEIGHT = 16
const PARALLEL_GAP = 44

const firstLineOffset = (lines: number) => -((lines - 1) * LINE_HEIGHT) / 2

const textWidth = (line: string) =>
  [...line].reduce((total, char) => total + (/[\u1100-\uD7A3\u3000-\u303F\uFF00-\uFF60]/.test(char) ? 12.6 : 6.8), 0)

const wrapLabel = (label: string, maxWidth = 150) => {
  const words = label.split(' ')
  const lines: string[] = []
  let current = ''

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word
    if (current && textWidth(candidate) > maxWidth) {
      lines.push(current)
      current = word
    }
    else {
      current = candidate
    }
  }

  if (current) {
    lines.push(current)
  }

  return lines
}

const groupHeight = (group: TopologyGroup) =>
  GROUP_HEADER + group.nodes.length * NODE_HEIGHT + (group.nodes.length - 1) * NODE_GAP + GROUP_FOOTER

const canvas = computed(() => {
  const columns = props.diagram.groups.length
  const tallest = Math.max(...props.diagram.groups.map(groupHeight))

  return {
    width: PADDING_X * 2 + columns * GROUP_WIDTH + (columns - 1) * GROUP_GAP,
    height: PADDING_Y * 2 + tallest
  }
})

const arrowHead = (x1: number, y1: number, x2: number, y2: number) => {
  const angle = Math.atan2(y2 - y1, x2 - x1)
  const length = 12
  const half = 5.5
  const baseX = x2 - length * Math.cos(angle)
  const baseY = y2 - length * Math.sin(angle)

  return [
    `${x2},${y2}`,
    `${baseX + half * Math.sin(angle)},${baseY - half * Math.cos(angle)}`,
    `${baseX - half * Math.sin(angle)},${baseY + half * Math.cos(angle)}`
  ].join(' ')
}

const layout = computed(() => {
  const tallest = Math.max(...props.diagram.groups.map(groupHeight))

  const groups = props.diagram.groups.map((group, index) => {
    const height = groupHeight(group)

    return {
      id: group.id,
      label: group.label,
      caption: group.caption,
      x: PADDING_X + index * (GROUP_WIDTH + GROUP_GAP),
      y: PADDING_Y + (tallest - height) / 2,
      width: GROUP_WIDTH,
      height,
      column: index
    }
  })

  const nodes = props.diagram.groups.flatMap((group, groupIndex) => {
    const box = groups[groupIndex]!

    return group.nodes.map((node, nodeIndex) => {
      const x = box.x + NODE_INSET
      const y = box.y + GROUP_HEADER + nodeIndex * (NODE_HEIGHT + NODE_GAP)
      const width = GROUP_WIDTH - NODE_INSET * 2

      return {
        id: node.id,
        label: node.label,
        detail: node.detail,
        groupId: group.id,
        groupLabel: group.label,
        column: groupIndex,
        x,
        y,
        width,
        height: NODE_HEIGHT,
        cx: x + width / 2,
        cy: y + NODE_HEIGHT / 2
      }
    })
  })

  const findNode = (id: string) => nodes.find(node => node.id === id)

  const parallelIndex = new Map<string, number>()
  const parallelTotal = new Map<string, number>()

  for (const link of props.diagram.links) {
    const key = [link.from, link.to].sort().join('~')
    parallelTotal.set(key, (parallelTotal.get(key) || 0) + 1)
  }

  const links = props.diagram.links.map((link, index) => {
    const from = findNode(link.from)
    const to = findNode(link.to)

    if (!from || !to) {
      return null
    }

    const key = [link.from, link.to].sort().join('~')
    const order = parallelIndex.get(key) || 0
    parallelIndex.set(key, order + 1)
    const offset = (order - ((parallelTotal.get(key) || 1) - 1) / 2) * PARALLEL_GAP

    const sameColumn = from.column === to.column
    let x1: number
    let y1: number
    let x2: number
    let y2: number

    if (sameColumn) {
      const downward = to.cy > from.cy
      x1 = from.cx + offset
      y1 = downward ? from.y + from.height : from.y
      x2 = to.cx + offset
      y2 = downward ? to.y : to.y + to.height
    }
    else {
      const rightward = to.column > from.column
      x1 = rightward ? from.x + from.width : from.x
      y1 = from.cy + offset
      x2 = rightward ? to.x : to.x + to.width
      y2 = to.cy + offset
    }

    const lines = wrapLabel(link.label)
    const labelWidth = Math.max(...lines.map(textWidth)) + 20

    return {
      key: `${link.from}-${link.to}-${index}`,
      kind: link.kind || 'command',
      bidirectional: Boolean(link.bidirectional),
      rawLabel: link.label,
      note: link.note,
      fromLabel: from.label,
      toLabel: to.label,
      x1,
      y1,
      x2,
      y2,
      head: arrowHead(x1, y1, x2, y2),
      tail: link.bidirectional ? arrowHead(x2, y2, x1, y1) : null,
      label: {
        x: (x1 + x2) / 2,
        y: (y1 + y2) / 2,
        width: labelWidth,
        height: lines.length * LINE_HEIGHT + 12,
        lines
      }
    }
  }).filter(link => link !== null)

  return { groups, nodes, links }
})
</script>

<style scoped>
.topology-diagram {
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

.topology-viewport {
  width: 100%;
  min-width: 0;
  margin-top: var(--space-5);
  padding-bottom: var(--space-2);
  overflow-x: auto;
  overscroll-behavior-inline: contain;
}

.topology-canvas {
  display: block;
  width: 100%;
  min-width: 52rem;
  height: auto;
}

.group-box {
  fill: color-mix(in srgb, var(--color-bg) 72%, transparent);
  stroke: color-mix(in srgb, var(--color-accent) 40%, var(--color-border));
  stroke-width: 1.5;
  stroke-dasharray: 6 5;
}

.group-label {
  fill: var(--color-accent-strong);
  font-size: 15px;
  font-weight: 800;
}

.group-caption {
  fill: var(--color-muted);
  font-size: 12.5px;
  font-weight: 650;
}

.node-box {
  fill: var(--color-bg);
  stroke: var(--color-accent);
  stroke-width: 1.5;
}

.node-label {
  fill: var(--color-text);
  font-size: 15px;
  font-weight: 750;
}

.link line {
  stroke: color-mix(in srgb, var(--color-accent) 70%, transparent);
  stroke-width: 1.8;
}

.link polygon {
  fill: color-mix(in srgb, var(--color-accent) 70%, transparent);
}

.link-soft line {
  stroke: color-mix(in srgb, var(--color-muted) 70%, transparent);
  stroke-dasharray: 7 6;
}

.link-soft polygon {
  fill: color-mix(in srgb, var(--color-muted) 70%, transparent);
}

.link-label rect {
  fill: var(--color-bg);
  stroke: color-mix(in srgb, var(--color-border) 90%, transparent);
  stroke-width: 1;
}

.link-label text {
  fill: var(--color-text);
  font-size: 12.5px;
  font-weight: 700;
}

.topology-notes {
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border);
}

.topology-notes summary {
  color: var(--color-muted);
  font-size: 0.8rem;
  font-weight: 750;
  cursor: pointer;
}

.topology-notes dl {
  display: grid;
  gap: var(--space-3);
  margin: var(--space-4) 0 0;
}

.topology-notes div {
  display: grid;
  grid-template-columns: minmax(8rem, 0.35fr) minmax(0, 1fr);
  gap: var(--space-3);
}

.topology-notes dt {
  color: var(--color-text);
  font-weight: 800;
}

.topology-notes dd {
  margin: 0;
  color: var(--color-muted);
}

@media (max-width: 680px) {
  .topology-diagram {
    padding: var(--space-5);
  }

  .scroll-hint {
    display: block;
  }

  .topology-notes div {
    grid-template-columns: 1fr;
    gap: var(--space-2);
  }
}
</style>
