import { SignJWT, jwtVerify } from 'jose';

export async function onRequestPost(context) {
  const { request, env } = context;
  const { password } = await request.json();

  if (password !== env.ADMIN_PASS) {
    return new Response(JSON.stringify({ error: '密码错误' }), { status: 401 });
  }

  const jwt = await new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(new TextEncoder().encode(env.ADMIN_PASS));

  return new Response(JSON.stringify({ token: jwt }), { status: 200 });
}
