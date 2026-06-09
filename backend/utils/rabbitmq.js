const amqp = require('amqplib');

let connection = null;
let channel = null;

/**
 * RabbitMQ'ya bağlanır.
 */
async function connectRabbitMQ() {
    try {
        const url = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';
        connection = await amqp.connect(url);
        channel = await connection.createChannel();
        console.log('🐰 RabbitMQ bağlantısı başarılı');
    } catch (error) {
        console.error('❌ RabbitMQ bağlantı hatası:', error.message);
        // Retry logic could be implemented here
    }
}

/**
 * Belirtilen kuyruğa mesaj gönderir.
 * @param {string} queueName - Kuyruk adı
 * @param {Object} data - Gönderilecek veri (JSON)
 */
async function sendToQueue(queueName, data) {
    if (!channel) {
        console.error('❌ RabbitMQ channel hazır değil!');
        return false;
    }
    try {
        await channel.assertQueue(queueName, { durable: true });
        const message = JSON.stringify(data);
        channel.sendToQueue(queueName, Buffer.from(message), { persistent: true });
        return true;
    } catch (error) {
        console.error(`❌ Kuyruğa (${queueName}) mesaj gönderme hatası:`, error.message);
        return false;
    }
}

/**
 * Belirtilen kuyruğu dinler.
 * @param {string} queueName - Kuyruk adı
 * @param {Function} callback - Mesaj işlendiğinde çağrılacak fonksiyon
 */
async function consumeQueue(queueName, callback) {
    if (!channel) {
        console.error('❌ RabbitMQ channel hazır değil!');
        return;
    }
    try {
        await channel.assertQueue(queueName, { durable: true });
        channel.consume(queueName, async (msg) => {
            if (msg !== null) {
                const data = JSON.parse(msg.content.toString());
                try {
                    await callback(data);
                    channel.ack(msg); // İşlem başarılıysa kuyruktan sil
                } catch (err) {
                    console.error(`❌ Mesaj işlenirken hata:`, err.message);
                    // channel.nack(msg); // Hata durumunda yeniden kuyruğa atılabilir
                }
            }
        });
    } catch (error) {
        console.error(`❌ Kuyruk (${queueName}) tüketimi başlatılamadı:`, error.message);
    }
}

module.exports = {
    connectRabbitMQ,
    sendToQueue,
    consumeQueue,
};
