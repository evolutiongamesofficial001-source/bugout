/* BugOut — acesso ao Firebase Realtime Database via REST (sem SDK) */
const DB = (() => {
  const base = () => window.BUGOUT_CONFIG.FIREBASE_DB_URL.replace(/\/$/, "");
  async function req(path, method = "GET", body, query = "") {
    const r = await fetch(`${base()}/${path}.json${query}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body)
    });
    if (!r.ok) throw new Error("Erro no banco de dados (" + r.status + ")");
    return r.json();
  }
  return {
    get: (p) => req(p),
    keys: async (p) => Object.keys((await req(p, "GET", undefined, "?shallow=true")) || {}),
    set: (p, v) => req(p, "PUT", v),
    update: (p, v) => req(p, "PATCH", v),
    push: (p, v) => req(p, "POST", v),
    del: (p) => req(p, "DELETE")
  };
})();

/* Hash de senha (SHA-256 + salt). Fallback simples caso crypto.subtle não exista. */
async function sha256(str) {
  if (window.crypto && crypto.subtle) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 2654435761);
    h2 = Math.imul(h2 ^ c, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return "f" + (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
}
const randHex = (n = 16) =>
  [...crypto.getRandomValues(new Uint8Array(n))].map((b) => b.toString(16).padStart(2, "0")).join("");
const emailKey = (e) => e.toLowerCase().trim().replace(/[.#$\[\]\/]/g, ",");

/* Chave segura (Firebase) para nome de usuário: aceita qualquer caractere, case-insensitive */
const unameKey = (u) => Array.from(String(u).trim().toLowerCase())
  .map((c) => (/[a-z0-9_-]/.test(c) ? c : '~' + c.codePointAt(0).toString(16) + '~')).join('');
