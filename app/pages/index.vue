<template>
  <div>
    <section class="hero section">
      <div class="container hero-grid">
        <div>
          <div class="identity-row">
            <div class="profile-photo-frame">
              <img
                class="profile-photo"
                src="/images/profile.jpg"
                alt="설준찬 프로필 사진"
                width="591"
                height="787"
              >
            </div>

            <div class="identity-copy">
              <p class="eyebrow">{{ profile.role }}</p>
              <h1>
                <span>{{ profile.name }}</span>
                <span class="english-name">{{ profile.englishName }}</span>
              </h1>
            </div>
          </div>
          <p class="hero-copy">
            {{ profile.summary }}
          </p>

          <div class="hero-actions">
            <NuxtLink class="button button-primary" to="/projects">
              프로젝트 보기
            </NuxtLink>
            <button
              ref="contactTrigger"
              class="button button-secondary"
              type="button"
              aria-haspopup="dialog"
              :aria-expanded="isContactOpen"
              @click="openContact"
            >
              연락하기
            </button>
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
            show-detail-link
          />
        </div>
      </div>
    </section>

    <Teleport to="body">
      <div
        v-if="isContactOpen"
        class="contact-overlay"
        @click.self="closeContact"
        @keydown.esc="closeContact"
      >
        <section
          ref="contactDialog"
          class="contact-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-dialog-title"
          @keydown.tab="trapContactFocus"
        >
          <div class="contact-dialog-header">
            <div>
              <p class="eyebrow">Contact</p>
              <h2 id="contact-dialog-title">연락하기</h2>
            </div>
            <button
              ref="contactClose"
              class="contact-close"
              type="button"
              aria-label="연락처 팝업 닫기"
              @click="closeContact"
            >
              ×
            </button>
          </div>

          <p class="contact-intro">
            이메일 또는 전화번호를 복사해 연락해 주세요.
          </p>

          <dl class="contact-list">
            <div>
              <dt>이메일</dt>
              <dd>{{ profile.email }}</dd>
              <button
                type="button"
                :class="{ 'is-copied': copiedField === 'email' }"
                :aria-label="copiedField === 'email' ? '이메일 복사 완료' : '이메일 복사'"
                @click="copyContact('email', profile.email)"
              >
                {{ copiedField === 'email' ? '✓' : '복사' }}
              </button>
            </div>
            <div>
              <dt>전화번호</dt>
              <dd>{{ profile.phone }}</dd>
              <button
                type="button"
                :class="{ 'is-copied': copiedField === 'phone' }"
                :aria-label="copiedField === 'phone' ? '전화번호 복사 완료' : '전화번호 복사'"
                @click="copyContact('phone', profile.phone)"
              >
                {{ copiedField === 'phone' ? '✓' : '복사' }}
              </button>
            </div>
          </dl>

          <p class="copy-status" aria-live="polite">
            {{ copyStatus }}
          </p>
        </section>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { profile } from '~/data/profile'

type ContactField = 'email' | 'phone'

const isContactOpen = ref(false)
const copiedField = ref<ContactField | null>(null)
const copyStatus = ref('')
const contactTrigger = ref<HTMLButtonElement | null>(null)
const contactClose = ref<HTMLButtonElement | null>(null)
const contactDialog = ref<HTMLElement | null>(null)

const openContact = async () => {
  copiedField.value = null
  copyStatus.value = ''
  isContactOpen.value = true
  await nextTick()
  contactClose.value?.focus()
}

const closeContact = async () => {
  isContactOpen.value = false
  copiedField.value = null
  copyStatus.value = ''
  await nextTick()
  contactTrigger.value?.focus()
}

const copyContact = async (field: ContactField, value: string) => {
  try {
    await navigator.clipboard.writeText(value)
    copiedField.value = field
    copyStatus.value = `${field === 'email' ? '이메일' : '전화번호'}을 복사했습니다.`
  } catch {
    copiedField.value = null
    copyStatus.value = '복사하지 못했습니다. 연락처를 직접 선택해 복사해 주세요.'
  }
}

const trapContactFocus = (event: KeyboardEvent) => {
  const focusableElements = contactDialog.value?.querySelectorAll<HTMLElement>('button')

  if (!focusableElements?.length) {
    return
  }

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault()
    lastElement?.focus()
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault()
    firstElement?.focus()
  }
}

