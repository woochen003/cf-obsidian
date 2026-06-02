export async function onRequestGet({ env }) {
  const files = await env.DB.prepare("SELECT * FROM files WHERE deleted=0").all();
  const folders = await env.DB.prepare("SELECT * FROM folders").all();
  return Response.json({ files: files.results, folders: folders.results });
}