export async function onRequestPost({ request, env }) {
  const { password } = await request.json();
  if (password !== env.ADMIN_PASSWORD) {
    return new Response(JSON.stringify({ ok: false, msg: "wrong password" }), { status: 401 });
  }
  const token = btoa(JSON.stringify({ role: "admin", t: Date.now() }));
  return new Response(JSON.stringify({ ok: true, token }));
}
