const express = require("express");
const userRoutes = require("./routes/user_routes");
const authRoutes = require("./routes/auth_routes");
const cors = require('cors')
const app = express();
require("dotenv/config");
const port = process.env.PORT;
app.use(cors({
    origin: process.env.FRONTEND_URL,
}))
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});