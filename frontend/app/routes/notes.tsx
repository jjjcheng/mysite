import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getAllNotes, deleteNote, type Note } from "../api/notes";

export default function NotesListPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getAllNotes();
        if (!cancelled) setNotes(data);
      } catch (err: any) {
        if (!cancelled) setError(err?.message || "加载失败");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div style={{ padding: 16, maxWidth: 960, margin: "0 auto" }}>
      <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>笔记列表</h1>
      {loading ? <p>加载中...</p> : null}
      {error ? <p style={{ color: "#c00" }}>{error}</p> : null}
      {!loading && !error ? (
        <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #eee", borderRadius: 8, overflow: "hidden" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>时间</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>ID</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Title</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {notes.map((n) => (
              <tr key={n.id}>
                <td style={{ padding: 8, borderBottom: "1px solid #f3f3f3" }}>
                  {new Date(n.created_at).toLocaleString()}
                </td>
                <td style={{ padding: 8, borderBottom: "1px solid #f3f3f3" }}>{n.id}</td>
                <td style={{ padding: 8, borderBottom: "1px solid #f3f3f3" }}>{n.title}</td>
                <td style={{ padding: 8, borderBottom: "1px solid #f3f3f3", display: "flex", gap: 8 }}>
                  <Link
                    to={`/note/${n.id}`}
                    style={{
                      padding: "6px 10px",
                      border: "1px solid #111",
                      borderRadius: 6,
                      textDecoration: "none",
                      color: "#111",
                      background: "#fff",
                    }}
                  >
                    详情
                  </Link>
                  <button
                    onClick={async () => {
                      if (!confirm("确定删除这条笔记吗？")) return;
                      await deleteNote(n.id);
                      setNotes((prev) => prev.filter((x) => x.id !== n.id));
                    }}
                    style={{
                      padding: "6px 10px",
                      border: "1px solid #c00",
                      borderRadius: 6,
                      color: "#fff",
                      background: "#c00",
                    }}
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </div>
  );
}


