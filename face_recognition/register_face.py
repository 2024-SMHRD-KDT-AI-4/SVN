import cv2
import os
import face_recognition
import pickle
from load_photo import load_faces  # 얼굴 인코딩 함수 가져오기

face_data_path = './face_recognition/face_data/'

# 얼굴 데이터 저장 폴더 없으면 생성
if not os.path.exists(face_data_path):
    os.makedirs(face_data_path)

# 사용자로부터 이름 입력 받기
name = input("직원 이름을 입력하세요: ").strip()

# 개인 폴더 생성 (여러 장 저장을 위해)
person_dir = os.path.join(face_data_path, name)
if not os.path.exists(person_dir):
    os.makedirs(person_dir)

# 카메라 열기
cap = cv2.VideoCapture(0)
if not cap.isOpened():
    print("카메라를 열 수 없습니다.")
    exit()

print(f"{name}님의 얼굴을 등록합니다. 카메라를 응시하세요! (스페이스바로 촬영, ESC로 종료)")

count = 0  # 사진 저장용 번호

while True:
    ret, frame = cap.read()
    if not ret:
        print("프레임을 가져올 수 없습니다.")
        break

    # 1. 좌우반전
    frame = cv2.flip(frame, 1)

    # 2. 얼굴 인식
    rgb_frame = frame[:, :, ::-1]  # BGR -> RGB 변환
    face_locations = face_recognition.face_locations(rgb_frame)

    # 3. 얼굴 네모 박스
    for (top, right, bottom, left) in face_locations:
        cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)

    # 4. 화면 출력
    cv2.imshow('등록화면', frame)

    # 5. 키 입력 대기
    key = cv2.waitKey(1) & 0xFF

    if key == 27:  # ESC 누르면 종료
        print("종료합니다.")
        break
    elif key == ord(' '):  # 스페이스바로 촬영
        count += 1
        file_path = os.path.join(person_dir, f"{name}_{count}.jpg")
        cv2.imwrite(file_path, frame)
        print(f"{file_path} 저장 완료!")

cap.release()
cv2.destroyAllWindows()

# 얼굴 인코딩 및 pkl 저장
try:
    known_face_encodings, known_face_names = load_faces(face_data_path)
    data = {'encodings': known_face_encodings, 'names': known_face_names}

    with open(os.path.join(face_data_path, 'face_encodings.pkl'), 'wb') as f:
        pickle.dump(data, f)

    print("얼굴 인코딩 데이터 저장 완료.")
except Exception as e:
    print("얼굴 인코딩 저장 중 오류:", e)
