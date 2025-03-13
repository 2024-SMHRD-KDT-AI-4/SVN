import cv2
import os

# 저장 폴더
save_dir = './face_recognition/face_data/'

# 직원 ID 입력
emp_id = input("등록할 직원 ID를 입력하세요: ")  # 예: E001

# 저장할 경로
emp_dir = os.path.join(save_dir, emp_id)
os.makedirs(emp_dir, exist_ok=True)  # 폴더 없으면 생성

# 캠 시작
cap = cv2.VideoCapture(0)

count = 0
print("얼굴 캡처 준비 완료! [스페이스] 눌러 저장, [ESC] 눌러 종료")

while True:
    ret, frame = cap.read()
    if not ret:
        print("카메라 연결 실패")
        break

    cv2.imshow('Face Registration', frame)
    key = cv2.waitKey(1)

    if key == 27:  # ESC
        break
    elif key == 32:  # 스페이스
        count += 1
        file_path = os.path.join(emp_dir, f"{emp_id}_{count}.jpg")
        cv2.imwrite(file_path, frame)
        print(f"{file_path} 저장 완료!")

cap.release()
cv2.destroyAllWindows()
print("캡처 종료 및 저장 완료!")
