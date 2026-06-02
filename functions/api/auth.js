function sign(data) { return btoa(JSON.stringify(data)); }
function verify(token) { return JSON.parse(atob(token)); }

export async function onRequestPost({ request, env }) {
  const { username, password } = await request.json();
  const user = await env.DB.prepare(
    "SELECT * FROM users WHERE username=?"
  ).bind(username).first();

  if (!user || user.password !== password) return Response.json({ ok: false }, { status: 401 });

  return Response.json({ ok: true, token: sign({ uid: user.id, username }) });
}

export async function onRequestGet({ request }) {
  const token = request.headers.get("Authorization")?.split(" ")[1];
  if (!token) return Response.json({ ok: false }, { status: 401 });
  return Response.json({ ok: true, user: verify(token) });
}