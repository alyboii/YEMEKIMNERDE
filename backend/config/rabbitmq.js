// ─────────────────────────────────────────────
// RabbitMQ Yapılandırması
// RABBITMQ_URL varsa aktif olur; yoksa veya hata verirse istekler çökmeksizin sessizce geçilir.
// ─────────────────────────────────────────────

const amqp = require('amqplib');

let channel = null;
let ready = false;

async function initRabbitMQ() {
  if (!process.env.RABBITMQ_URL) {
    console.log('ℹ️  RABBITMQ_URL yok — kuyruk devre dışı.');
    return;
  }
  
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    
    // Gerekli kuyrukların tanımlanması
    const queue = 'new_orders_queue';
    await channel.assertQueue(queue, { durable: true });
    
    ready = true;
    console.log('✅ RabbitMQ bağlandı — Message Queue AKTİF');
    
    connection.on('error', (err) => {
      console.log('⚠️ RabbitMQ bağlantı hatası:', err.message);
      ready = false;
    });
    
    connection.on('close', () => {
      console.log('⚠️ RabbitMQ bağlantısı kapandı');
      ready = false;
    });

  } catch (e) {
    console.log('⚠️ RabbitMQ bağlanamadı, sistem kuyruk özelliği olmadan çalışmaya devam edecek:', e.message);
    ready = false;
  }
}

async function sendToQueue(queueName, message) {
  if (!ready || !channel) return;
  try {
    const msgBuffer = Buffer.from(JSON.stringify(message));
    channel.sendToQueue(queueName, msgBuffer, { persistent: true });
  } catch (e) {
    // Hatayı yut, uygulamayı çökertme
    console.log(`⚠️ RabbitMQ mesajı ${queueName} kuyruğuna gönderilemedi:`, e.message);
  }
}

module.exports = { initRabbitMQ, sendToQueue };
