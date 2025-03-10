# MySQL 연결 테스트 파일

import mysql.connector

# 📌 MySQL 연결 설정
db = mysql.connector.connect(
    host="project-db-cgi.smhrd.com",  # ✅ 외부 DB 서버 주소
    port=3307,                        # ✅ 포트 번호
    user="cgi_24K_AI4_p2_3",          # ✅ 사용자명
    password="smhrd3",                # ✅ 비밀번호
    database="cgi_24K_AI4_p2_3"       # ✅ 데이터베이스명
)

cursor = db.cursor()
print("✅ MySQL 데이터베이스 연결 성공!")
