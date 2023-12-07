const express = require("express");
const cors = require("cors");
const { connection } = require("./connection");
const { userRouter } = require("./routes/user.routes");
const { blogRouter } = require("./routes/blog.routes");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/user", userRouter);
app.use("/blogs", blogRouter);

//Default Route
app.get("/", (req, res) => {
  res.send("Server Testing OK");
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, async () => {
  try {
    await connection;
    console.log(`Server is running at PORT ${PORT}`);
  } catch (err) {
    console.log("Errorn in connecting to DB");
    console.log(err);
  }
});
