import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";

import { checkEnvVars } from "./lib/env.js";
import { timestamp } from "./lib/utils.js";
import { mongoDBConnection } from "./lib/db.js";
import { globalErrorHandler } from "./lib/errorHandler.js";

const app = express();

dotenv.config();
checkEnvVars();

app.use(express.json({ limit: "1mb" }));

app.use("/api/auth", authRoutes);

app.use(globalErrorHandler);

const PORT = process.env.PORT;
const MODE = process.env.NODE_ENV;

app.listen(PORT, async () => {
  console.log(
    `[${timestamp()}][Info] Server is running on ${MODE} mode at port ${PORT}`
  );
  await mongoDBConnection();
});
