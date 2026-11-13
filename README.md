# BugOut 🐞

Rede social para devs — front-end puro (HTML + CSS + JS), sem build.

## Como rodar
Abra `index.html` no navegador, ou sirva a pasta:

```
npx serve .        # ou: python3 -m http.server 8080
```

## Estrutura
- `index.html` — página única (rotas por hash: `#/feed`, `#/search`, `#/pages`, `#/profile`, `#/settings`)
- `css/style.css` — tema preto / roxo / amarelo, responsivo (celular e PC)
- `js/config.js` — URLs do Firebase e do R2
- `js/db.js` — Firebase Realtime Database via REST
- `js/storage.js` — upload de imagens (R2 via Worker, com fallback)
- `js/app.js` — telas e lógica
- `worker/worker.js` — Cloudflare Worker para enviar imagens ao R2
- `assets/` — logo, favicon e as imagens originais

## Banco (Firebase)
```
users/{id}      perfil público (name, bio, areas, verified:false, avatar, banner...)
accounts/{id}   e-mail, hash da senha, salt, senha do app
emails/{key}    índice e-mail -> id
usernames/{u}   índice usuário -> id
posts/{id}      posts (likes, comments dentro)
projects/{id}   páginas de projeto
followers/{id}/{uid}, following/{id}/{uid}
```
Toda conta nasce com `verified: false`. Para dar o selo, edite `users/{id}/verified` para `true` no console do Firebase.

## Imagens (Cloudflare R2)
O endpoint `...r2.cloudflarestorage.com` exige chaves secretas e não pode ser chamado direto do navegador.
1. Crie um Worker com o código de `worker/worker.js` e faça o bind do bucket `nexdev` como `BUCKET`.
2. Defina a variável `PUBLIC_URL` (domínio público do bucket).
3. Cole a URL do Worker em `js/config.js` → `R2_UPLOAD_URL`.

Enquanto `R2_UPLOAD_URL` estiver vazio, as imagens são comprimidas e salvas dentro do próprio Firebase.

## Regras do Firebase
Para funcionar sem Firebase Auth, o banco precisa permitir leitura/escrita (`".read": true, ".write": true`). Isso é aceitável para protótipo, mas **não para produção** — qualquer pessoa com a URL consegue ler/alterar dados. Para produção, migre o login para o Firebase Authentication e restrinja as regras.
