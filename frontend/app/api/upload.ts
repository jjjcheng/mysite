import httpClient from "../lib/http";

export async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("image", file);
  const res = await httpClient.post("/api/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  const url = res?.data?.url;
  if (!url) throw new Error("上传失败：无返回 URL");
  return url as string;
}


