# household

가계부/생활비 관리 앱 시작 프로젝트.

## 구성
- `mobile` — Expo + React Native + TypeScript
- `server` — Spring Boot API
- `infra` — PostgreSQL 및 로컬 개발용 설정
- `docs` — 구조/기획 문서

## MVP
1. 회원가입/로그인
2. 수입/지출 등록
3. 거래 목록 조회
4. 월별 합계
5. 카테고리 관리

## 다음 실행 순서
1. mobile 실행: `npm install && npm run dev`
2. server 실행: `./gradlew bootRun` 또는 Gradle/Maven으로 실행
3. PostgreSQL 준비 후 `application.yml` 수정
