# First Transaction Flow

## Goal
첫 번째로 끝까지 연결할 기능은 거래 등록/조회다.

## API
### POST /api/transactions
예시 요청:
```json
{
  "type": "EXPENSE",
  "category": "식비",
  "amount": 12000,
  "memo": "점심",
  "transactionDate": "2026-05-25"
}
```

### GET /api/transactions
저장된 거래를 최신순으로 조회한다.

## Why this first?
- 가계부 핵심 기능이다.
- 모바일 → 서버 → DB 흐름을 가장 빨리 검증할 수 있다.
- 로그인보다 눈에 보이는 결과가 빨리 나온다.
