import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import fs from "fs";
import { initDB } from "./db/database.js";
import { NoteModel } from "./models/Note.js";
import { createNotesRouter } from "./routes/notes.js";
import { createUploadRouter } from "./routes/upload.js";

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const startServer = async () => {
  const db = await initDB();
  const noteModel = new NoteModel(db);
  app.use("/api/notes", createNotesRouter(noteModel));

  // 静态托管上传目录
  const uploadsDir = path.resolve(process.cwd(), "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  app.use("/uploads", express.static(uploadsDir));

  // 基础 Public URL，可用环境变量覆盖（前后端同源时可为空）
  const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL || "";
  app.use("/api/upload", createUploadRouter(PUBLIC_BASE_URL));

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
  );
};

startServer();
