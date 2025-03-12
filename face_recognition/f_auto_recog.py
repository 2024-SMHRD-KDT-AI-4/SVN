import cv2
import face_recognition
import pickle
import numpy as np
import os

# === 1) pkl 파일 절대 경로로 읽어오기 ===
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
pkl_path = os.path.join(BASE_DIR, 'face_encodings.pkl')  # 같은 폴더 안에 있는 경우

# === 2) 데이터 로드 ===
try:
    with open(pkl_path, 'rb') as f:
        known_faces = pickle.load(f)  # {'E_001': [...], 'E_002': [...]}
except FileNotFoundError:
    print("[ERROR] face_encodings.pkl 파일을 찾을 수 없습니다.")
    exit()

# === 3) 인코딩과 ID 나누기 ===
known_face_encodings = []
known_face_ids = []

for emp_id, enc_list in known_faces.items():
    for enc in enc_list:
        known_face_encodings.append(enc)
        known_face_ids.append(emp_id)

print("얼굴 데이터 로드 완료")

# === 4) 카메라 시작 ===
cap = cv2.VideoCapture(0)
recognized = False  # 인식 여부 플래그
employee_id = None  # 인식된 사람 ID 저장용

# === 5) 얼굴 인식 반복 ===
while True:
    ret, frame = cap.read()
    if not ret:
        print("카메라 연결 실패")
        break

    frame = cv2.flip(frame, 1)  # 좌우반전
    rgb_frame = frame[:, :, ::-1]  # RGB 변환

    # 얼굴 위치 찾기
    face_locations = face_recognition.face_locations(rgb_frame)

    # 얼굴 없으면 다음 프레임
    if not face_locations:
        cv2.imshow('Face Recognition', frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
        continue

    # 얼굴 인코딩
    face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)

    # 인코딩 실패 시 다음 프레임
    if len(face_encodings) == 0:
        cv2.imshow('Face Recognition', frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
        continue

    # 얼굴 비교
    for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
        matches = face_recognition.compare_faces(known_face_encodings, face_encoding, tolerance=0.5)
        face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)

        if True in matches:
            best_match_index = face_distances.argmin()
            employee_id = known_face_ids[best_match_index]
            accuracy = round((1 - face_distances[best_match_index]) * 100, 2)

            if accuracy >= 70:  # 신뢰도 70% 이상
                recognized = True
                # 네모박스 + ID + 신뢰도 표시
                cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
                cv2.putText(frame, f'{employee_id} ({accuracy}%)', (left, top - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)
                print(f"[인식 성공] {employee_id}, 일치율: {accuracy}%")
                break  # 첫 성공만 처리
        else:
            # 인식 실패 시 빨간 네모
            cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)
            cv2.putText(frame, "Unknown", (left, top - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 255), 2)

    # 실시간 화면 출력
    cv2.imshow('Face Recognition', frame)

    # q 누르면 종료 (직접 끄기)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()

# === 6) 결과 반환 (Node.js로 전달할 값)
if recognized:
    print(employee_id)  # 성공 시 직원 ID
else:
    print("Unknown")  # 인식 실패
