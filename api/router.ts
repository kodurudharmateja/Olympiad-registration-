import { authRouter } from "./auth-router";
import { createRouter, publicQuery } from "./middleware";
import { adminRouter } from "./routers/admin-router";
import { schoolRouter } from "./routers/school-router";
import { parentRouter } from "./routers/parent-router";
import { examRouter } from "./routers/exam-router";
import { studentRouter } from "./routers/student-router";
import { registrationRouter } from "./routers/registration-router";
import { paymentRouter } from "./routers/payment-router";
import { reportRouter } from "./routers/report-router";
import { uploadRouter } from "./routers/upload-router";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  admin: adminRouter,
  school: schoolRouter,
  parent: parentRouter,
  exam: examRouter,
  student: studentRouter,
  registration: registrationRouter,
  payment: paymentRouter,
  report: reportRouter,
  upload: uploadRouter,
});

export type AppRouter = typeof appRouter;
