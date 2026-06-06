# 1. Base image (Node 22, hafif Alpine Linux sürümü)
FROM node:22-alpine

# 2. Çalışma dizinini ayarla
WORKDIR /usr/src/app

# 3. Bağımlılık dosyalarını (package.json ve package-lock.json) kopyala
COPY package*.json ./

# 4. Gerekli bağımlılıkları yükle (Sadece production paketlerini kurar)
RUN npm ci --only=production

# 5. Kaynak kodları kopyala
COPY . .

# 6. Uygulamanın dinleyeceği port (Varsayılan olarak Railway ENV PORT verir)
EXPOSE 3000

# 7. Uygulamayı başlat
CMD ["npm", "start"]
