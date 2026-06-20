# Knowledge Hub Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stacy의 개인 지식창고 겸 포트폴리오 사이트를 만든다 — 내가 만든 스킬과 데일리 바이브코딩 산출물을 마크다운 파일로 모아 공개한다.

**Architecture:** Astro 정적 사이트. 콘텐츠는 `src/content/`의 마크다운 파일을 Astro 콘텐츠 컬렉션(타입 검증 포함)으로 읽는다. 파일 추가 = 페이지 자동 생성. 공통 `Layout.astro`가 다크 터미널 디자인 시스템을 모든 페이지에 적용한다. Vercel에 정적 배포.

**Tech Stack:** Astro 5, TypeScript, 콘텐츠 컬렉션(glob loader + zod schema), Google Fonts(JetBrains Mono + Nanum Gothic Coding), Vercel(정적).

## Global Constraints

- 룩앤필: 다크 터미널 + 모노스페이스 + 극단적 타이포 크기 대비. 흔한 AI 룩(보라 그라데이션·글래스모피즘·중앙정렬 SaaS) 금지.
- 컬러 토큰(정확값): 배경 `#0c0c0c` / 본문 `#ededed` / 흐림 `#6e6e6e` / 포인트 `#f0883e` / 경계선 `#2a2a2a`.
- 폰트 스택: `'JetBrains Mono', 'Nanum Gothic Coding', monospace`.
- 모든 페이지 모바일 대응 필수.
- 콘텐츠는 파일 기반(마크다운)만 사용. localStorage 금지.
- 공개 사이트 — 콘텐츠/코드/커밋에 사내 민감정보 금지.
- git identity: Stacy Kim / stacy.kim@woowahan.com.
- 검증 사이클: 정적 사이트이므로 각 태스크는 `npm run build` 성공 + 개발 서버 화면 확인으로 검증한다(단위테스트 대신).

---

## File Structure

```
knowledge-hub/
├── astro.config.mjs           # Astro 설정(site URL)
├── package.json
├── tsconfig.json
├── src/
│   ├── content.config.ts      # skills/vibe 컬렉션 스키마
│   ├── content/
│   │   ├── skills/            # 스킬 .md 파일들
│   │   └── vibe/             # 바이브 .md 파일들
│   ├── layouts/
│   │   └── Layout.astro      # 공통 셸 + 디자인 시스템 CSS
│   ├── components/
│   │   ├── IndexLabel.astro  # "001 —" 라벨
│   │   ├── SectionLink.astro # "→ SKILLS 12" 입구 링크
│   │   ├── SkillCard.astro
│   │   └── VibeCard.astro
│   └── pages/
│       ├── index.astro        # 홈/About
│       ├── skills/
│       │   ├── index.astro    # 스킬 목록
│       │   └── [slug].astro   # 스킬 상세
│       └── vibe/
│           ├── index.astro    # 바이브 갤러리
│           └── [slug].astro   # 바이브 상세
└── public/
    ├── skills/               # 다운로드용 .zip/.md
    └── vibe/                # 커버 이미지 등
```

---

## Task 1: Astro 프로젝트 스캐폴드 + 기본 설정

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`(기존 확인)
- Create: `src/pages/index.astro` (임시 플레이스홀더)

**Interfaces:**
- Consumes: 없음 (프로젝트 시작점)
- Produces: 동작하는 Astro 개발/빌드 환경. `npm run dev`(기본 4321 포트), `npm run build`(→ `dist/`).

- [ ] **Step 1: Astro 최소 프로젝트 생성**

`knowledge-hub` 폴더에서 빈 Astro 프로젝트를 만든다(기존 `docs/`, `.gitignore`, `.git` 유지). 대화형 프롬프트를 피하기 위해 수동 구성한다.

`package.json`:
```json
{
  "name": "knowledge-hub",
  "type": "module",
  "version": "0.0.1",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "astro": "^5.0.0"
  }
}
```

`astro.config.mjs`:
```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://knowledge-hub.vercel.app',
});
```

`tsconfig.json`:
```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 2: 의존성 설치**

