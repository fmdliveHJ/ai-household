# BabyLog

아기 수유, 기저귀, 수면, 성장 기록을 빠르게 남기고 하루 상태를 한눈에 보는 육아 기록 앱입니다.

## 구성

- `mobile` — Expo + React Native + TypeScript
- `server` — Spring Boot API
- `infra` — PostgreSQL 및 로컬 개발용 설정
- `docs` — 구조/기획 문서
- `legacy` — 이전 가계부 도메인 코드 보관

## MVP

1. 아기 프로필 등록/조회
2. 수유 기록 등록/조회
3. 기저귀 기록 등록/조회
4. 수면 기록 등록/조회
5. 오늘 요약: 수유 횟수/양, 기저귀 횟수, 수면 시간

## 실행

### 모바일

```bash
cd mobile
npm install
npm run dev
```

### 서버

```bash
cd server
./gradlew bootRun --args='--spring.profiles.active=local'
```

## API 초안

- `GET /api/health`
- `POST /api/babies`
- `GET /api/babies`
- `POST /api/logs`
- `GET /api/logs?babyId=1`
- `GET /api/summaries/today?babyId=1`
