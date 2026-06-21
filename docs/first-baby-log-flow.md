# First Baby Log Flow

## Goal

첫 번째로 끝까지 연결할 기능은 **수유 기록 추가 → 오늘 요약 갱신**입니다.

## API

### POST /api/babies

```json
{
  "name": "아기",
  "birthDate": "2026-06-01",
  "gender": "UNSPECIFIED"
}
```

### POST /api/logs

```json
{
  "babyId": 1,
  "type": "FEEDING",
  "occurredAt": "2026-06-21T09:00:00",
  "feedingType": "FORMULA",
  "amountMl": 120,
  "note": "잘 먹음"
}
```

### GET /api/logs?babyId=1

최신순 타임라인을 조회합니다.

### GET /api/summaries/today?babyId=1

```json
{
  "date": "2026-06-21",
  "feedingCount": 3,
  "totalFeedingAmountMl": 360,
  "diaperCount": 4,
  "peeCount": 3,
  "poopCount": 1,
  "sleepSessionCount": 2,
  "totalSleepMinutes": 180,
  "sleepingNow": false
}
```

## Why this first?

- 육아 기록 앱의 핵심 가치가 바로 보입니다.
- 모바일 → 서버 → DB → 요약 응답 흐름을 검증할 수 있습니다.
- 이후 기저귀/수면/성장 기록은 같은 구조로 확장하면 됩니다.
