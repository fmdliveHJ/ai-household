# Household Architecture

## Stack
- Mobile: React Native + Expo + TypeScript
- Backend: Spring Boot
- Database: PostgreSQL

## MVP Flow
1. 모바일 앱에서 로그인/거래 등록 요청
2. Spring Boot API가 요청 검증
3. PostgreSQL에 저장
4. 월별 통계/거래 목록 응답

## 초기 도메인
- users
- accounts
- categories
- transactions
- budgets

## 추천 다음 작업
1. JWT 로그인 구조 추가
2. Transaction 엔티티/DTO/CRUD 구현
3. 모바일 거래 등록 폼 구현
4. 카테고리 선택 UI 추가
