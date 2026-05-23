import express from "express";
import cors from "cors";
import { createApiRouter } from "./api-server";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/api", createApiRouter());

app.listen(PORT, () => {
  console.log(`天问后端服务已启动: http://localhost:${PORT}`);
  console.log(`健康检查: http://localhost:${PORT}/api/health`);
});
