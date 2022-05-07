const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

const usersRouter = require("./routes/Users");
app.use("/users", usersRouter);

const assessmentRouter = require("./routes/Assessments");
app.use("/assessments", assessmentRouter);

const submissionsRouter = require("./routes/Submissions");
app.use("/submissions", submissionsRouter);

app.listen(3001, () => {
  console.log("Server Running");
});
