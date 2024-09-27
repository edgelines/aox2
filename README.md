### Config
- FastAPI, MongoDB, React, 

<!-- Docker Command -->
docker-compose up --build
### 종료
docker-compose down 


docker-compose up -d --build fastapi ( 이 서비스만 재빌드. )

nginx 빌드 / SSL 적용
<!-- Nginx 설정 테스트 -->
docker-compose exec nginx nginx -t
<!-- 컨테이너 재시작 -->
docker-compose restart nginx