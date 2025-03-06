// db에 연결정보를 관히라고 실제 연결을 담당하는 파일

const mysql = require("mysql2");

// DB연결정보 넣어주기
const conn = mysql.createConnection({
    host: "project-db-cgi.smhrd.com",
    port: 3307,
    user: "cgi_24K_AI4_p2_3",
    password: "smhrd3",
    database: "cgi_24K_AI4_p2_3"
});

// DB연결 실행하기
conn.connect((err) => {
    if (err) {
        console.error("DB연결 실패: ", err);
        return;
    }
    console.log("DB연결 성공");
});

setInterval(() => {
    conn.ping((err) => {
      if (err) {
        console.error('연결 오류:', err);
      } else {
        console.log('MySQL 서버와의 연결 유지');
      }
    });
  }, 1000 * 60 * 5); // 5분마다 ping 쿼리 보내기

module.exports = conn;
