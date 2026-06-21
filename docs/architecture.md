# BabyLog Architecture

## Stack

- Mobile: React Native + Expo + TypeScript
- Backend: Spring Boot
- Database: PostgreSQL / local H2

## Product Direction

첫 버전은 커뮤니티나 AI보다 **부모가 빠르게 기록하는 UX**에 집중합니다.

핵심 질문:

- 마지막 수유가 언제였지?
- 오늘 총 수유량이 얼마지?
- 기저귀는 몇 번 갈았지?
- 오늘 얼마나 잤지?

## Domain

### Baby

아기 프로필입니다.

- name
- birthDate
- gender(optional)

### BabyLog

수유/기저귀/수면/성장 기록을 하나의 타임라인으로 다룹니다.

공통 필드:

- babyId
- type
- occurredAt
- note

유형별 필드:

- Feeding: feedingType, amountMl, durationMinutes
- Diaper: diaperContent
- Sleep: startedAt, endedAt
- Growth: weightKg, heightCm

## Mobile Structure

```txt
mobile/
  App.tsx
  src/
    components/
    domain/
    features/
```

현재는 빠른 MVP를 위해 `App.tsx`에 화면을 먼저 구현하고, 기능이 커지면 `src/features`로 분리합니다.

## Server Structure

```txt
server/src/main/java/com/household/api/
  baby/
    controller/
    domain/
    dto/
    repository/
    service/
  log/
    controller/
    domain/
    dto/
    repository/
    service/
  summary/
    controller/
    dto/
    service/
```

패키지 루트 `com.household.api`는 기존 설정 호환을 위해 유지하고, 서비스명만 BabyLog로 전환합니다.

## First Vertical Slice

1. 모바일에서 샘플 기록 추가
2. 서버에 아기/기록 API 생성
3. 오늘 요약 API 생성
4. 모바일을 API와 연결