const { data: featuredProjects } = await useAsyncData('featured-projects', () => {
  return queryCollection('projects')
    .where('featured', '=', true)
    .order('order', 'ASC')
    .all()
})

useSeoMeta({
  title: `${profile.name} ${profile.englishName} | ${profile.role}`,
  description: profile.summary,
  ogTitle: `${profile.name} ${profile.englishName} | ${profile.role}`,
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
  margin: 0;
  font-size: clamp(2.25rem, 6.5vw, 5.5rem);
  line-height: 0.95;
  letter-spacing: -0.03em;
}

h1 span {
  display: block;
  white-space: nowrap;
}

.english-name {
  margin-top: 0.08em;
  font-size: 0.68em;
  letter-spacing: -0.015em;
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

.hero-actions button {
  cursor: pointer;
  font: inherit;
}

.identity-row {
  display: flex;
  align-items: center;
  gap: clamp(var(--space-4), 3vw, var(--space-6));
  margin: 0 0 var(--space-5);
}

.identity-copy {
  min-width: 0;
}

.identity-copy .eyebrow {
  margin-bottom: var(--space-3);
}

.profile-photo-frame {
  flex: 0 0 auto;
  width: clamp(10.5rem, 15vw, 13rem);
  aspect-ratio: 1;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: 50%;
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
}

.profile-photo {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 20%;
}

.skill-panel {
  width: 100%;
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

.contact-overlay {
  position: fixed;
  z-index: 100;
  inset: 0;
  display: grid;
  place-items: center;
  padding: var(--space-5);
  background: rgb(9 13 22 / 68%);
  backdrop-filter: blur(8px);
}

.contact-dialog {
  width: min(100%, 30rem);
  padding: var(--space-6);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  box-shadow: 0 2rem 6rem rgb(0 0 0 / 35%);
  animation: contact-dialog-in 180ms ease-out;
}

.contact-dialog-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-5);
}

.contact-dialog h2 {
  margin: var(--space-2) 0 0;
  font-size: clamp(1.6rem, 5vw, 2.1rem);
  line-height: 1.1;
}

.contact-close {
  display: grid;
  width: 2.6rem;
  height: 2.6rem;
  flex: 0 0 auto;
  place-items: center;
  padding: 0;
  border: 1px solid var(--color-border);
  border-radius: 50%;
  background: var(--color-bg);
  color: var(--color-text);
  cursor: pointer;
  font: inherit;
  font-size: 1.5rem;
  line-height: 1;
}

.contact-intro {
  margin: var(--space-4) 0 0;
  color: var(--color-muted);
}

.contact-list {
  display: grid;
  gap: var(--space-3);
  margin: var(--space-5) 0 0;
}

.contact-list > div {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.15rem var(--space-4);
  padding: var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: 0.9rem;
  background: var(--color-bg);
}

.contact-list dt {
  grid-column: 1;
  color: var(--color-muted);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.contact-list dd {
  grid-column: 1;
  margin: 0;
  overflow-wrap: anywhere;
  font-weight: 750;
}

.contact-list button {
  grid-row: 1 / 3;
  grid-column: 2;
  align-self: center;
  min-width: 4rem;
  padding: 0.55rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 0.65rem;
  background: var(--color-accent-soft);
  color: var(--color-accent-strong);
  cursor: pointer;
  font: inherit;
  font-size: 0.82rem;
  font-weight: 800;
  transition:
    border-color 160ms ease,
    background-color 160ms ease,
    color 160ms ease,
    box-shadow 160ms ease;
}

.contact-list button.is-copied {
  border-color: color-mix(in srgb, #22c55e 55%, var(--color-border));
  background: color-mix(in srgb, #22c55e 18%, var(--color-surface));
  color: color-mix(in srgb, #16a34a 75%, var(--color-text));
  box-shadow: 0 0 0 3px color-mix(in srgb, #22c55e 14%, transparent);
  font-size: 1rem;
}

.copy-status {
  min-height: 1.5rem;
  margin: var(--space-3) 0 0;
  color: var(--color-accent);
  font-size: 0.85rem;
}

@keyframes contact-dialog-in {
  from {
    opacity: 0;
    transform: translateY(0.75rem) scale(0.98);
  }
}

@media (max-width: 900px) {
  .hero-grid {
    grid-template-columns: 1fr;
    gap: var(--space-8);
  }

  .profile-photo-frame {
    width: clamp(6.25rem, 28vw, 8rem);
  }
}
</style>
