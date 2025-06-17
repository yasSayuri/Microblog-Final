const mongoose = require('mongoose');

async function conectarMongo() {
  try {
    await mongoose.connect('mongodb://localhost:27017/microblogfinal', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Conectado ao MongoDB');
  } catch (err) {
    console.error('❌ Erro ao conectar no MongoDB', err);
  }
}

module.exports = conectarMongo;
