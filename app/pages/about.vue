<template>
  <section class="section">
    <div class="container prose-layout about-layout">
      <header class="about-heading">
        <p class="eyebrow">About</p>
        <h1>소개</h1>
      </header>

      <div class="about-intro prose">
        <p>{{ profile.summary }}</p>

        <h2>경력과 전문 분야</h2>
        <p>
          2023년 9월부터 약 3년 동안 카메라, 센서, AI 등 다양한 기술을 실제 사용자
          경험과 연결하는 인터랙티브 모바일 웹과 데스크탑 애플리케이션을 개발해 왔습니다.
          화면 안에서 끝나는 기능보다 물리적인 입력과 현장 환경에 반응하고, 사용자가 직접
          체험할 수 있는 서비스를 만드는 데 강점이 있습니다.
        </p>
      </div>

      <section class="field-work prose" aria-labelledby="field-work-heading">
        <h2 id="field-work-heading">현장이 달라도, 끝까지 직접 확인합니다</h2>
        <p>
          전시 공간, 체험형 설치물, 키오스크처럼 환경이 다른 현장에서도 직접 장비를
          연결하고, 기능을 테스트하며, 실제 운영에 맞게 조정합니다. 소프트웨어와
          하드웨어, 설치 환경을 함께 살펴 문제의 원인을 찾고 해결합니다.
          어디에서든 사용자가 안정적으로 체험할 수 있도록, 개발부터 현장 적용까지
          책임 있게 마무리하는 것이 제 일의 기준입니다.
        </p>
      </section>

      <div class="field-gallery prose">
        <figure v-for="photo in fieldPhotos" :key="photo.src">
          <img
            :src="`${baseURL}${photo.src}`"
            :alt="photo.alt"
            :width="photo.width"
            :height="photo.height"
            loading="lazy"
            decoding="async"
          >
          <figcaption>{{ photo.caption }}</figcaption>
        </figure>
      </div>

      <div class="about-details prose">
        <section>
          <h2>문제를 정의하는 방식</h2>
          <p>
            문제를 곧바로 프로그램 로직의 문제로 한정하지 않습니다. 사용자 경험, 현장 운영,
            일정과 커뮤니케이션, 기술적 제약을 함께 살펴보고 실제 목표를 막고 있는 원인이
            무엇인지 먼저 구분합니다. 해결해야 할 문제와 비즈니스 흐름을 명확히 이해한 뒤,
            그 흐름에 맞는 기술과 구현 방식을 선택합니다.
          </p>
        </section>

        <section>
          <h2>협업 방식</h2>
          <p>
            아이디어를 말과 문서로만 설명하기보다 빠르게 목업과 프로토타입을 만들어
            시각적으로 확인할 수 있는 자료로 공유합니다. 기획자, 디자이너, 현장 관계자가
            같은 결과물을 보며 요구사항과 동작을 확인할 수 있게 하고, 초기 단계부터 피드백을
            반영해 서로의 해석 차이와 뒤늦은 수정을 줄입니다.
          </p>
        </section>

        <section>
          <h2>개발 원칙</h2>
          <p>
            개별 로직을 구현하기 전에 서비스가 어떤 비즈니스 흐름으로 동작하는지 파악하는
            것을 중요하게 생각합니다. 각 기능이 누구를 위해 어떤 상황에서 사용되는지,
            앞뒤 단계와 운영 과정에 어떤 영향을 주는지 이해해야 유지보수하기 쉽고 실제
            목적에 맞는 소프트웨어를 만들 수 있다고 믿습니다.
          </p>
        </section>

        <section>
          <h2>기술</h2>
          <dl class="skill-list">
            <div v-for="group in profile.skillGroups" :key="group.label">
              <dt>{{ group.label }}</dt>
              <dd>{{ group.skills.join(' · ') }}</dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { profile } from '~/data/profile'

const baseURL = useRuntimeConfig().app.baseURL.replace(/\/$/, '')
const fieldPhotos = [
  {
    src: '/images/about-field-interaction.webp',
    alt: '전시 화면 앞에서 테이블 위 체험 요소를 직접 확인하는 모습',
    caption: '체험 현장에서 직접 동작 확인',
    width: 1600,
    height: 1200
  },
  {
    src: '/images/about-field-development.webp',
    alt: '현장에서 노트북으로 콘텐츠 화면을 확인하며 작업하는 모습',
    caption: '설치 환경에 맞춘 개발과 조정',
    width: 1200,
    height: 1600
  },
  {
    src: '/images/about-field-system.webp',
    alt: '현장 장비함의 모니터와 연결된 시스템 옆에서 점검하는 모습',
    caption: '장비와 운영 상태까지 점검',
    width: 1200,
    height: 1600
  }
]

useSeoMeta({
  title: `소개 | ${profile.name}`,
  description: profile.summary
})
</script>

<style scoped>
.about-layout {
  grid-template-areas:
    'heading intro'
    'photos field'
    'photos details';
  row-gap: var(--space-8);
  align-items: start;
}

.about-heading {
  grid-area: heading;
}

.about-intro {
  grid-area: intro;
}

.field-work {
  grid-area: field;
  word-break: keep-all;
}

.field-work h2,
.about-details h2 {
  margin-top: 0;
}

.field-work p,
.about-details p {
  margin-bottom: 0;
}

#field-work-heading {
  text-wrap: balance;
}

.field-gallery {
  grid-area: photos;
  display: grid;
  gap: var(--space-5);
}

.field-gallery figure {
  margin: 0;
}

.field-gallery img {
  width: 100%;
  height: auto;
  border: 1px solid var(--color-border);
  border-radius: 0.9rem;
}

.field-gallery figcaption {
  margin-top: var(--space-2);
  font-size: 0.85rem;
  line-height: 1.5;
}

.about-details {
  grid-area: details;
  display: grid;
  gap: var(--space-8);
  word-break: keep-all;
}

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

@media (max-width: 900px) {
  .about-layout {
    grid-template-columns: 1fr;
    grid-template-areas:
      'heading'
      'intro'
      'field'
      'photos'
      'details';
  }

  .field-gallery {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .field-gallery figure:first-child {
    grid-column: 1 / -1;
  }
}
</style>
