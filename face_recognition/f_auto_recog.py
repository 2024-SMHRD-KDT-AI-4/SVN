import cv2
import face_recognition
import pickle
import os
import sys
import time
import numpy as np  # numpy 모듈 임포트 추가
from PIL import Image, ImageDraw, ImageFont  # PIL 모듈 추가

# 얼굴 인식 데이터 파일 경로 설정
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
pkl_path = os.path.join(BASE_DIR, 'face_data', 'face_encodings.pkl')

# 얼굴 인코딩 데이터 불러오기
try:
    with open(pkl_path, 'rb') as f:
        known_faces = pickle.load(f)
except FileNotFoundError:
    print("[ERROR] Encoding file not found")
    exit()

# 인코딩 데이터 준비
known_face_encodings = []
known_face_ids = []
for emp_id, enc_list in known_faces.items():
    for enc in enc_list:
        known_face_encodings.append(enc)
        known_face_ids.append(emp_id)

# 카메라 시작
cap = cv2.VideoCapture(0)
if not cap.isOpened():
    print("[ERROR] Camera open failed")
    exit()

recognized = False
recognized_id = None
checked = False
start_time = time.time()  # 20초 타이머 시작

# 한글 텍스트를 처리할 수 있는 폰트 설정 (한글 지원하는 ttf 파일 필요)
font_path = "C:/Windows/Fonts/malgun.ttf"  # 예: 윈도우에서 기본 한글 폰트 경로
font = ImageFont.truetype(font_path, 30)

# 얼굴 인식 루프
while True:
    ret, frame = cap.read()
    if not ret:
        print("[ERROR] Frame read failed")
        break

    frame = cv2.flip(frame, 1)
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    face_locations = face_recognition.face_locations(rgb_frame)
    face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)

    for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
        matches = face_recognition.compare_faces(known_face_encodings, face_encoding, tolerance=0.5)
        face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
        best_match_index = face_distances.argmin()

        accuracy = (1 - face_distances[best_match_index]) * 100
        accuracy_text = f"{accuracy:.2f}%"

        if matches[best_match_index] and accuracy >= 70:
            emp_id = known_face_ids[best_match_index]
            color = (0, 255, 0)
            recognized = True
            recognized_id = emp_id
            text = f"{emp_id} ({accuracy_text})"
        else:
            color = (0, 0, 255)
            text = f"Unknown ({accuracy_text})"

        # 얼굴 영역과 텍스트 표시
        cv2.rectangle(frame, (left, top), (right, bottom), color, 2)

        # OpenCV 이미지에서 PIL 이미지로 변환
        pil_image = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        draw = ImageDraw.Draw(pil_image)

        # 한글 텍스트를 PIL로 작성 후, OpenCV 이미지로 변환
        draw.text((left, top - 10), text, font=font, fill=(255, 0, 0))

        # 다시 OpenCV 형식으로 변환
        frame = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)

    # 얼굴 인식 결과 창 띄우기
    cv2.imshow('Face Recognition', frame)

    # 얼굴 인식 성공 시
    if recognized:
        print(recognized_id)
        cv2.waitKey(3000)  # 3초 대기
        break

    # ESC 키로 종료
    if cv2.waitKey(1) & 0xFF == 27:
        print("Unknown")
        break

    # 20초 초과 시 자동 종료
    if time.time() - start_time >= 20:
        print("Time out")
        break

# 자원 해제
cap.release()
cv2.destroyAllWindows()
