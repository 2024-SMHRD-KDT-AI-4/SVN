// // src/components/AlertComponent.jsx

// import React, { useEffect } from 'react';
// import io from 'socket.io-client';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css'; // 스타일링

// // 소켓 연결 (주소 확인 필요: 개발/배포 환경에 따라 조정)
// const socket = io('http://localhost:5067');

// const AlertComponent = () => {
//   useEffect(() => {
//     // 소켓 통해 서버로부터 실시간 메시지 받기
//     socket.on('scheduleAlert', (message) => {
//       console.log(' [스케줄 알림 도착]:', message);
//       // Toast 알림 띄우기
//       toast.info(` [알림] ${message}`, {
//         position: "bottom-right", // 오른쪽 하단
//         autoClose: 3000,          // 3초 후 자동 종료
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//       });
//     });

//     //  언마운트 시 소켓 해제
//     return () => socket.off('scheduleAlert');
//   }, []);

//   return <ToastContainer />; // 알림 렌더링 (필수)
// };

// export default AlertComponent;
