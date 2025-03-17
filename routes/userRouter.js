const express = require('express');
const userRouter = express.Router();
const conn = require("../config/db")
const path = require("path");
const { request } = require('http');
const publicPath = path.join(__dirname, "../public/")
/*
    DB와 열결할 때 작성할 프로세스
    1) 클라이언트가 보낸 데이터를 저장
    2) sql 쿼리문 작성
    3) conn(연결정보)를 통해서 쿼리문 실행
    4) 실행결과를 가지고 응답을 처리한다.

*/

const accountTB = "tb_account" // DB테이블의 이름
const adminTB = "tb_admin" // DB테이블의 이름


userRouter.post("/join", (request, response) => {
    console.log(request.body)
    // 클라이언트가 넘겨준 데이터를 활용해서 DB에 넣어주는 작업
    // 1. 데이터 저장
    let { act_id, act_pw, act_name, act_mail } = request.body;
    // 2. sql문 작성
    let sql = `insert into ${accountTB}(act_id,act_pw,act_name, act_mail) values(?,?,?,?)`;
    // 3. 쿼리문 실행
    conn.query(sql, [act_id, act_pw, act_name, act_mail], (error, result) => {

        if (error) {
            console.log("쿼리 실행 중 오류:", error);
            //return response.status(500).send("서버 오류");
        }
        console.log("실행결과 : ", result);
        // result결과에 있는 affectedrows > 0 테이블에 변화가 생겼다.
        // insert, update, delete
        if (result.affectedRows > 0) {
            // 메인페이지로 이동
            // * sendfile로 파일을 보내면 url이 바뀌지 않는다 -> 새로고침시 로직이 다시 실행
            // * redirect로 경로 전환
            response.redirect("/")
        }
        else {
            console.log("실패")
            response.redirect("/join")
        }
    });
})

userRouter.post("/login", (request, response) => {
    let { id, pw } = request.body;
    let sql = `
    SELECT ${accountTB}.*, ${adminTB}.admin_id
    FROM ${accountTB}
    LEFT JOIN ${adminTB} ON ${accountTB}.act_id = ${adminTB}.admin_id
    WHERE ${accountTB}.act_id = ? AND ${accountTB}.act_pw = ?;
    `;

    conn.query(sql, [id, pw], (error, result) => {
        if (result?.length > 0) {
            const user = result[0]; // DB에서 가져온 첫 번째 사용자 정보

            // 동적으로 role 설정 (관리자인지 사원인지)
            const role = user.admin_id ? "관리자" : "사원";

            //console.log(user, role);

            // 응답에서 비밀번호를 제외한 정보만 반환
            response.json({
                success: true,
                message: "로그인 성공",
                user: {
                    id: user.act_id,
                    name: user.act_name,
                    role: role, // 동적으로 role 설정
                    empID: ""
                }
            });
        } else {
            console.log("로그인 실패");
            response.json({
                success: false,
                message: "아이디 또는 비밀번호가 잘못되었습니다."
            });
        }
    });
});



userRouter.post("/delete", (request, response) => {
    console.log(request.body)
    let { id, pw } = request.body;
    let sql = "delete from member where id = ? and pw = ?"
    //return
    conn.query(sql, [id, pw], (error, result) => {
        console.log("실행결과 : ", result);

        // select문은 리턴결과가 리스트 형태로 반환 -> 데이터가 있으면 리스트의 길이가 0보다 크다

        if (result?.affectedRows > 0) {
            response.redirect("/")
        }
        else {
            response.redirect("/delete")
        }
    });
})


module.exports = userRouter;

/*
    응답하는 방법 3가지
    1) sendfile : 파일을 보내는 방법 -> url이 변하지 않는다 -> 새로고침하면 전의 로직이 실행
    * 사용자에게 정적 파일 보내줄 때 사용(html, img, pdf)
    ex) 사용자가 버튼을 클릭하면 파일을 다운로드 받는 기능 제작

    2) redirect : 경로를 바꾸는 방법 -> url이 변한다 -> 새로고침하면 전의 로직이 실행되지 않는다.
    * 특정 요청을 처리 후. 페이지를 이동할 때 사용
    ex) 로그인 성공 시 -> 메인페이지로 이동

    3) json : 데이터를 json형태로 응답만 할 때 사용

    * 리액트와 연동할 때 보통 res.json을 활용한다.
    * 프로세스 정리
        1) 리액트에서 axios, fetch등 비동기 통신을 활용해서 데이터를 보내기 or 요청 * url적는 공간 -> 라우터
        2) 노드는 받은 데이터를 처리하고 DB에 연결한다.
        3) 가져온 데이터를 리액트로 보내준다.(res.json);
            ex) 로드인 성공 시 -> res.json(result : true);
                로그인 실패 시 -> res.json(result : false)
*/