import React, { useState } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

// ✅ 동적인 메뉴 리스트 컴포넌트
const MenuList = ({ menuItems, onItemSelect }) => {
  // 🔹 선택된 메뉴 항목을 추적하는 상태
  const [selectedIndex, setSelectedIndex] = useState(0);

  // 🔹 리스트 아이템 클릭 핸들러 (선택 상태 변경)
  const handleListItemClick = (event, index) => {
    setSelectedIndex(index); // 선택된 인덱스 업데이트
    if (onItemSelect) {
      onItemSelect(menuItems[index]); // 선택된 항목 정보를 상위 컴포넌트로 전달
    }
  };

  return (
    // 🔹 전체 메뉴 리스트를 감싸는 Box 컨테이너
    <Box sx={{ width: '320px', maxWidth: "320px", bgcolor: 'background.paper' }}>
      
      {/* 🔹 메뉴 리스트 */}
      <List component="nav" aria-label="menu options">
        {menuItems.map((item, index) => (
          <ListItemButton
            key={index} // 각 리스트 항목의 고유 키
            selected={selectedIndex === index} // 선택된 항목 스타일 적용
            onClick={(event) => handleListItemClick(event, index)} // 클릭 이벤트 핸들러
            sx={{
              bgcolor: selectedIndex === index ? 'primary.dark' : 'primary.paper', // 선택된 항목 배경색
              color: selectedIndex === index ? 'black' : 'black', // 선택된 항목 글자색
              '&:hover': { bgcolor: 'primary.light' }, // 마우스 호버 시 효과
              borderRadius: '8px', // 둥근 테두리 스타일 추가
              margin: '5px 5px', // 위아래 간격 추가
              padding: '15px 110px', // 내부 패딩 조정
              minHeight: '100px', // 🔹 버튼 높이 고정
              display: 'flex', // 🔹 내부 정렬을 위해 flex 사용
              alignItems: 'center', // 🔹 텍스트를 수직 중앙 정렬
              textAlign: 'center' // 🔹 텍스트를 수평 중앙 정렬
            }}
          >
            <ListItemText primary={item.label} /> {/* 리스트 아이템 텍스트 표시 */}
          </ListItemButton>
        ))}
      </List>

      {/* 🔹 리스트를 시각적으로 구분하는 Divider */}
      <Divider />
    </Box>
  );
};

export default MenuList;
