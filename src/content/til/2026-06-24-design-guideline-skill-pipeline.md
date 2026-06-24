---
title: 디자인 가이드라인 작성용 재사용 스킬을 설계하기 시작했다
date: 2026-06-24
tags: [claude, skills, design-system, workflow]
---

디자인 가이드라인을 정의하는 일은 매번 비슷한 구조를 반복한다. 그래서 매번 새로 시작하지 말고, **재사용 가능한 "내 표준 가이드라인 구조" 스킬**로 박제하기로 했다.

**오늘 한 것**

- Matt Pocock의 스킬 저장소([github.com/mattpocock/skills](https://github.com/mattpocock/skills))를 탐구하고, 설치했다.
- 여기 있는 `grill-with-docs` 같은 스킬과 앤트로픽 공식 `design-system` 스킬을 **재료로 삼아**, 디자인 가이드라인 작성용 나만의 스킬을 만들기로 했다.

**핵심 아이디어 — "구조"를 스킬로 박제**

- 가장 큰 비효율은 매번 *"어떤 내용을 다룰지, 어떻게 구성할지"* 를 멘땅에서 다시 정하는 것.
- 그동안 만든 가이드라인들의 공통 뼈대(섹션 구성, 다뤄야 할 항목, 예시 화면 패턴)를 `/write-a-skill`로 커스텀 스킬화하면, 다음부터는 그 스킬을 부르는 것으로 표준 구조가 자동으로 깔린다.
- → "그동안 잘한 구성을 참고해서" 매번 재사용하는 가장 확실한 자동화 방식.

**한 가이드라인을 만드는 단계별 스킬**

| 단계 | 스킬 | 역할 |
| --- | --- | --- |
| 무엇을 다룰지 정렬 | `/grill-with-docs` (Matt) | 다룰 항목을 짚어내는 질문으로 확정 + 용어/결정 문서 자동 생성 |
| 구조 참고 문서화 | `design:design-system` | 디자인 시스템을 문서화·확장하는 전용 스킬 (가이드라인 구성의 분해) |
| 예시 화면 만들기 | `figma:figma-generate-design` / `figma:figma-generate-library` | Figma에 실제 예시 화면·라이브러리 생성 |
| 프로토타입 | `/prototype` (Matt) | 토글 가능한 UI 변형 여러 개를 한 레이아웃에서 비교 |
| 품질 점검 | `design:design-critique`, `design:accessibility-review`, `design:ux-copy` | 위계·일관성·접근성·문구 검수 |

**추천 파이프라인**

```
(1회) /write-a-skill → 내 표준 가이드라인 구조 스킬 생성

매번: /my-guideline-skill → /grill-with-docs → design:design-system
      → figma-generate-design (예시) → /prototype → design:design-critique
```

> DS에서 Figma 기반 디자인 시스템 작업을 하니까, claymint(컴포넌트/토큰)랑 Figma MCP도 연결해두면 예시 화면 만들 때 기존 디자인 시스템을 바로 꿰어 올 수 있다.

**반전 — 그 스킬, Cowork엔 이미 있었다 😱**

`--agent '*'`로 모든 앱에 깔리는지 확인하다가, **앱마다 스킬 폴더가 다르다**는 걸 또 한 번 체감했다.

- `grill-with-docs`가 Cowork에서 "없는 스킬"로 뜬다. `npx skills add`는 Claude Code 계열 폴더(`~/.claude/skills`, `~/.agents/skills` 등)에만 깔렸고, **Cowork는 자기 전용 위치**(`.../local-agent-mode-sessions/skills-plugin/`)에서 Anthropic이 관리하는 플러그인/마켓플레이스 스킬을 로드한다. 즉 `npx skills` CLI는 Cowork를 설치 대상으로 인식하지 못한다.
- 그런데 그 Cowork 스킬 목록을 열어보니 — `brand-guidelines`, `canvas-design`, `docx`, `pdf`, `pptx`, `mcp-builder`, `skill-creator`, `setup-cowork`, 그리고 **`design-guideline-builder`** 가 떡하니 있었다.

`design-guideline-builder` 설명을 보면:

> "우아한형제들(?)에서 디자인 시스템의 가이드라인 문서를 표준 구조에 맞춰 작성하도록 돕는 스킬. 컴포넌트/UX 패턴 가이드라인을 새로 만들거나 기존 걸 표준 뼈대에 맞춰 정리·검토…"

이게 바로 우리가 *"0단계에서 `/write-a-skill`로 만들자"* 했던 표준 구조 스킬이다. **만들려던 게 Cowork엔 이미 들어 있었다.**

**배운 것**

- 새 스킬을 만들기 전에 **이미 깔린 스킬 목록부터 뒤져보자.** 특히 Cowork는 Claude Code와 폴더가 달라서 `npx skills`로 깐 것만 보면 절반만 보는 셈.
- 그래도 헛수고는 아니었다 — 직접 파이프라인을 그려본 덕에 기성 `design-guideline-builder`가 뭘 해주는지, 어디에 `grill-with-docs`/`design-critique`를 끼울지 바로 판단이 선다.
