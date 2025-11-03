import { useEffect, useMemo, useRef, useState } from "react";
import ReactQuill from "react-quill-new";
import { createNote } from "../api/notes";
import { uploadImage } from "../api/upload";

export default function NewNotePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const quillRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isContentEmpty = useMemo(() => {
    const html = (content || "").replace(/\s+/g, " ");
    // 去除常见空标签与空白，判断是否有有效文本/元素
    const text = html
      .replace(/<p><br\/?><\/p>/gi, "")
      .replace(/<br\/?>(\s*)/gi, "")
      .replace(/<[^>]*>/g, "")
      .trim();
    return text.length === 0;
  }, [content]);

  const isTitleInvalid = useMemo(() => {
    const t = title.trim();
    return t.length === 0 || t.length > 50;
  }, [title]);

  useEffect(() => {
    function insertImageToQuill(url: string) {
      const quill = quillRef.current?.getEditor?.();
      if (!quill) return;
      const range = quill.getSelection(true);
      const index = range ? range.index : quill.getLength();
      quill.insertEmbed(index, "image", url, "user");
      quill.setSelection(index + 1);
    }

    async function handleFiles(files: FileList | File[]) {
      const file = (files && (files as FileList)[0]) || (files as File[])[0];
      if (!file) return;
      setError(null);
      setUploading(true);
      try {
        const url = await uploadImage(file);
        insertImageToQuill(url);
      } catch (err: any) {
        setError(err?.response?.data?.error || err?.message || "图片上传失败");
      } finally {
        setUploading(false);
      }
    }

    const root = quillRef.current?.getEditor?.()?.root;
    if (!root) return;

    const onPaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items || [];
      const files = Array.from(items)
        .filter((it: DataTransferItem) => it.kind === "file")
        .map((it: DataTransferItem) => it.getAsFile())
        .filter(Boolean);
      if (files.length > 0) {
        e.preventDefault();
        handleFiles(files as unknown as File[]);
      }
    };

    const onDrop = (e: DragEvent) => {
      if (e.dataTransfer?.files?.length) {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
      }
    };

    root.addEventListener("paste", onPaste);
    root.addEventListener("drop", onDrop);

    return () => {
      root.removeEventListener("paste", onPaste);
      root.removeEventListener("drop", onDrop);
    };
  }, [quillRef.current]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (isTitleInvalid) {
      setError("标题必填且不超过50个字符");
      return;
    }
    if (isContentEmpty) {
      setError("请输入笔记内容");
      return;
    }
    setSubmitting(true);
    try {
      // 直接提交 HTML 内容，由后端保存
      await createNote({ title: title.trim(), content });
      setContent("");
      setTitle("");
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
          placeholder="请输入标题（最多50个字符）"
          value={title}
          onChange={(e) => setTitle(e.target.value.slice(0, 50))}
          maxLength={50}
          disabled={submitting || uploading}
          style={{
            width: "100%",
            padding: 10,
            border: "1px solid #ddd",
            borderRadius: 6,
            marginBottom: 12,
          }}
        />
        <div style={{ marginBottom: 16 }}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setError(null);
              setUploading(true);
              try {
                const url = await uploadImage(file);
                const quill = quillRef.current?.getEditor?.();
                if (quill) {
                  const range = quill.getSelection(true);
                  const index = range ? range.index : quill.getLength();
                  quill.insertEmbed(index, "image", url, "user");
                  quill.setSelection(index + 1);
                }
              } catch (err: any) {
                setError(
                  err?.response?.data?.error || err?.message || "图片上传失败"
                );
              } finally {
                setUploading(false);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }
            }}
          />
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={content}
            onChange={setContent}
            placeholder="请输入笔记内容"
            style={{ height: 300 }}
            modules={useMemo(
              () => ({
                toolbar: {
                  container: [
                    ["bold", "italic", "underline", "strike"],
                    [{ header: [1, 2, false] }],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["link", "image"],
                  ],
                  handlers: {
                    image: () => fileInputRef.current?.click(),
                  },
                },
              }),
              []
            )}
          />
        </div>
        <button
          type="submit"
          disabled={submitting || uploading || isTitleInvalid || isContentEmpty}
          style={{
            marginTop: 12,
            padding: "8px 14px",
            borderRadius: 6,
            border: "1px solid #111",
            background:
              submitting || uploading || isTitleInvalid || isContentEmpty
                ? "#888"
                : "#111",
            color: "#fff",
          }}
        >
          {submitting ? "提交中..." : uploading ? "图片上传中..." : "提交"}
        </button>
      </form>
      {error ? <p style={{ color: "#c00", marginTop: 10 }}>{error}</p> : null}
      {success ? (
        <p style={{ color: "#0a0", marginTop: 10 }}>已新增一条笔记</p>
      ) : null}
    </div>
  );
}
