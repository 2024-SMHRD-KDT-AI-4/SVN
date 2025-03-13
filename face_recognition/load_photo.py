import face_recognition
import cv2
import os

def load_faces(directory):
    known_face_encodings = []
    known_face_names = []

    for filename in os.listdir(directory):
        if filename.endswith('.jpg') or filename.endswith('.png'):
            image_path = os.path.join(directory, filename)
            image = face_recognition.load_image_file(image_path)
            encoding = face_recognition.face_encodings(image)

            if encoding:  # 얼굴 인식에 성공한 경우만
                known_face_encodings.append(encoding[0])
                known_face_names.append(os.path.splitext(filename)[0])  # 확장자 제거한 파일명 = 이름

    return known_face_encodings, known_face_names
