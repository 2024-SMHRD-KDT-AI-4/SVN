# 직원 얼굴 등록 (MySQL 저장)
import face_recognition
import cv2
import mysql.connector
import json
import os

# 📌 MySQL 연결 설정
db = mysql.connector.connect(
    host="project-db-cgi.smhrd.com",
    port=3307,
    user="cgi_24K_AI4_p2_3",
    password="smhrd3",
    database="cgi_24K_AI4_p2_3"
)
cursor = db.cursor()

DATASET_DIR = "dataset"

if not os.path.exists(DATASET_DIR):
    os.makedirs(DATASET_DIR)

def register_employee(name):
    """웹캠으로 직원 얼굴을 등록하고, MySQL에 저장하는 함수"""
    
    cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
    print(f"📸 {name}님의 얼굴을 등록합니다. 카메라를 응시하세요!")

    while True:
        ret, frame = cap.read()
        if not ret:
            print("❌ 카메라 오류!")
            break

        cv2.imshow("Face Registration - Press SPACE to Capture", frame)

        if cv2.waitKey(1) & 0xFF == 32:
            file_path = f"{DATASET_DIR}/{name}.jpg"
            cv2.imwrite(file_path, frame)
            print(f"✅ {name}.jpg 저장 완료!")
            break

    cap.release()
    cv2.destroyAllWindows()

    # 📌 얼굴 인코딩 생성
    image = face_recognition.load_image_file(file_path)
    encodings = face_recognition.face_encodings(image)

    if len(encodings) > 0:
        encoding = json.dumps(encodings[0].tolist())  # JSON 문자열 변환
        save_employee_encoding(name, encoding)
    else:
        print("❌ 얼굴 감지 실패. 다시 시도해주세요.")

def save_employee_encoding(name, encoding):
    """MySQL에 얼굴 인코딩을 저장하는 함수"""
    
    try:
        sql = "INSERT INTO employees (name, face_encoding) VALUES (%s, %s)"
        cursor.execute(sql, (name, encoding))
        db.commit()
        print(f"✅ {name}님의 얼굴이 MySQL에 등록되었습니다!")
    except Exception as e:
        print(f"❌ 오류 발생: {e}")

if __name__ == "__main__":
    name = input("👤 직원 이름을 입력하세요: ")
    register_employee(name)

cursor.close()
db.close()
