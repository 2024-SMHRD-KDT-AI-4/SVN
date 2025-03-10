
import os
import mysql.connector

# ✅ 1. MySQL 연결
db = mysql.connector.connect(
    host="project-db-cgi.smhrd.com",
    port=3307,
    user="cgi_24K_AI4_p2_3",
    password="smhrd3",
    database="cgi_24K_AI4_p2_3"
)
cursor = db.cursor()
print("✅ MySQL 데이터베이스 연결 성공!")

# ✅ 2. 폴더 안에 있는 모든 사진 파일 읽기 (jpg만)
photo_dir = 'att_data'
photo_files = os.listdir(photo_dir)
photo_files = [f for f in photo_files if f.endswith('.jpg')]

# ✅ 3. 파일명 분석해서 (직원ID, 시간) 정보 만들기
existing_data = set()
for file in photo_files:
    try:
        date_part, employee_id, time_part = file.replace('.jpg', '').split('_')
        formatted_date = f"20{date_part[:2]}-{date_part[2:4]}-{date_part[4:6]}"
        formatted_time = f"{time_part[:2]}:{time_part[2:]}:00"
        full_datetime = f"{formatted_date} {formatted_time}"
        existing_data.add((employee_id, full_datetime))
    except ValueError:
        print(f"[경고] 파일명 형식 잘못됨: {file}")

print(f"[폴더 기준 데이터] {len(existing_data)}건 분석 완료")

# ✅ 4. DB에서 현재 기록 가져오기
cursor.execute("SELECT wo_id, start_time FROM test_table")
db_records = cursor.fetchall()
print(f"[DB 기록] {len(db_records)}건 확인 완료")

# ✅ 5. 폴더에 없는 DB 기록 찾기
delete_count = 0
for record in db_records:
    if record not in existing_data:
        print(f"[삭제 예정] {record}")
        sql = "DELETE FROM test_table WHERE wo_id = %s AND start_time = %s"
        cursor.execute(sql, record)
        delete_count += 1

# ✅ 6. DB 커밋
db.commit()
print(f"[DB 정리 완료] 총 {delete_count}건 삭제 완료!")

# ✅ 7. 연결 닫기
cursor.close()
db.close()
print("✅ MySQL 연결 종료")

# 터미널 실행 : python sync_db_with_folder.py
