export async function onRequestGet({ request, env }) {
  const id = request.url.split("/").pop();
  const file = await env.DB.prepare("SELECT * FROM files WHERE id=?").bind(id).first();
  const content = await env.FILES.get(file.kv_key) || "";
  return new Response(JSON.stringify({ content }), { headers: { "Content-Type": "application/json" } });
}
