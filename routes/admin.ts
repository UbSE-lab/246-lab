import * as express from "express";

const router = express.Router();

const pool = require("../db/db");

interface AdminValue {
  id: number;
  password: string;
}

/**
 * 관리자 로그인
 * 작성날짜 : 2024-05-26
 * 작성자 : 김강민
 */

// --------------------------------------------------

// 관리자 로그인 페이지
router.get(
  "/admin",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.log("로그인 페이지!");
    res.render("index");
  }
);

// 관리자 로그인 기능
router.post(
  "/login",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const data: AdminValue = { id: req.body.id, password: req.body.password };
    // const { id, password } = req.body;

    console.log("관리자 로그인: ", req.body);

    const response = await pool.query(
      "select * from admin where id = ? and password = ?",
      [data.id, data.password]
    );
    console.log("response: ", response[0]);
    if (response[0].length != 0) {
      return res.send(
        `<script type = "text/javascript">alert("관리자님 반갑습니다."); location.href = "/student";</script>`
      );
    } else {
      return res.send(
        `<script type = "text/javascript">alert("아이디 및 비밀번호를 확인해주세요"); window.history.back();</script>>`
      );
    }
  }
);

// --------------------------------------------------

// 대시 보드 페이지
router.get(
  "/summary",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    res.render("admin_summary", {});
  }
);

// 학생 목록 페이지
router.get(
  "/student",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    res.render("admin_student_list", {});
  }
);

// 경고 목록 페이지
router.get(
  "/alert",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    res.render("admin_alert_list", {});
  }
);

// 출석 현황 페이지
router.get(
  "/attendanceList",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    res.render("admin_attendanceList", {});
  }
);

// 주차별 출석 현황 페이지
router.get(
  "/attendanceList/week",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    res.render("admin_attendanceList_week", {});
  }
);

// 실시간 출석 현황 페이지
router.get(
  "/attendanceList/realtime",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    res.render("admin_attendanceList_realtime", {});
  }
);

// 출석 상세 페이지
router.get(
  "/attendanceList/detail",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    res.render("admin_attendanceList_detail", {});
  }
);

// 화이트리스트 페이지
router.get(
  "/whiteList",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    res.render("whiteList", {});
  }
);

export default router;
