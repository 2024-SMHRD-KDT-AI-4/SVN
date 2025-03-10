# 직원 사진을 불러와 OpenCV로 표시
import mysql.connector
import cv2

# 📌 MySQL 연결
db = mysql.connector.connect(
    host="project-db-cgi.smhrd.com",
    port=3307,
    user="cgi_24K_AI4_p2_3",
    password="smhrd3",
    database="cgi_24K_AI4_p2_3"
)
cursor = db.cursor()

def get_photo_path(employee_id):
    """MySQL에서 직원의 사진 경로를 가져오는 함수"""
    sql = "SELECT photo_path FROM test_table WHERE id = %s"
    cursor.execute(sql, (employee_id,))
    result = cursor.fetchone()
    return result[0] if result else None

def show_photo(employee_id):
    """사진을 불러와서 OpenCV로 출력하는 함수"""
    photo_path = get_photo_path(employee_id)
    
    if not photo_path:
        print(f"❌ 직원 {employee_id}의 사진이 없습니다.")
        return

    image = cv2.imread(photo_path)  # ✅ 저장된 파일 경로에서 사진 불러오기
    cv2.imshow("Employee Photo", image)  # ✅ OpenCV 창에 사진 표시
    cv2.waitKey(0)
    cv2.destroyAllWindows()

# 📌 실행
employee_id = 1  # 예제 직원 ID
show_photo(employee_id)

cursor.close()
db.close()
