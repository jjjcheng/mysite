import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getNote, type Note } from "../api/notes";

export default function NoteDetailPage() {
  const { id } = useParams();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await getNote(id);
        if (!cancelled) setNote(data);
      } catch (err: any) {
        if (!cancelled) setError(err?.response?.data?.error || err?.message || "加载失败");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <div style={{ padding: 16, maxWidth: 720, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <h1 style={{ fontSize: 20, fontWeight: 600 }}>笔记详情</h1>
        <Link to="/notes" style={{ textDecoration: "none", color: "#111", border: "1px solid #111", padding: "6px 10px", borderRadius: 6 }}>
          返回列表
        </Link>
      </div>
      {loading ? <p>加载中...</p> : null}
      {error ? <p style={{ color: "#c00" }}>{error}</p> : null}
      {note ? (
        <div style={{ border: "1px solid #eee", borderRadius: 8, padding: 12 }}>
          <p><b>ID：</b>{note.id}</p>
          <p><b>时间：</b>{new Date(note.created_at).toLocaleString()}</p>
          <p><b>Title：</b>{note.title}</p>
          <div style={{ marginTop: 8 }}>
            <b>Content：</b>
            <div style={{ whiteSpace: "pre-wrap", marginTop: 6 }}>{note.content}</div>
          </div>
        </div>
      ) : null}
    </div>
  );
}


