/* ============================================================
   BugOut — configuração
   ============================================================ */
window.BUGOUT_CONFIG = {
  // Banco de contas, posts, projetos (Firebase Realtime Database via REST)
  FIREBASE_DB_URL: "https://contas-trufas-default-rtdb.firebaseio.com",

  // Cloudflare R2 (bucket "nexdev")
  R2_BUCKET: "nexdev",
  R2_ENDPOINT: "https://9523f0657ca46d7c64a02b6e7b587ff1.r2.cloudflarestorage.com/nexdev",

  // IMPORTANTE: o endpoint S3 do R2 exige chaves secretas assinadas e NÃO pode
  // ser chamado direto do navegador. Publique o worker em /worker/worker.js
  // (Cloudflare Workers) e cole a URL dele aqui. Enquanto estiver vazio,
  // as imagens são comprimidas e salvas dentro do próprio banco (modo fallback).
  R2_UPLOAD_URL: "",

  // Tamanho máximo (px) das imagens após compressão
  IMG_MAX: { avatar: 400, banner: 1200, post: 1280, project: 1100 }
};
