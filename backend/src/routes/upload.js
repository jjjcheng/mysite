import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.resolve(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (_req, file, cb) {
    const ext = path.extname(file.originalname) || "";
    cb(null, `${uuidv4()}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  if (file.mimetype && file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("仅支持图片上传"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export function createUploadRouter(basePublicUrl) {
  const router = express.Router();

  router.post("/", upload.single("image"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "未接收到文件" });
    }
    const filename = req.file.filename;
    const publicBase = basePublicUrl?.replace(/\/$/, "") || "";
    const url = `${publicBase}/uploads/${filename}`;
    return res.json({ url });
  });

  // 简单错误处理（multer）
  router.use((err, _req, res, _next) => {
    return res.status(400).json({ error: err?.message || "上传失败" });
  });

  return router;
}


