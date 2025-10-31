import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { initDB } from "./db/database.js";
import { NoteModel } from "./models/Note.js";
import { createNotesRouter } from "./routes/notes.js";

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const startServer = async () => {
  const db = await initDB();
  const noteModel = new NoteModel(db);
  app.use("/api/notes", createNotesRouter(noteModel));

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
  );
};

startServer();
