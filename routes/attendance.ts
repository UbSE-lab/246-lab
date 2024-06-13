import * as express from "express";

const router = express.Router();
const pool = require("../db/db");

/**
 * 관리자 페이지
 * 작성날짜 : 2024-05-26
 * 작성자 : 김강민
 */

// 출석 페이지
router.get(
  "/",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    res.render("attendance", {});
  }
);

interface studentValue {
  student_number: number;
}

// 출석 기능
router.post(
  "/attendance",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    // const { student_number } = req.body;
    const data: studentValue = { student_number: req.body.student_number };

    // if (
    //   student_number == undefined ||
    //   student_number == null ||
    //   student_number == "" ||
    //   student_number.length < 8 ||
    //   student_number.length > 8
    // ) {
    //   return res.send(
    //     `<script type = "text/javascript">alert("학번을 확인해주세요."); window.history.back();</script>`
    //   );
    // }
    if (data.student_number) {
      return res.send(
        `<script type = "text/javascript">alert("학번을 확인해주세요."); window.history.back();</script>`
      );
    }

    const attendance_already_check = await pool.query(
      "select liveOn from lab2.student where studentId = ?",
      [data.student_number]
    );

    console.log("!!!", attendance_already_check[0][0].liveOn);

    if (attendance_already_check[0].length == 0) {
      return res.send(
        `<script type = "text/javascript">alert("학번이 존재하지 않습니다."); window.history.back();</script>`
      );
    }

    if (attendance_already_check[0][0].liveOn == 0) {
      const update_live_on = await pool.query(
        "update lab2.student set liveOn = 1 where studentId = ?",
        [data.student_number]
      );
      console.log("입실처리:", data.student_number);
      return res.send(
        `<script type = "text/javascript">alert("입실처리 되었습니다."); location.href = "/attendance";</script>`
      );
    } else if (attendance_already_check[0][0].liveOn != 0) {
      const update_live_on = await pool.query(
        "update lab2.student set liveOn = 0 where studentId = ?",
        [data.student_number]
      );
      return res.send(
        `<script type = "text/javascript">alert("퇴실처리 되었습니다."); location.href = "/attendance";</script>`
      );
    }
  }
);

export default router;
