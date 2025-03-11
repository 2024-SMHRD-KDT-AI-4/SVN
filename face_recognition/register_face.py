import cv2
import os
from PIL import Image

employee_id = input("저장할 직원 ID를 입력하세요 (예: E_001): ")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SAVE_DIR = os.path.join(BASE_DIR, 'face_data')

if not os.path.exists(SAVE_DIR):
    os.makedirs(SAVE_DIR)
    print(f"[폴더 생성 완료] {SAVE_DIR}")

cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
if not cap.isOpened():
    print("[❌오류] 카메라 연결 실패")
    exit()

print("[안내] 직원 얼굴 등록 시작 (ESC로 종료, Space로 촬영)")

count = 0
while True:
    ret, frame = cap.read()
    if not ret:
        print("[❌오류] 프레임 수신 실패")
        break

    frame = cv2.flip(frame, 1)  # 좌우반전
    cv2.imshow("직원 얼굴 등록", frame)
    key = cv2.waitKey(1) & 0xFF

    if key == 32:  # Space bar 촬영
        count += 1
        file_name = f"{employee_id}_{count}.jpg"
        file_path = os.path.join(SAVE_DIR, file_name)

        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        Image.fromarray(frame_rgb).save(file_path)

        print(f"[저장 완료] {file_path}")

    elif key == 27:  # ESC
        print("[종료] 촬영 종료")
        break

cap.release()
cv2.destroyAllWindows()
