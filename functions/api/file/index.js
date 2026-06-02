export async function onRequestPost({ request, env }) {
  const data = await request.json();
  const key = "file_" + Date.now();
  await env.DB.prepare("INSERT INTO files(folder_id,name,kv_key) VALUES(?,?,?)")
    .bind(data.folder_id || null, data.name, key).run();
  await env.FILES.put(key, "");
  return new Response(JSON.stringify({ ok: true }));
}

export async function onRequestPut({ request, env }) {
  const { id, content } = await request.json();
  const file = await env.DB.prepare("SELECT * FROM files WHERE id=?").bind(id).first();
  await env.FILES.put(file.kv_key, content);
  return new Response(JSON.stringify({ ok: true }));
}
