const { consumeQueue } = require('../utils/rabbitmq');
const Order = require('../models/Order');

/**
 * Siparişleri RabbitMQ kuyruğundan okuyup işleyen Worker.
 */
function startOrderWorker() {
    console.log('👷‍♂️ Order Worker başlatıldı. Siparişler dinleniyor...');
    consumeQueue('orders_queue', async (orderData) => {
        try {
            // Gerçek dünyada burada ödeme API'si çağrısı, stok kontrolü vb. yapılır.
            console.log(`📦 Yeni sipariş kuyruktan alındı:`, orderData);
            
            // Siparişi veritabanına kaydet
            const newOrder = new Order({
                ...orderData,
                status: 'Hazırlanıyor' // Sipariş onaylandı kabul ediyoruz
            });
            await newOrder.save();
            
            console.log(`✅ Sipariş veritabanına kaydedildi: ${newOrder._id}`);
        } catch (error) {
            console.error('❌ Sipariş işlenirken hata oluştu:', error.message);
            throw error; // Hata fırlatırsak rabbitmq mesajı acknowledge etmez (nack)
        }
    });
}

module.exports = {
    startOrderWorker
};
