import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import contactsRoutes from "./routes/contactsRoutes.js";
import auth from "./middlewares/auth.js";

import "./db.js";

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/users", authRoutes);
app.use("/api/contacts", auth, contactsRoutes);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

app.listen(3000, () => {
  console.log("Server is running. Use our API on port: 3000");
});
