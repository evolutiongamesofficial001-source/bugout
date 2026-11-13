/* BugOut — upload de imagens (Cloudflare R2 via Worker, com fallback em dataURL) */
const Storage = (() => {
  const CFG = () => window.BUGOUT_CONFIG;

  function compress(file, max) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        let { width: w, height: h } = img;
        const k = Math.min(1, max / Math.max(w, h));
        w = Math.round(w * k); h = Math.round(h * k);
        const c = document.createElement("canvas");
        c.width = w; c.height = h;
        c.getContext("2d").drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(url);
        c.toBlob((b) => (b ? resolve(b) : reject(new Error("Falha ao processar imagem"))), "image/jpeg", 0.82);
      };
      img.onerror = () => reject(new Error("Imagem inválida"));
      img.src = url;
    });
  }
  const toDataURL = (blob) =>
    new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result);
      r.onerror = rej;
      r.readAsDataURL(blob);
    });

  async function upload(file, kind = "post") {
    const blob = await compress(file, CFG().IMG_MAX[kind] || 1100);
    const name = `${kind}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
    if (CFG().R2_UPLOAD_URL) {
      try {
        const fd = new FormData();
        fd.append("file", blob, name.split("/").pop());
        fd.append("key", name);
        const r = await fetch(CFG().R2_UPLOAD_URL, { method: "POST", body: fd });
        if (!r.ok) throw new Error("upload " + r.status);
        const j = await r.json();
        if (j.url) return j.url;
      } catch (e) {
        console.warn("R2 indisponível, usando fallback:", e);
      }
    }
    return toDataURL(blob);
  }
  return { upload };
})();
