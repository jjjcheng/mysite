import { useState } from "react";
import { createNote } from "../api/notes";

export default function NewNotePage() {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    const text = content.trim();
    if (!text) {
      setError("请输入笔记内容");
      return;
    }
    setSubmitting(true);
    try {
      await createNote({ content: text });
      setContent("");
      setSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || "提交失败");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ padding: 16, maxWidth: 640, margin: "0 auto" }}>
      <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>
        新增笔记
      </h1>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="请输入笔记内容"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={submitting}
          style={{
            width: "100%",
            padding: 10,
            border: "1px solid #ddd",
            borderRadius: 6,
            marginBottom: 12,
          }}
        />
        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: "8px 14px",
            borderRadius: 6,
            border: "1px solid #111",
            background: submitting ? "#888" : "#111",
            color: "#fff",
          }}
        >
          {submitting ? "提交中..." : "提交"}
        </button>
      </form>
      {error ? <p style={{ color: "#c00", marginTop: 10 }}>{error}</p> : null}
      {success ? (
        <p style={{ color: "#0a0", marginTop: 10 }}>已新增一条笔记</p>
      ) : null}
    </div>
  );
}
