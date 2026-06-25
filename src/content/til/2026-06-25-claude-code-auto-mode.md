---
title: 클로드 코드의 Auto 모드를 알게 됐다 — Bypass 모드와 뭐가 다른가
date: 2026-06-25
tags: [claude, claude-code, permissions, workflow]
---

클로드 코드에 **Auto 모드(auto-approve)** 라는 게 있다는 걸 알게 됐다. 매번 "이거 해도 돼?" 확인받지 않고 자동 승인되는 기능. 어떨 때 쓰는지, Bypass 모드랑 뭐가 다른지 정리해둔다.

**Auto 모드란?**

- 매번 확인받지 않고 자동 승인하되, **위험하거나 파괴적인 작업은 골라서 물어보는** 모드.
- 진짜 무조건 승인이 아니라, 백그라운드에서 AI가 *"이 작업이 요청 범위를 벗어나거나 위험하지 않은가"* 를 검증한 뒤 자동 통과시키는 구조다. 그래서 손가락(…and finger tendons)을 아낄 수 있다.

**켜는 방법 (3가지)**

1. **가장 빠른 방법 — `Shift+Tab`**
   - 클로드 코드 대화 중에 `Shift+Tab`을 누르면 모드가 순환한다.
   - `default → acceptEdits → plan → auto` 순서로 바뀌고, 하단에 `auto`가 뜰 때까지 누르면 된다.

2. **시작할 때 플래그로**

```
claude --permission-mode auto
```

3. **항상 기본값으로 켜두기 — `~/.claude/settings.json`**

```json
{
  "permissions": {
    "defaultMode": "auto"
  }
}
```

**알아둘 점**

- 프로덕션 배포, `git push --force`, `curl | bash`, 민감 데이터 외부 전송 등은 **여전히 물어보거나 차단**된다.
- 연속으로 차단이 쌓이면 수동 승인 모드로 자동 돌아간다.
- 회사(팀/엔터프라이즈) 플랜이면 관리자가 기능을 꺼놨을 수 있다. 모델은 **Opus 4.6+ / Sonnet 4.6+** 필요.

**Auto vs Bypass**

> **"모든 걸 검증 없이 통과"** 시키는 `bypassPermissions` 모드는 따로 있다. 이건 격리된 컨테이너/VM에서만 쓰는 걸 권장한다. Auto랑 헷갈리지 마세요.

- **Auto** = 자동 승인하되 위험 작업은 AI가 걸러서 물어봄 → 일상 작업용.
- **Bypass** = 검증 없이 전부 통과 → 격리 환경 전용. 로컬 본 머신에선 쓰지 말 것.
