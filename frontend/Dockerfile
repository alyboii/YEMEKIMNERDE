# ─────────────────────────────────────────────
# Frontend Dockerfile — Statik HTML/CSS sunumu (nginx)
# ─────────────────────────────────────────────

# 1. Base image: hafif nginx (Alpine Linux)
FROM nginx:alpine

# 2. Tüm statik dosyaları (HTML/CSS) nginx'in yayın dizinine kopyala
#    .dockerignore sayesinde Dockerfile vb. kopyalanmaz.
COPY . /usr/share/nginx/html/

# 3. nginx 80 portundan yayın yapar
EXPOSE 80

# 4. nginx'i ön planda (foreground) çalıştır — container'ın ayakta kalması için
CMD ["nginx", "-g", "daemon off;"]
