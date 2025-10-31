export class NoteModel {
  constructor(db) {
    this.db = db;
  }

  async getAll() {
    return this.db.all("SELECT * FROM notes ORDER BY id DESC");
  }

  async getById(id) {
    return this.db.get("SELECT * FROM notes WHERE id=?", [id]);
  }

  async create(title, content) {
    await this.db.run("INSERT INTO notes (title, content) VALUES (?, ?)", [
      title,
      content,
    ]);
  }

  async update(id, title, content) {
    await this.db.run("UPDATE notes SET title=?, content=? WHERE id=?", [
      title,
      content,
      id,
    ]);
  }

  async delete(id) {
    await this.db.run("DELETE FROM notes WHERE id=?", [id]);
  }
}
