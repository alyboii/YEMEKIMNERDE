// ─────────────────────────────────────────────
// Jenkinsfile — YEMEKİMNEREDE (Declarative Pipeline / Groovy)
// Checkout → Install → Build → Deploy → Health Check
// Lokal Docker üzerinde çalışır (cloud deploy yok).
// ─────────────────────────────────────────────

pipeline {
    agent any

    // Renkli/temiz log + adım zaman aşımı
    options {
        timestamps()
        timeout(time: 20, unit: 'MINUTES')
    }

    stages {

        // 1) Kodu GitHub'dan çek
        stage('Checkout') {
            steps {
                echo '📥 Kod GitHub deposundan çekiliyor...'
                // Jenkins job'ı bu repoya bağlıysa:
                checkout scm
                // Alternatif (açık URL ile):
                // git branch: 'main', url: 'https://github.com/alyboii/YEMEKIMNERDE.git'
            }
        }

        // 2) Backend bağımlılıklarını kur
        stage('Install Dependencies') {
            steps {
                echo '📦 Backend bağımlılıkları kuruluyor (npm ci)...'
                dir('backend') {
                    sh 'npm ci'
                }
            }
        }

        // 3) Docker imajlarını derle (CI compose dosyası ile)
        stage('Build Docker Images') {
            steps {
                echo '🐳 Docker imajları derleniyor...'
                sh 'docker compose -f docker-compose.ci.yml build'
            }
        }

        // 4) Container'ları ayağa kaldır (önce eski CI stack'i temizle)
        stage('Deploy') {
            steps {
                echo '🚀 Servisler başlatılıyor (docker compose up -d)...'
                sh 'docker compose -f docker-compose.ci.yml down --remove-orphans || true'
                sh 'docker compose -f docker-compose.ci.yml up -d'
            }
        }

        // 5) Backend gerçekten ayağa kalktı mı kontrol et
        stage('Health Check') {
            steps {
                echo '🩺 Backend sağlık kontrolü yapılıyor...'
                // Jenkins container içinden host'a host.docker.internal ile ulaşılır.
                // Mongo bağlantısı + sunucu açılması için bekleme, sonra 6 deneme.
                sh '''
                    sleep 15
                    curl --fail --retry 6 --retry-delay 5 --retry-connrefused http://host.docker.internal:3100 \
                      && echo "✅ Backend ayakta ve yanıt veriyor" \
                      || (echo "❌ Backend yanıt vermedi"; exit 1)
                '''
            }
        }
    }

    // 6) Sonuç bildirimi
    post {
        success {
            echo '🎉 PIPELINE BAŞARILI — backend ve frontend çalışıyor.'
        }
        failure {
            echo '🔥 PIPELINE BAŞARISIZ — loglardaki hatayı kontrol et.'
        }
        always {
            echo 'ℹ️  Pipeline tamamlandı.'
            // İstenirse temizlik: sh 'docker compose down'
        }
    }
}
