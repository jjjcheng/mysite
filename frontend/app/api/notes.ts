import httpClient from "../lib/http";

export type CreateNotePayload = {
  content: string;
};

export async function createNote(payload: CreateNotePayload): Promise<void> {
  const { content } = payload;
  const title = content.trim().slice(0, 20) || "Untitled";
  await httpClient.post("/api/notes", { title, content });
}

export type Note = {
  id: number;
  title: string;
  content: string;
  created_at: string;
};

export async function getAllNotes(): Promise<Note[]> {
  const res = await httpClient.get<Note[]>("/api/notes");
  return res.data;
}

export async function getNote(id: number | string): Promise<Note> {
  const res = await httpClient.get<Note>(`/api/notes/${id}`);
  return res.data;
}

export async function deleteNote(id: number | string): Promise<void> {
  await httpClient.delete(`/api/notes/${id}`);
}
