import express from "express";

export function createNotesRouter(noteModel) {
  const router = express.Router();

  router.get("/", async (req, res) => {
    const notes = await noteModel.getAll();
    res.json(notes);
  });

  router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const note = await noteModel.getById(id);
    if (!note) return res.status(404).json({ error: "Not found" });
    res.json(note);
  });

  router.post("/", async (req, res) => {
    const { title, content } = req.body || {};
    if (!title || !content) {
      return res.status(400).json({ error: "title and content are required" });
    }

    await noteModel.create(title, content);
    res.json({ message: "Note created" });
  });

  router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body || {};
    if (!title || !content) {
      return res.status(400).json({ error: "title and content are required" });
    }

    await noteModel.update(id, title, content);
    res.json({ message: "Note updated" });
  });

  router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    await noteModel.delete(id);
    res.json({ message: "Note deleted" });
  });

  return router;
}