Run: `cd /Users/stacy.kim/Documents/Claude/knowledge-hub && npm install`
Expected: `node_modules/` 생성, 에러 없음.

- [ ] **Step 3: 임시 홈 페이지 작성**

`src/pages/index.astro`:
```astro
---
---
<html lang="ko">
  <head><meta charset="utf-8" /><title>Knowledge Hub</title></head>
  <body>
    <h1>Knowledge Hub — 준비 중</h1>
  </body>
</html>
```

- [ ] **Step 4: 빌드 검증**

Run: `npm run build`
Expected: 성공, `dist/index.html` 생성. 에러 0.

- [ ] **Step 5: 커밋**

```bash
git add package.json astro.config.mjs tsconfig.json package-lock.json src/pages/index.astro
git commit -m "feat: Astro 프로젝트 스캐폴드"
```

---

## Task 2: 콘텐츠 컬렉션 스키마 + 시드 항목

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/skills/humanize-korean.md` (시드 1개)
- Create: `src/content/vibe/001-recipe-app.md` (시드 1개)
- Create: `public/vibe/001-recipe-app/cover.svg` (임시 커버 플레이스홀더)

**Interfaces:**
- Consumes: Task 1의 Astro 환경.
- Produces: `getCollection('skills')`, `getCollection('vibe')`로 조회 가능한 타입세이프 컬렉션. 항목 형태:
  - skill `.data`: `{ title:string, summary:string, tags:string[], download?:string }`, `.id`: slug 문자열
  - vibe `.data`: `{ title:string, day:number, date:Date, cover:string, liveUrl?:string, repoUrl?:string, tools:string[], oneLiner:string }`, `.id`: slug 문자열

- [ ] **Step 1: 스키마 정의**

`src/content.config.ts`:
```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const skills = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/skills' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    tags: z.array(z.string()).default([]),
    download: z.string().optional(),
  }),
});

const vibe = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/vibe' }),
  schema: z.object({
    title: z.string(),
    day: z.number(),
    date: z.coerce.date(),
    cover: z.string(),
    liveUrl: z.string().optional(),
    repoUrl: z.string().optional(),
    tools: z.array(z.string()).default([]),
    oneLiner: z.string(),
  }),
});

export const collections = { skills, vibe };
```

- [ ] **Step 2: 시드 스킬 파일 작성**

`src/content/skills/humanize-korean.md`:
```md
---
title: humanize-korean
summary: AI 티 나는 한글 텍스트를 자연스럽게 다듬는 스킬
tags: [글쓰기, 한글]
---
ChatGPT·Claude·Gemini가 쓴 한글은 특유의 번역투와 과한 접속사가 보입니다.
이 스킬은 그런 흔적을 걷어내고 사람이 쓴 것처럼 자연스럽게 만듭니다.

## 언제 쓰나
- AI 초안을 사람 글처럼 다듬을 때
- 보고서·아티클의 어색한 문장을 손볼 때
```

- [ ] **Step 3: 시드 바이브 파일 + 임시 커버 작성**

`src/content/vibe/001-recipe-app.md`:
```md
---
title: 유아식 레시피 앱
day: 12
date: 2026-06-07
cover: /vibe/001-recipe-app/cover.svg
tools: [Claude Code, Figma]
oneLiner: 냉장고 재료로 아기 메뉴를 추천하는 앱
---
회고: 재료 기반 추천 로직을 단순 규칙으로 시작했는데, 사용자가 가진 재료를
입력하면 만들 수 있는 메뉴를 거르는 흐름이 생각보다 직관적이었다.
```

`public/vibe/001-recipe-app/cover.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
  <rect width="800" height="500" fill="#0c0c0c"/>
  <text x="40" y="260" fill="#f0883e" font-family="monospace" font-size="40">유아식 레시피 앱</text>
  <text x="40" y="310" fill="#6e6e6e" font-family="monospace" font-size="20">day 12 — cover placeholder</text>
