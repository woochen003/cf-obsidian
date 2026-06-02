export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return Response.json({ ok: false, msg: "no password" }, { status: 400 });
    }

    if (password !== env.ADMIN_PASSWORD) {
      return Response.json({ ok: false, msg: "wrong password" }, { status: 401 });
    }

    // 简单 token（不用 jose，避免再炸）
    const token = btoa(JSON.stringify({
      role: "admin",
      t: Date.now()
    }));

    return Response.json({
      ok: true,
      token
    });

  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 500 });
  }
}
