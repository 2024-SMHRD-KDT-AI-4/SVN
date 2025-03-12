import cv2

# 여러 장치 번호와 백엔드 조합 시도
device_ids = [0, 1, 2]
backends = [cv2.CAP_DSHOW, cv2.CAP_MSMF, cv2.CAP_ANY]  # 다양한 백엔드

for backend in backends:
    for device_id in device_ids:
        print(f"장치번호: {device_id}, 백엔드: {backend} 시도 중...")
        cap = cv2.VideoCapture(device_id, backend)
        if cap.isOpened():
            print(f"✅ [성공] 장치번호 {device_id}, 백엔드 {backend} 연결됨!")
            cap.release()
        else:
            print(f"❌ [실패] 장치번호 {device_id}, 백엔드 {backend} 연결 안 됨.")
