// db에 연결정보를 관히라고 실제 연결을 담당하는 파일

const mysql = require("mysql2");


// DB연결정보 넣어주기
const conn = mysql.createConnection({
    host : "localhost",
    port : 3306,
    user : "root",
    password : "910225",
    database : "nodejs"
})

// DB연결 실행하기
try{
    conn.connect();
}
catch
{
    console.log("DB연결 실패")
}

module.exports = conn;