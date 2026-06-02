export async function onRequestGet({ env }) {
  await env.DB.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    );
    CREATE TABLE IF NOT EXISTS folders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT
    );
    CREATE TABLE IF NOT EXISTS files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      folder_id INTEGER,
      name TEXT,
      kv_key TEXT,
      deleted INTEGER DEFAULT 0
    );
  `);

  await env.DB.prepare(
    "INSERT OR IGNORE INTO users(username,password) VALUES('admin','123456')"
  ).run();

  return Response.json({ ok: true, message: "init done" });
}