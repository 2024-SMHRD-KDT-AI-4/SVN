# 직원 사진을 저장하고 MySQL에 경로 저장
import mysql.connector
import os
import shutil

# 📌 MySQL 연결
db = mysql.connector.connect(
    host="project-db-cgi.smhrd.com",
    port=3307,
    user="cgi_24K_AI4_p2_3",
    password="smhrd3",
    database="cgi_24K_AI4_p2_3"
)
cursor = db.cursor()

PHOTO_DIR = "employee_photos"  # 📂 직원 사진 저장 폴더

# 📌 사진 저장 폴더가 없으면 생성
if not os.path.exists(PHOTO_DIR):
    os.makedirs(PHOTO_DIR)

def save_photo(employee_id, photo_path):
    """
    1️⃣ 기존 사진을 'employee_photos/' 폴더에 저장
    2️⃣ MySQL에는 사진 파일의 경로만 저장
    """
    # ✅ 저장할 파일 경로 설정 (예: employee_photos/1.jpg)
    new_path = os.path.join(PHOTO_DIR, f"{employee_id}.jpg")  
    
    # ✅ 원본 사진을 지정된 경로로 복사
    shutil.copy(photo_path, new_path)  
    
    # ✅ MySQL에 사진 경로 업데이트
    sql = "UPDATE test_table SET photo_path = %s WHERE id = %s"
    cursor.execute(sql, (new_path, employee_id))
    db.commit()
    
    print(f"✅ 직원 {employee_id}의 사진 경로가 MySQL에 저장되었습니다! ({new_path})")

# 📌 실행 (테스트용)
employee_id = 1  # 예제 직원 ID
photo_path = "dataset/employee1.jpg"  # 기존 직원 사진 경로

save_photo(employee_id, photo_path)

cursor.close()
db.close()
