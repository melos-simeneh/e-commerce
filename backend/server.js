import express from "express";
import dotenv from "dotenv";
import routes from "./routes/index.route.js";
import path from "path";
import { checkEnvVars } from "./lib/env.js";
import { timestamp } from "./lib/utils.js";
import { mongoDBConnection } from "./lib/db.js";
import { globalErrorHandler } from "./lib/errorHandler.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";

const app = express();

dotenv.config();
checkEnvVars();

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(morgan("short"));
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use("/api", routes);

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get(/.*/, (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.use(globalErrorHandler);

const PORT = process.env.PORT;
const MODE = process.env.NODE_ENV;

app.listen(PORT, async () => {
  console.log(
    `[${timestamp()}][Info] Server is running on ${MODE} mode at port ${PORT}`
  );
  await mongoDBConnection();
});
