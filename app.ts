import express, { Request, Response, NextFunction } from "express";
import path from "path";

const cookieParser = require("cookie-parser");
const schedule = require("node-schedule");

const app = express();

// db
const pool = require("./db/db");

import adminRouter from "./routes/admin";
import attendanceRouter from "./routes/attendance";

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs"); // 템플릿 엔진 설정

app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", adminRouter);
app.use("/", attendanceRouter);

app.listen(3000, () => {
  console.log("246 lab attendance server running--------");
  // 포트번호 설정
  // console.log("3000번 포트에서 서버 대기중입니다!");
});

app.listen(3003, async () => {
  const job2 = schedule.scheduleJob("* 59 23 * * *", async () => {
    // const job2 = schedule.scheduleJob("*/1 * * * * *", async () => {
    // 날짜 가져오기
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth() + 1;
    let date = today.getDate();
    let hour = today.getHours();
    let minute = today.getMinutes();

    // 삭제할 로그들
    const log = await pool.query(
      `select * from lab2.log a inner join lab2.student b on a.studentId = b.studentId where b.liveOn = 1 and a.year = ${year} and a.month = ${month} and a.date = ${date};`
    );

    // const log = await pool.query(
    // "select * from lab2.log a inner join lab2.student b on a.studentId = b.studentId where b.liveOn = 1 and a.year = 2024 and a.month = 3 and a.date = 26;"
    // [
    // year, month, date
    // ]
    // );
    //console.log(log2[0]);
    //

    // 퇴실 처리할 학생들
    const student = await pool.query(
      "select * from lab2.student where liveOn = 1;"
    );

    // console.log(log[0]);

    try {
      // 퇴실처리로직
      for (let i = 0; i < student[0].length; i++) {
        console.log("퇴실처리:", student[0][i].studentId);

        const updateLiveOn = await pool.query(
          "update lab2.student set liveOn = 0 where studentId = ?",
          [Number(student[0][i].studentId)]
        );
      }

      // 삭제처리로직
      for (let i = 0; i < log[0].length; i++) {
        console.log("삭제처리:", log[0][i].studentId, log[0][i].logId);
        const deleteLog = await pool.query(
          "delete from lab2.log where logId = ?",
          [log[0][i].logId]
        );
      }
      console.log("좋은하루 되세요", year, month, date);
    } catch (error) {
      console.log(error);
    }
  });
});
