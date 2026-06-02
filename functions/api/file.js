export async function onRequestPost({ request, env }) {
  const { name, folder_id } = await request.json();
  const key = "file_" + Date.now();
  await env.DB.prepare("INSERT INTO files(folder_id,name,kv_key) VALUES (?,?,?)")
    .bind(folder_id || null, name, key).run();
  await env.FILES.put(key, "");
  return Response.json({ ok: true });
}

export async function onRequestPut({ request, env }) {
  const { id, content } = await request.json();
  const file = await env.DB.prepare("SELECT * FROM files WHERE id=?").bind(id).first();
  await env.FILES.put(file.kv_key, content);
  return Response.json({ ok: true });
}

export async function onRequestDelete({ request, env }) {
  const { id } = await request.json();
  await env.DB.prepare("UPDATE files SET deleted=1 WHERE id=?").bind(id).run();
  return Response.json({ ok: true });
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();
  const file = await env.DB.prepare("SELECT * FROM files WHERE id=?").bind(id).first();
  const content = await env.FILES.get(file.kv_key) || "";
  return Response.json({ content });
}