import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import '../Chatting.css';

// Socket.io 연결 (서버 주소 확인 필요)
const socket = io('http://localhost:5067');

const Chatting = () => {
  // 채팅 그룹 목록 예시
  const groups = [
    { id: 1, name: '그룹 1', members: ['김예은', '안지운', '김현웅'] },
    { id: 2, name: '그룹 2', members: ['전석현', '김민정'] },
    { id: 3, name: '그룹 3', members: ['강인오', '안성현'] },
  ];

  // 상태 관리
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState({});

  //  Socket.io로 실시간 스케줄 알림 받기
  useEffect(() => {
    return;
    socket.on('scheduleAlert', (message) => {
      console.log(' 받은 알림:', message);

      // 선택된 그룹에 실시간 알림 추가
      setMessages((prevMessages) => {
        const updatedMessages = { ...prevMessages };
        // 현재 그룹이 선택되어 있으면 거기에 추가
        if (selectedGroup) {
          updatedMessages[selectedGroup] = [
            ...(updatedMessages[selectedGroup] || []),
            `[알림] ${message}`, // 알림 메시지 형식
          ];
        }
        return updatedMessages;
      });
    });

    // 언마운트 시 연결 해제
    return () => {
      socket.off('scheduleAlert');
    };
  }, [selectedGroup]); // 그룹이 바뀔 때마다 리스너 유지

  // 그룹 클릭 시 그룹 선택 및 메시지 초기화
  const handleGroupClick = (groupId) => {
    setSelectedGroup(groupId);
    if (!messages[groupId]) {
      setMessages((prev) => ({ ...prev, [groupId]: [] })); // 그룹별 메시지 초기화
    }
  };

  // 메시지 전송 버튼 클릭 시
  const handleSendMessage = () => {
    if (!chatInput.trim()) return; // 빈 입력 방지


    console.log(chatInput);
    // 서버로 메시지 전송
    socket.emit('chatMessage', chatInput);

    // 클라이언트 상태에 메시지 추가
    setMessages((prev) => ({
      ...prev,
      [selectedGroup]: [...(prev[selectedGroup] || []), chatInput],
    }));

    setChatInput(''); // 입력 필드 초기화
  };


  return (
    <div className="chat-container">
      {/* 왼쪽 박스: 채팅 그룹 목록 */}
      <div className="chat-group-list">
        {groups.map((group) => (
          <div
            key={group.id}
            className={`chat-group-item ${selectedGroup === group.id ? 'selected' : ''}`}
            onClick={() => handleGroupClick(group.id)}
          >
            {group.name}
          </div>
        ))}
      </div>

      {/* 중앙 박스: 선택된 그룹의 채팅 내용 */}
      <div className="chat-detail">
        {selectedGroup ? (
          <>
            {/* 메시지 표시 */}
            <div className="chat-messages">
              {(messages[selectedGroup] || []).map((message, index) => (
                <div key={index} className="chat-message">
                  {message}
                </div>
              ))}
            </div>

            {/* 입력 박스와 버튼 */}
            <div className="chat-input-box">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="메시지를 입력하세요"
                className="chat-input"
              />
              <button onClick={handleSendMessage} className="chat-send-button">
                전송
              </button>
            </div>
          </>
        ) : (
          <div>채팅 그룹을 선택해주세요</div>
        )}
      </div>

      {/* 최우측 박스: 해당 채팅방의 참여자 목록 */}
      <div className="chat-members">
        {selectedGroup ? (
          <div>
            <h3>참여자 목록</h3>
            <ul>
              {groups
                .find((g) => g.id === selectedGroup)
                ?.members.map((member, index) => (
                  <li key={index}>{member}</li>
                ))}
            </ul>
          </div>
        ) : (
          <div>참여자 정보를 보려면 채팅 그룹을 선택하세요</div>
        )}
      </div>
    </div>
  );
};

export default Chatting;
