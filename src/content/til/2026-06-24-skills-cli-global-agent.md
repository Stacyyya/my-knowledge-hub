---
title: skills CLI의 --global / --agent 플래그를 이해했다
date: 2026-06-24
tags: [claude, skills, cli]
---

스킬을 설치할 때 `--global`이 정확히 뭘 하는지 헷갈렸는데, 오늘 정리했다.

**핵심 — `--global`의 의미**

- `--global`은 **"모든 앱(Claude Code + Cowork + 채팅)에 공유"가 아니다.**
- 한 앱 안에서 **"프로젝트 폴더 전용" vs "내 계정 전역(user-level)"** 을 가르는 옵션이다.
- 즉 `--global`을 쓰면 `~/.claude/skills`(= Claude Code가 보는 폴더)에 들어간다. Cowork(데스크톱 앱)는 자기 폴더를 따로 보기 때문에 이건 못 읽는다.

**앱마다 스킬 읽는 폴더가 다름**

| 앱 | 읽는 위치 |
| --- | --- |
| Claude Code | `~/.claude/skills` |
| Cowork (데스크톱 에이전트) | 데스크톱 앱 데이터 폴더 (Application Support/Claude/…) |
| claude.ai 일반 채팅 | 서버에서 돌아서 로컬 PC 경로 접근 불가 |

**그럼 여러 앱에 깔려면? → `--agent`**

- `--global`이 아니라 `--agent`가 "어느 앱에 설치할지"를 정한다. `--agent claude-code` 식.
- 모든 앱에 깔려면 `--agent '*'`:

```
npx skills@latest add <repo>/skills --skill '*' --agent '*' -y
```

- 단, **claude.ai 웹 채팅은 예외.** 로컬에 파일 두는 방식이 아니라, 설정의 Skills(Capabilities)로 **별도 업로드**해야 한다.

**정리**

- `--global` = 모든 앱 공유가 아니라, 한 앱 안에서 "전역(user-level)"이라는 뜻.
- 앱마다 스킬 폴더가 다르니 `--agent`로 설치 대상을 지정.
- 웹/claude.ai 채팅은 별도 업로드(로컬 설치 안 됨).
