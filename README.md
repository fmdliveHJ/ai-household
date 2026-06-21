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

### 로컬 PostgreSQL

Docker가 없으면 Homebrew PostgreSQL 16으로 개발 DB를 실행합니다.

```bash
brew services start postgresql@16
export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"
createuser household
createdb -O household babylog
psql -d postgres -c "ALTER USER household WITH PASSWORD 'household';"
```

### 서버

PostgreSQL에 저장하려면 기본 프로필로 실행합니다.

```bash
cd server
./gradlew bootRun
```

H2 임시 DB로 실행하려면 local 프로필을 사용합니다.

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