</svg>
```

- [ ] **Step 4: 빌드 검증 (스키마 통과 확인)**

Run: `npm run build`
Expected: 성공. 스키마 위반(필드 누락/타입 오류) 시 빌드가 실패하므로, 성공 = 스키마와 시드가 맞음.

- [ ] **Step 5: 커밋**

```bash
git add src/content.config.ts src/content/skills/humanize-korean.md src/content/vibe/001-recipe-app.md public/vibe/001-recipe-app/cover.svg
git commit -m "feat: 콘텐츠 컬렉션 스키마 + 시드 항목"
```

---

## Task 3: 공통 레이아웃 + 디자인 시스템 + 기본 컴포넌트

**Files:**
- Create: `src/layouts/Layout.astro`
- Create: `src/components/IndexLabel.astro`
- Create: `src/components/SectionLink.astro`

**Interfaces:**
- Consumes: Task 1 환경.
- Produces:
  - `Layout.astro` — props: `{ title: string }`. 슬롯에 페이지 본문. 전역 CSS(토큰·폰트·리셋) 포함. 모든 페이지가 import.
  - `IndexLabel.astro` — props: `{ n: string, label: string }`. 렌더: `001 — INDEX` 형태.
  - `SectionLink.astro` — props: `{ label: string, href: string, count?: number }`. 렌더: `→ SKILLS 12` 링크.

- [ ] **Step 1: Layout.astro 작성 (전역 디자인 시스템)**

`src/layouts/Layout.astro`:
```astro
---
interface Props { title: string; }
const { title } = Astro.props;
---
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Nanum+Gothic+Coding:wght@400;700&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <main>
      <slot />
    </main>
    <footer>
      <span>© Stacy — Knowledge Hub</span>
    </footer>
  </body>
</html>

