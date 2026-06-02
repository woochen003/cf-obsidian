export async function onRequestGet({ env }) {
  const folders = await env.DB.prepare("SELECT * FROM folders").all();
  const files = await env.DB.prepare("SELECT * FROM files WHERE deleted=0").all();
  return new Response(JSON.stringify({ folders: folders.results, files: files.results }), { headers: { "Content-Type": "application/json" } });
}
