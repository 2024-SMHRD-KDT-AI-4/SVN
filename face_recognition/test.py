import cv2

cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)  # 내장 카메라
# cap = cv2.VideoCapture(1, cv2.CAP_DSHOW)  # 외장 카메라 (필요시)

if not cap.isOpened():
    print("❌ 카메라 열기 실패")
    exit()

print("✅ 카메라 열기 성공")

while True:
    ret, frame = cap.read()
    if not ret:
        print("❌ 프레임 읽기 실패")
        break

    cv2.imshow("테스트 카메라", frame)

    if cv2.waitKey(1) & 0xFF == 27:  # ESC 누르면 종료
        break

cap.release()
cv2.destroyAllWindows()
