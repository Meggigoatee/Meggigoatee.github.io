<template>
  <section class="section">
    <div class="container prose-layout">
      <header>
        <p class="eyebrow">About</p>
        <h1>소개</h1>
      </header>

      <div class="prose">
        <p>{{ profile.summary }}</p>

        <h2>경력과 전문 분야</h2>
        <p>
          2023년 9월부터 약 3년 동안 카메라, 센서, AI 등 다양한 기술을 실제 사용자
          경험과 연결하는 인터랙티브 모바일 웹과 데스크탑 애플리케이션을 개발해 왔습니다.
          화면 안에서 끝나는 기능보다 물리적인 입력과 현장 환경에 반응하고, 사용자가 직접
          체험할 수 있는 서비스를 만드는 데 강점이 있습니다.
        </p>

        <h2>문제를 정의하는 방식</h2>
        <p>
          문제를 곧바로 프로그램 로직의 문제로 한정하지 않습니다. 사용자 경험, 현장 운영,
          일정과 커뮤니케이션, 기술적 제약을 함께 살펴보고 실제 목표를 막고 있는 원인이
          무엇인지 먼저 구분합니다. 해결해야 할 문제와 비즈니스 흐름을 명확히 이해한 뒤,
          그 흐름에 맞는 기술과 구현 방식을 선택합니다.
        </p>

        <h2>협업 방식</h2>
        <p>
          아이디어를 말과 문서로만 설명하기보다 빠르게 목업과 프로토타입을 만들어
          시각적으로 확인할 수 있는 자료로 공유합니다. 기획자, 디자이너, 현장 관계자가
          같은 결과물을 보며 요구사항과 동작을 확인할 수 있게 하고, 초기 단계부터 피드백을
          반영해 서로의 해석 차이와 뒤늦은 수정을 줄입니다.
        </p>

        <h2>개발 원칙</h2>
        <p>
          개별 로직을 구현하기 전에 서비스가 어떤 비즈니스 흐름으로 동작하는지 파악하는
          것을 중요하게 생각합니다. 각 기능이 누구를 위해 어떤 상황에서 사용되는지,
          앞뒤 단계와 운영 과정에 어떤 영향을 주는지 이해해야 유지보수하기 쉽고 실제
          목적에 맞는 소프트웨어를 만들 수 있다고 믿습니다.
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
