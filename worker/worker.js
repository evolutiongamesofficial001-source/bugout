// Cloudflare Worker — recebe a imagem do BugOut e grava no bucket R2 "nexdev".
// 1) Crie um Worker e faça o bind do bucket com o nome BUCKET (Settings > Bindings > R2).
// 2) Crie a variável PUBLIC_URL com o domínio público do bucket (ex.: https://cdn.seudominio.com).
// 3) Cole a URL do Worker em js/config.js (R2_UPLOAD_URL).
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "*"
};
export default {
  async fetch(req, env) {
    if (req.method === "OPTIONS") return new Response(null, { headers: CORS });
    if (req.method !== "POST") return new Response("ok", { headers: CORS });
    const form = await req.formData();
    const file = form.get("file");
    const key = String(form.get("key") || `misc/${Date.now()}.jpg`).replace(/[^a-zA-Z0-9/_.-]/g, "");
    if (!file || file.size > 6 * 1024 * 1024) return new Response("arquivo inválido", { status: 400, headers: CORS });
    await env.BUCKET.put(key, file.stream(), { httpMetadata: { contentType: "image/jpeg" } });
    return new Response(JSON.stringify({ url: `${env.PUBLIC_URL}/${key}` }), {
      headers: { ...CORS, "Content-Type": "application/json" }
    });
  }
};
