require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/v1/auth', require('./routes/auth'));
app.use('/v1/users', require('./routes/users'));
// Cemal Tarlan'ın route'ları
app.use('/v1/restaurants', require('./routes/restaurants'));
// Abdullah'ın route'ları buraya eklenecek:
 app.use('/v1/cart', require('./routes/cart'));
 app.use('/v1/orders', require('./routes/orders'));

app.get('/', (req, res) => {
  res.json({ mesaj: 'YEMEKİMNEREDE API çalışıyor' });
});

const { connectRabbitMQ } = require('./utils/rabbitmq');
const { startOrderWorker } = require('./workers/orderWorker');

mongoose
  .connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/yemekimnerede')
  .then(async () => {
    console.log('MongoDB bağlantısı başarılı');
    
    // RabbitMQ'ya bağlan ve Worker'ı başlat
    await connectRabbitMQ();
    startOrderWorker();

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Sunucu ${PORT} portunda çalışıyor`));
  })
  .catch((err) => {
    console.error('MongoDB bağlantı hatası:', err.message);
    process.exit(1);
  });