<style is:global>
  :root {
    --bg: #0c0c0c;
    --fg: #ededed;
    --muted: #6e6e6e;
    --accent: #f0883e;
    --border: #2a2a2a;
    --font: 'JetBrains Mono', 'Nanum Gothic Coding', monospace;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { background: var(--bg); }
  body {
    background: var(--bg);
    color: var(--fg);
    font-family: var(--font);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }
  main { max-width: 880px; margin: 0 auto; padding: 64px 22px 96px; }
  a { color: var(--fg); text-decoration: none; }
  a:hover { color: var(--accent); }
  /* 타이포 리듬 */
  .display { font-size: clamp(48px, 11vw, 80px); line-height: 0.92; letter-spacing: -2px; font-weight: 700; }
  .label { font-size: 10px; letter-spacing: 4px; text-transform: uppercase; color: var(--muted); }
  .meta { font-size: 11px; color: var(--muted); }
  .accent { color: var(--accent); }
  footer { border-top: 1px solid var(--border); color: var(--muted); font-size: 10px; letter-spacing: 2px; text-transform: uppercase; padding: 24px 22px; max-width: 880px; margin: 0 auto; }
</style>
```

- [ ] **Step 2: IndexLabel.astro 작성**

`src/components/IndexLabel.astro`:
```astro
---
interface Props { n: string; label: string; }
const { n, label } = Astro.props;
---
<div class="label">{n} — {label}</div>
```

- [ ] **Step 3: SectionLink.astro 작성**

`src/components/SectionLink.astro`:
```astro
---
interface Props { label: string; href: string; count?: number; }
const { label, href, count } = Astro.props;
---
<a class="section-link" href={href}>
  → {label}{count !== undefined && <span class="count"> {count}</span>}
</a>
<style>
  .section-link { font-size: 13px; font-weight: 600; letter-spacing: 1px; }
  .count { color: var(--muted); }
</style>
```

- [ ] **Step 4: 빌드 검증**

Run: `npm run build`
Expected: 성공. (컴포넌트는 아직 미사용이라 페이지 변화는 없지만 컴파일 통과 확인.)

- [ ] **Step 5: 커밋**

```bash
git add src/layouts/Layout.astro src/components/IndexLabel.astro src/components/SectionLink.astro
git commit -m "feat: 공통 레이아웃 + 디자인 시스템 + 기본 컴포넌트"
```

---

## Task 4: 홈/About 페이지

**Files:**
- Modify: `src/pages/index.astro` (임시 → 실제)

**Interfaces:**
- Consumes: `Layout.astro`, `IndexLabel.astro`, `SectionLink.astro`(Task 3), `getCollection`(Task 2).
- Produces: `/` 홈 페이지. 섹션별 개수를 컬렉션 길이로 표시.

- [ ] **Step 1: 홈 페이지 작성**

`src/pages/index.astro`:
```astro
---
import Layout from '../layouts/Layout.astro';
import IndexLabel from '../components/IndexLabel.astro';
import SectionLink from '../components/SectionLink.astro';
import { getCollection } from 'astro:content';

const skills = await getCollection('skills');
const vibe = await getCollection('vibe');
---
<Layout title="Stacy — Knowledge Hub">
  <IndexLabel n="001" label="INDEX" />
  <p class="meta accent" style="margin-top:18px;">designer / daily builder</p>
  <h1 class="display" style="margin-top:4px;">I make<br />things,<br /><span style="color:var(--muted)">a lot.</span></h1>
  <p class="meta" style="margin-top:20px; line-height:1.9;">
    ↳ 스킬을 빚고, 매일 코딩하고,<br />&nbsp;&nbsp;&nbsp;만든 걸 여기 모은다.
  </p>
  <nav style="margin-top:40px; border-top:1px solid var(--border); padding-top:18px; display:flex; gap:28px; flex-wrap:wrap;">
    <SectionLink label="SKILLS" href="/skills" count={skills.length} />
    <SectionLink label="VIBE" href="/vibe" count={vibe.length} />
  </nav>
</Layout>
```

- [ ] **Step 2: 빌드 검증**

Run: `npm run build`
Expected: 성공. `dist/index.html`에 "I make things, a lot." 포함.

- [ ] **Step 3: 화면 확인**

Run: `npm run dev` 후 브라우저로 `http://localhost:4321/` 확인.
Expected: 다크 배경, 거대한 헤드라인 ↔ 작은 라벨 리듬, 하단 SKILLS/VIBE 링크에 개수(각 1) 표시. 모바일 폭에서도 헤드라인이 화면을 넘지 않음(clamp 적용).

- [ ] **Step 4: 커밋**

```bash
git add src/pages/index.astro
git commit -m "feat: 홈/About 페이지"
```

---

## Task 5: Skills 목록 + 상세 + 다운로드

**Files:**
- Create: `src/components/SkillCard.astro`
- Create: `src/pages/skills/index.astro`
- Create: `src/pages/skills/[slug].astro`

**Interfaces:**
- Consumes: `Layout`, `IndexLabel`(Task 3), `getCollection`/`render`(Task 2).
- Produces: `/skills` 목록, `/skills/<id>` 상세. 상세는 `download` 필드가 있으면 다운로드 링크 표시.

- [ ] **Step 1: SkillCard.astro 작성**

`src/components/SkillCard.astro`:
```astro
---
interface Props { id: string; title: string; summary: string; tags: string[]; }
const { id, title, summary, tags } = Astro.props;
---
<a class="skill-card" href={`/skills/${id}`}>
  <div class="row">
    <h3>{title}</h3>
    <span class="arrow">→</span>
  </div>
  <p class="summary">{summary}</p>
  {tags.length > 0 && <p class="tags">{tags.map((t) => `#${t}`).join('  ')}</p>}
</a>
<style>
  .skill-card { display:block; border-top:1px solid var(--border); padding:18px 0; }
  .skill-card:hover h3 { color: var(--accent); }
  .row { display:flex; justify-content:space-between; align-items:baseline; }
  h3 { font-size:18px; font-weight:600; }
  .arrow { color: var(--muted); }
  .summary { color: var(--fg); font-size:13px; margin-top:6px; }
  .tags { color: var(--muted); font-size:11px; margin-top:8px; letter-spacing:1px; }
</style>
```

- [ ] **Step 2: 스킬 목록 페이지 작성**

`src/pages/skills/index.astro`:
```astro
---
import Layout from '../../layouts/Layout.astro';
import IndexLabel from '../../components/IndexLabel.astro';
import SkillCard from '../../components/SkillCard.astro';
import { getCollection } from 'astro:content';

const skills = (await getCollection('skills')).sort((a, b) =>
  a.data.title.localeCompare(b.data.title)
);
---
<Layout title="Skills — Knowledge Hub">
  <a class="meta" href="/">← INDEX</a>
  <h1 class="display" style="margin-top:18px;">Skills.</h1>
  <p class="meta" style="margin-top:12px;">내가 만든 스킬 {skills.length}개 — 가져가서 쓰세요.</p>
  <div style="margin-top:36px;">
    {skills.map((s) => (
      <SkillCard id={s.id} title={s.data.title} summary={s.data.summary} tags={s.data.tags} />
    ))}
  </div>
</Layout>
```

- [ ] **Step 3: 스킬 상세 페이지 작성**

`src/pages/skills/[slug].astro`:
```astro
---
import Layout from '../../layouts/Layout.astro';
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const skills = await getCollection('skills');
  return skills.map((s) => ({ params: { slug: s.id }, props: { entry: s } }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);
---
<Layout title={`${entry.data.title} — Skills`}>
  <a class="meta" href="/skills">← SKILLS</a>
  <h1 class="display" style="margin-top:18px; font-size:clamp(36px,8vw,56px);">{entry.data.title}</h1>
  <p class="meta accent" style="margin-top:12px;">{entry.data.summary}</p>
  {entry.data.tags.length > 0 && (
    <p class="meta" style="margin-top:8px;">{entry.data.tags.map((t) => `#${t}`).join('  ')}</p>
  )}
  {entry.data.download && (
    <a class="download" href={entry.data.download} download>↓ 다운로드</a>
  )}
  <article class="prose">
    <Content />
  </article>
</Layout>
<style>
  .download { display:inline-block; margin-top:20px; border:1px solid var(--accent); color:var(--accent); padding:8px 16px; font-size:13px; }
  .download:hover { background:var(--accent); color:var(--bg); }
  .prose { margin-top:36px; border-top:1px solid var(--border); padding-top:24px; }
  .prose :global(h2) { font-size:16px; margin-top:24px; color:var(--accent); }
  .prose :global(p) { font-size:14px; margin-top:12px; }
  .prose :global(ul) { margin-top:12px; padding-left:20px; font-size:14px; }
  .prose :global(li) { margin-top:6px; }
</style>
```

- [ ] **Step 4: 빌드 검증**

Run: `npm run build`
Expected: 성공. `dist/skills/index.html` 및 `dist/skills/humanize-korean/index.html` 생성.

- [ ] **Step 5: 화면 확인**

Run: `npm run dev` 후 `/skills` → 카드 클릭 → 상세 확인.
Expected: 목록에 humanize-korean 카드, 상세에서 본문 렌더. (시드엔 `download` 없으므로 다운로드 버튼 미표시가 정상.)

- [ ] **Step 6: 커밋**

```bash
git add src/components/SkillCard.astro src/pages/skills/index.astro src/pages/skills/[slug].astro
git commit -m "feat: Skills 목록·상세·다운로드"
```

---

## Task 6: Vibe Coding 갤러리 + 상세

**Files:**
- Create: `src/components/VibeCard.astro`
- Create: `src/pages/vibe/index.astro`
- Create: `src/pages/vibe/[slug].astro`

**Interfaces:**
- Consumes: `Layout`, `IndexLabel`(Task 3), `getCollection`/`render`(Task 2).
- Produces: `/vibe` 썸네일 갤러리(day 내림차순), `/vibe/<id>` 상세(이미지·링크·도구·회고 본문).

- [ ] **Step 1: VibeCard.astro 작성**

`src/components/VibeCard.astro`:
```astro
---
interface Props { id: string; title: string; day: number; cover: string; oneLiner: string; }
const { id, title, day, cover, oneLiner } = Astro.props;
---
<a class="vibe-card" href={`/vibe/${id}`}>
  <div class="thumb"><img src={cover} alt={title} loading="lazy" /></div>
  <div class="info">
    <span class="meta">DAY {day}</span>
    <h3>{title}</h3>
    <p class="oneliner">{oneLiner}</p>
  </div>
</a>
<style>
  .vibe-card { display:block; border:1px solid var(--border); }
  .vibe-card:hover { border-color: var(--accent); }
  .thumb { aspect-ratio: 8/5; overflow:hidden; background:#000; }
  .thumb img { width:100%; height:100%; object-fit:cover; display:block; }
  .info { padding:14px 16px; }
  .info h3 { font-size:16px; font-weight:600; margin-top:4px; }
  .vibe-card:hover h3 { color: var(--accent); }
  .oneliner { font-size:12px; color:var(--muted); margin-top:6px; }
</style>
```

- [ ] **Step 2: 바이브 갤러리 페이지 작성**

`src/pages/vibe/index.astro`:
```astro
---
import Layout from '../../layouts/Layout.astro';
import VibeCard from '../../components/VibeCard.astro';
import { getCollection } from 'astro:content';

const vibe = (await getCollection('vibe')).sort((a, b) => b.data.day - a.data.day);
---
<Layout title="Vibe Coding — Knowledge Hub">
  <a class="meta" href="/">← INDEX</a>
  <h1 class="display" style="margin-top:18px;">Vibe<br />Coding.</h1>
  <p class="meta" style="margin-top:12px;">매일 만든 것들 — {vibe.length}개의 쇼케이스.</p>
  <div class="grid">
    {vibe.map((v) => (
      <VibeCard id={v.id} title={v.data.title} day={v.data.day} cover={v.data.cover} oneLiner={v.data.oneLiner} />
    ))}
  </div>
</Layout>
<style>
  .grid { margin-top:36px; display:grid; grid-template-columns:repeat(2, 1fr); gap:18px; }
  @media (max-width: 560px) { .grid { grid-template-columns: 1fr; } }
</style>
```

- [ ] **Step 3: 바이브 상세 페이지 작성**

`src/pages/vibe/[slug].astro`:
```astro
---
import Layout from '../../layouts/Layout.astro';
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const vibe = await getCollection('vibe');
  return vibe.map((v) => ({ params: { slug: v.id }, props: { entry: v } }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);
const d = entry.data;
const dateStr = d.date.toISOString().slice(0, 10);
---
<Layout title={`${d.title} — Vibe Coding`}>
  <a class="meta" href="/vibe">← VIBE</a>
  <p class="meta accent" style="margin-top:18px;">DAY {d.day} · {dateStr}</p>
  <h1 class="display" style="margin-top:4px; font-size:clamp(36px,8vw,56px);">{d.title}</h1>
  <p class="meta" style="margin-top:12px;">{d.oneLiner}</p>
  <img class="cover" src={d.cover} alt={d.title} />
  <div class="links">
    {d.liveUrl && <a class="btn" href={d.liveUrl} target="_blank" rel="noopener">↗ 라이브</a>}
    {d.repoUrl && <a class="btn" href={d.repoUrl} target="_blank" rel="noopener">↗ 저장소</a>}
  </div>
  {d.tools.length > 0 && <p class="meta" style="margin-top:16px;">TOOLS: {d.tools.join(' · ')}</p>}
  <article class="prose"><Content /></article>
</Layout>
<style>
  .cover { width:100%; margin-top:24px; border:1px solid var(--border); }
  .links { margin-top:18px; display:flex; gap:12px; }
  .btn { border:1px solid var(--accent); color:var(--accent); padding:8px 16px; font-size:13px; }
  .btn:hover { background:var(--accent); color:var(--bg); }
  .prose { margin-top:28px; border-top:1px solid var(--border); padding-top:24px; }
  .prose :global(p) { font-size:14px; margin-top:12px; }
</style>
```

- [ ] **Step 4: 빌드 검증**

Run: `npm run build`
Expected: 성공. `dist/vibe/index.html` 및 `dist/vibe/001-recipe-app/index.html` 생성.

- [ ] **Step 5: 화면 확인**

Run: `npm run dev` 후 `/vibe` → 카드 클릭 → 상세 확인.
Expected: 2열 그리드(모바일 1열), 커버 이미지, DAY/날짜, 회고 본문 렌더. 시드엔 링크 없으므로 버튼 미표시 정상.

- [ ] **Step 6: 커밋**

```bash
git add src/components/VibeCard.astro src/pages/vibe/index.astro src/pages/vibe/[slug].astro
git commit -m "feat: Vibe Coding 갤러리·상세"
```

---

## Task 7: 반응형 점검 + Vercel 배포

**Files:**
- 없음(설정/배포만). 필요 시 `Layout.astro` 미세 조정.

**Interfaces:**
- Consumes: 전체 사이트(Task 1–6).
- Produces: 공개 Vercel URL.

- [ ] **Step 1: 모바일 점검**

Run: `npm run dev` 후 브라우저 개발자도구에서 폭 375px로 확인(홈·skills·vibe·상세 각각).
Expected: 헤드라인 오버플로 없음(clamp), 그리드 1열 전환, 가로 스크롤 없음. 문제 있으면 `Layout.astro`의 `main` padding이나 clamp 값 조정 후 재확인.

- [ ] **Step 2: 프로덕션 빌드 최종 검증**

Run: `npm run build && npm run preview`
Expected: 빌드 성공, preview 서버에서 전 페이지 정상.

- [ ] **Step 3: Vercel 배포**

Run: `cd /Users/stacy.kim/Documents/Claude/knowledge-hub && vercel --prod --yes`
Expected: 정적 사이트로 배포되고 공개 URL 반환. (Astro 정적 출력은 별도 어댑터 없이 Vercel이 자동 인식.)

- [ ] **Step 4: 배포 확인**

배포 URL을 브라우저로 열어 홈→skills→vibe 흐름 확인.
Expected: 로그인 벽 없이 공개 접근.

- [ ] **Step 5: 커밋(설정 변경 있었을 경우)**

```bash
git add -A
git commit -m "chore: 반응형 점검 + Vercel 배포"
```

---

## Self-Review

**Spec coverage:**
- 목적 C(모으기+자랑) → 전체 구조. ✓
- 홈/About → Task 4. ✓
- Skills 목록·상세·다운로드 → Task 5. ✓
- Vibe 갤러리·상세(이미지·링크·도구·회고) → Task 6. ✓
- 파일 기반 마크다운 → Task 2 컬렉션. ✓
- 다크 터미널 디자인 시스템·타이포 리듬 → Task 3 + 전 페이지. ✓
- Astro + Vercel → Task 1, 7. ✓
- 모바일 대응 → Task 7 + clamp/그리드. ✓
- 직접 큐레이션(자동수집 X) → 파일 추가 방식으로 자연 충족. ✓

**Placeholder scan:** 모든 코드 스텝에 실제 코드 포함. 임시 커버 SVG는 의도된 시드 자산(추후 실제 이미지로 교체). TBD 없음.

**Type consistency:** `getCollection`/`render` API, `.id`/`.data` 접근, 컴포넌트 props 시그니처가 Task 2~6에서 일관. SectionLink `count?:number`, VibeCard/SkillCard props 정의-사용 일치 확인.
