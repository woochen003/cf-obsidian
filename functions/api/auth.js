function base64url(obj) {
  return btoa(JSON.stringify(obj))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

async function sign(payload, secret) {
  const header = { alg: "HS256", typ: "JWT" };

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const data = `${base64url(header)}.${base64url(payload)}`;

  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));

  const signature = btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  return `${data}.${signature}`;
}

export async function onRequestPost({ request, env }) {
  const { password } = await request.json();

  if (password !== env.ADMIN_PASS) {
    return new Response("fail", { status: 401 });
  }

  const token = await sign(
    { role: "admin", t: Date.now() },
    env.ADMIN_PASS
  );

  return new Response(JSON.stringify({ token }));
}
